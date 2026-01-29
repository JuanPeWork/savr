import { computed, inject, Injectable } from "@angular/core";
import { SalaryState } from './salary.state';
import { MovementState } from "./movement.state";
import { MovementCategory } from "@domain/finance/interfaces/movements.interface";
import { CategoryStat, StatType } from "@domain/finance/interfaces/category-stat.interface";


@Injectable({ providedIn: 'root' })
export class FinanceState {

  salaryState = inject(SalaryState);
  movementState = inject(MovementState);

  readonly balance = computed(() => {
    const activeSalary = this.salaryState.activeSalary();

    if (!activeSalary) return 0;

    const movements = this.movementState.movementsOfActiveSalary();
    const totalMovements = this.calculateMovementsTotal(movements);

    return activeSalary.amount + totalMovements;
  });

  readonly fixedExpenses = computed(() => this.calculateCategoryStats('fixed', 'Fijos', '🏠', 'error'));
  readonly variableExpenses = computed(() => this.calculateCategoryStats('variable', 'Variables', '🛒', 'warning'));
  readonly savingExpenses = computed(() => this.calculateCategoryStats('saving', 'Ahorro', '💰', 'success'));
  readonly leisureExpenses = computed(() => this.calculateCategoryStats('leisure', 'Ocio', '🎮', 'info'));

  private calculateCategoryStats(category: MovementCategory, name: string, icon: string, color: StatType): CategoryStat {
    const activeSalary = this.salaryState.activeSalary();
    const movements = this.movementState.movementsOfActiveSalary();

    const total = movements
      .filter(m => m.category === category && m.type === 'expense')
      .reduce((sum, m) => sum + m.amount, 0);

    const totalIncomes = movements
      .filter(m => m.type === 'income')
      .reduce((sum, m) => sum + m.amount, 0);

    const availableMoney = (activeSalary?.amount ?? 0) + totalIncomes;
    const percentage = availableMoney > 0 ? (total / availableMoney) * 100 : 0;

    return { total, percentage, name, icon, color };
  }

  private calculateMovementsTotal(movements: { type: string; amount: number }[]): number {
    return movements.reduce((total, movement) => {
      return movement.type === 'income'
        ? total + movement.amount
        : total - movement.amount;
    }, 0);
  }
}
