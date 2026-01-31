import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { EmojiPicker } from "src/app/shared/components/emoji-picker/emoji-picker";
import { ConceptPreset } from '@domain/finance/interfaces/concept-preset.interface';

@Component({
  selector: 'app-movement-form',
  imports: [ReactiveFormsModule, EmojiPicker],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css'
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
  icon = signal<string>('😀');

  movementForm = this.fb.nonNullable.group({
    type: [false, Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['variable', Validators.required],
    concept: ['', [Validators.required, Validators.minLength(3)]],
    paymentMethod: ['card', Validators.required],
    date: ['', Validators.required],
    note: ['']
  });

  readonly conceptPresets: ConceptPreset[] = [
    { label: 'Alquiler', icon: '🏠' },
    { label: 'Supermercado', icon: '🛒' },
    { label: 'Gasolina', icon: '⛽' },
    { label: 'Restaurante', icon: '🍔' },
    { label: 'Netflix', icon: '🎬' },
    { label: 'Transporte', icon: '🚌' },
    { label: 'Ahorro', icon: '💰' },
  ];

  readonly conceptValue = toSignal(
    this.movementForm.controls.concept.valueChanges,
    { initialValue: this.movementForm.controls.concept.value }
  );

  readonly showConceptDropdown = signal(false);

  formUtils = FormUtils;

  readonly isIncome = toSignal(
    this.movementForm.get('type')!.valueChanges,
    { initialValue: this.movementForm.get('type')!.value }
  );

  readonly movementType = computed<MovementType>(() =>
    this.isIncome() ? 'income' : 'expense'
  );

  readonly filteredConcepts = computed(() => {
    const value = (this.conceptValue() ?? '').toLowerCase();

    if (!value) return this.conceptPresets.slice(0, 6);

    return this.conceptPresets
      .filter(c => c.label.toLowerCase().includes(value))
      .slice(0, 6);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const movement = this.movementState.getById(id);
      if (movement) {
        this.isEditMode.set(true);
        this.editingId = id;
        this.loadMovementData(movement);
        this.icon.set(movement.icon);
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

  selectConcept(item: ConceptPreset) {
    this.movementForm.controls.concept.setValue(item.label);
    this.icon.set(item.icon);
    this.showConceptDropdown.set(false);
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
      icon: this.icon(),
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
