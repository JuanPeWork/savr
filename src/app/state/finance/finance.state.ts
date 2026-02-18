import { computed, inject, Injectable } from "@angular/core";
import { SalaryState } from './salary.state';
import { MovementState } from "./movement.state";
import { Movement, MovementCategory } from "@domain/finance/models/movement.model";
import { CategoryStat } from "@domain/finance/interfaces/category-stat.interface";
import { CATEGORY_DISPLAY } from "@shared/constants/category-display.const";

@Injectable({ providedIn: 'root' })
export class FinanceState {

  private salaryState = inject(SalaryState);
  private movementState = inject(MovementState);

  // ── Balance ──────────────────────────────────────────

  readonly balance = computed(() => {
    const salary = this.salaryState.activeSalary();
    if (!salary) return 0;
    return salary.calculateBalance(
      this.movementState.movementsOfActiveSalary()
    );
  });

  readonly totalExtraIncome = computed(() =>
    Movement.calculateTotalIncome(this.movementState.movementsOfActiveSalary())
  );

  // ── Estadísticas por categoría ───────────────────────

  readonly fixedExpenses = computed(() =>
    this.getCategoryStats('fixed')
  );

  readonly variableExpenses = computed(() =>
    this.getCategoryStats('variable')
  );

  readonly savingExpenses = computed(() =>
    this.getCategoryStats('saving')
  );

  readonly leisureExpenses = computed(() =>
    this.getCategoryStats('leisure')
  );

  private getCategoryStats(category: MovementCategory): CategoryStat {
    const salary = this.salaryState.activeSalary();
    const movements = this.movementState.movementsOfActiveSalary();

    if (!salary) return this.emptyStat(category);

    return salary.getCategoryStats(category, movements);
  }

  // ── Ahorros ──────────────────────────────────────────

  readonly savingsBySalary = computed(() => {
    const salaries = this.salaryState.salaries();
    const movements = this.movementState.movements();

    return salaries.map(salary => {
      const salaryMovements = movements.filter(
        m => m.belongsToSalary(salary.id) && m.category === 'saving'
      );
      const saving = salaryMovements.reduce((acc, m) =>
        m.isExpense() ? acc + m.amount : acc - m.amount
      , 0);
      return { salary, saving };
    });
  });

  readonly totalSavings = computed(() =>
    this.savingsBySalary().reduce((acc, item) => acc + item.saving, 0)
  );

  readonly averageSavings = computed(() => {
    const items = this.savingsBySalary();
    if (items.length === 0) return 0;
    return this.totalSavings() / items.length;
  });

  // ── Helpers ──────────────────────────────────────────

  private emptyStat(category: MovementCategory): CategoryStat {
    return { total: 0, percentage: 0, ...CATEGORY_DISPLAY[category] };
  }
}
