import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SalaryState } from '@state/finance/salary.state';
import { MovementItem } from "./components/movement-item/movement-item";
import { MovementState } from '@state/finance/movement.state';
import { FinanceState } from '../../state/finance/finance.state';
import { MovementType } from '@domain/finance/interfaces/movements.interface';
import { DatePipe } from '@angular/common';

type FilterType = 'all' | MovementType;

@Component({
  selector: 'app-movements',
  imports: [MovementItem, RouterLink, DatePipe],
  templateUrl: './movements.html',
  styleUrl: './movements.css'
})
export default class Movements {

  private router = inject(Router);
  salaryState = inject(SalaryState);
  movementState = inject(MovementState);
  financeState = inject(FinanceState);

  readonly filter = signal<FilterType>('all');

  readonly filteredMovements = computed(() => {
    const movements = this.movementState.movementsOfActiveSalary();
    const currentFilter = this.filter();

    if (currentFilter === 'all') return movements;
    return movements.filter(m => m.type === currentFilter);
  });

  editSalary() {
    const salaryId = this.salaryState.activeSalary()?.id;
    if (salaryId) {
      this.router.navigate(['/setup', salaryId]);
    }
  }

}
