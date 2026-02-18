import { Movement } from './movement.model';
import { MovementCategory } from './movement.model';
import { CategoryStat } from '../interfaces/category-stat.interface';
import { CATEGORY_DISPLAY } from '@shared/constants/category-display.const';

export interface SalaryDistribution {
  fixed: number;
  variable: number;
  saving: number;
  leisure: number;
}

interface SalaryData {
  id?: string;
  amount: number;
  distribution: SalaryDistribution;
  date?: string;
}

export class Salary {
  readonly id: string;
  readonly amount: number;
  readonly distribution: SalaryDistribution;
  readonly date: string;

  constructor(data: SalaryData) {
    if (data.amount <= 0)
      throw new Error('El salario debe ser positivo');

    const sum = Object.values(data.distribution)
      .reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) > 0.01)
      throw new Error('La distribución debe sumar 100%');

    this.id = data.id ?? crypto.randomUUID();
    this.amount = data.amount;
    this.distribution = data.distribution;
    this.date = data.date ?? new Date().toISOString();
  }

  getBudgetForCategory(category: MovementCategory, extraIncome = 0): number {
    return (this.amount + extraIncome) * (this.distribution[category] / 100);
  }

  calculateBalance(movements: Movement[]): number {
    return this.amount
      + Movement.calculateTotalIncome(movements)
      - Movement.calculateTotalExpenses(movements);
  }

  getCategoryStats(
    category: MovementCategory,
    movements: Movement[]
  ): CategoryStat {

    const categoryMovements = movements.filter(m => m.category === category);
    const total = Movement.calculateTotalExpenses(categoryMovements);
    const extraIncome = Movement.calculateTotalIncome(movements);
    const budget = this.getBudgetForCategory(category, extraIncome);
    const percentage = budget > 0 ? (total / budget) * 100 : 0;

    return {
      total,
      percentage,
      ...CATEGORY_DISPLAY[category]
    };
  }
}
