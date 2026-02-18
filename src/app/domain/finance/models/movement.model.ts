export type MovementType = 'income' | 'expense';
export type MovementCategory = 'fixed' | 'variable' | 'saving' | 'leisure';
export type PaymentMethod = 'cash' | 'card' | 'domiciled' | 'transfer';

interface MovementData {
  id?: string;
  salaryId: string;
  type: MovementType;
  amount: number;
  category: MovementCategory;
  paymentMethod: PaymentMethod;
  icon: string;
  concept: string;
  date: string;
  note?: string;
  isRecurring?: boolean;
}

export class Movement {
  readonly id: string;
  readonly salaryId: string;
  readonly type: MovementType;
  readonly amount: number;
  readonly category: MovementCategory;
  readonly paymentMethod: PaymentMethod;
  readonly icon: string;
  readonly concept: string;
  readonly date: string;
  readonly note?: string;
  readonly isRecurring: boolean;

  constructor(data: MovementData) {
    if (data.amount <= 0)
      throw new Error('El importe debe ser positivo');
    if (!data.concept?.trim())
      throw new Error('El concepto es obligatorio');
    if (!data.salaryId)
      throw new Error('El movimiento debe pertenecer a un salario');

    this.id = data.id ?? crypto.randomUUID();
    this.isRecurring = data.isRecurring ?? false;
    this.note = data.note?.trim() || undefined;
    this.salaryId = data.salaryId;
    this.type = data.type;
    this.amount = data.amount;
    this.category = data.category;
    this.paymentMethod = data.paymentMethod;
    this.icon = data.icon;
    this.concept = data.concept.trim();
    this.date = data.date;
  }

  isExpense(): boolean {
    return this.type === 'expense';
  }

  isIncome(): boolean {
    return this.type === 'income';
  }

  belongsToSalary(salaryId: string): boolean {
    return this.salaryId === salaryId;
  }

  copyForSalary(newSalaryId: string): Movement {
    return new Movement({
      ...this,
      id: crypto.randomUUID(),
      salaryId: newSalaryId,
      date: new Date().toISOString(),
    });
  }

  static calculateTotalIncome(movements: Movement[]): number {
    return movements
      .filter(m => m.isIncome())
      .reduce((sum, m) => sum + m.amount, 0);
  }

  static calculateTotalExpenses(movements: Movement[]): number {
    return movements
      .filter(m => m.isExpense())
      .reduce((sum, m) => sum + m.amount, 0);
  }

}
