import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { toSignal } from '@angular/core/rxjs-interop'
import { Movement, MovementCategory, MovementType, PaymentMethod } from '@domain/finance/interfaces/movements.interface';
import { MovementState } from '@state/finance/movement.state';
import dayjs from 'dayjs';
import { SalaryState } from '../../state/finance/salary.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-movement-form',
  imports: [ReactiveFormsModule],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MovementForm implements OnInit {

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private salaryState = inject(SalaryState);
  private movementState = inject(MovementState);
  private router = inject(Router);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  readonly isEditMode = signal(false);
  private editingId: string | null = null;

  movementForm = this.fb.nonNullable.group({
    type: [false, Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    category: ['variable', Validators.required],
    concept: ['', [Validators.required, Validators.minLength(3)]],
    paymentMethod: ['card', Validators.required],
    date: ['', Validators.required],
    note: ['']
  });

  formUtils = FormUtils;

  readonly isIncome = toSignal(
    this.movementForm.get('type')!.valueChanges,
    { initialValue: this.movementForm.get('type')!.value }
  );

  readonly movementType = computed<MovementType>(() =>
    this.isIncome() ? 'income' : 'expense'
  );

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const movement = this.movementState.getById(id);
      if (movement) {
        this.isEditMode.set(true);
        this.editingId = id;
        this.loadMovementData(movement);
      }
    }
  }

  private loadMovementData(movement: Movement) {
    this.movementForm.patchValue({
      type: movement.type === 'income',
      amount: movement.amount,
      category: movement.category,
      concept: movement.concept,
      paymentMethod: movement.paymentMethod,
      date: movement.date,
      note: movement.note ?? ''
    });
  }

  onSumit() {
    const isValid = this.movementForm.valid;
    this.movementForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.movementForm.getRawValue();

    const movement: Movement = {
      id: this.editingId ?? crypto.randomUUID(),
      salaryId: this.salaryState.activeSalary()!.id,
      amount: formValue.amount,
      type: this.isIncome() ? 'income' : 'expense' as MovementType,
      category: formValue.category as MovementCategory,
      paymentMethod: formValue.paymentMethod as PaymentMethod,
      concept: formValue.concept,
      date: dayjs(formValue.date).format('YYYY-MM-DD'),
      note: formValue.note
    };

    if (this.isEditMode()) {
      this.movementState.update(movement);
      this.toast.show('Movimiento actualizado correctamente');
    } else {
      this.movementState.add(movement);
      this.toast.show('Movimiento guardado correctamente');
    }

    this.router.navigate(['/finance-space/movements']);
  }

  goBack() {
    this.location.back();
  }

}
