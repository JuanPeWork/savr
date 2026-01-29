import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import dayjs from '@core/date/daysjs.config';
import { FormUtils } from '@utils/form-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryState } from '@state/finance/salary.state';
import { Salary } from '@domain/finance/interfaces/salary.interface';

@Component({
  selector: 'app-setup',
  imports: [ReactiveFormsModule],
  templateUrl: './setup.html',
  styleUrl: './setup.css'
})
export default class Setup implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private salaryState = inject(SalaryState);
  private router = inject(Router);

  formUtils = FormUtils;

  readonly isEditMode = signal(false);
  private editingId: string | null = null;

  setupForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    distribution: this.fb.nonNullable.group({
      fixed: [50, [Validators.required, Validators.min(0)]],
      variable: [20, [Validators.required, Validators.min(0)]],
      savings: [20, [Validators.required, Validators.min(0)]],
      leisure: [10, [Validators.required, Validators.min(0)]],
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

  onSumit() {
    const isValid = this.setupForm.valid;
    this.setupForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.setupForm.getRawValue();

    if (this.isEditMode()) {
      const updatedSalary: Salary = {
        ...formValue,
        id: this.editingId!,
        date: this.salaryState.getById(this.editingId!)!.date,
      };
      this.salaryState.update(updatedSalary);
    } else {
      const newSalary: Salary = {
        ...formValue,
        id: crypto.randomUUID(),
        date: dayjs().toISOString(),
      };
      this.salaryState.create(newSalary);
    }

    this.router.navigate(['finance-space']);
  }

}
