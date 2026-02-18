import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { FormUtils } from '@utils/form-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';
import { Salary } from '@domain/finance/models/salary.model';
import { SelectOnFocusDirective } from '@shared/directives/select-on-focus.directive';
import { ToastService } from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-setup',
  imports: [ReactiveFormsModule, SelectOnFocusDirective],
  templateUrl: './setup.html',
  styleUrl: './setup.css'
})
export default class Setup implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private salaryState = inject(SalaryState);
  private movementState = inject(MovementState);
  private router = inject(Router);
  private toast = inject(ToastService);


  formUtils = FormUtils;

  readonly isEditMode = signal(false);
  private editingId: string | null = null;

  setupForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    distribution: this.fb.nonNullable.group({
      fixed:    [50, [Validators.required, Validators.min(0)]],
      variable: [20, [Validators.required, Validators.min(0)]],
      saving:   [20, [Validators.required, Validators.min(0)]],
      leisure:  [10, [Validators.required, Validators.min(0)]],
    },
    { validators: [FormUtils.distributionValidator] })
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const salary = this.salaryState.getById(id);
      if (salary) {
        this.isEditMode.set(true);
        this.editingId = id;
        this.loadSalaryData(salary);
      }
    }
  }

  private loadSalaryData(salary: Salary) {
    this.setupForm.patchValue({
      amount: salary.amount,
      distribution: salary.distribution
    });
  }

  readonly submitting = signal(false);

  async onSubmit() {
    this.setupForm.markAllAsTouched();
    if (!this.setupForm.valid || this.submitting()) return;

    this.submitting.set(true);

    const { amount, distribution } = this.setupForm.getRawValue();

    try {
      if (this.isEditMode()) {
        const original = this.salaryState.getById(this.editingId!)!;

        const updated = new Salary({
          id: original.id,
          date: original.date,
          amount,
          distribution,
        });

        await this.salaryState.update(updated);

      } else {
        const previousSalary = this.salaryState.activeSalary();

        const newSalary = new Salary({ amount, distribution });

        await this.salaryState.create(newSalary);

        if (previousSalary) {
          await this.movementState.copyRecurringMovements(
            previousSalary.id,
            newSalary.id
          );
        }
      }

      this.router.navigate(['finance-space']);

    } catch (error) {
    this.toast.show('Error al guardar', 'error');
   } finally {
      this.submitting.set(false);
    }
  }

  goBack() {
    this.location.back();
  }
}
