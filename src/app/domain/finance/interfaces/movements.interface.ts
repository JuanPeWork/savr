export type MovementType = 'income' | 'expense';
export type MovementCategory = 'fixed' | 'variable' | 'saving' | 'leisure';
export type PaymentMethod = 'cash' | 'card' | 'domiciled';

export interface Movement {
  id: string;
  salaryId: string;
  type: MovementType;
  amount: number;
  category: MovementCategory;
  paymentMethod: PaymentMethod;
  concept: string;
  date: string;
  note?: string;
}
