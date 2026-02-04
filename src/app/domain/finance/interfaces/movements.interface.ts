export type MovementType = 'income' | 'expense';
export type MovementCategory = 'fixed' | 'variable' | 'saving' | 'leisure';
export type PaymentMethod = 'cash' | 'card' | 'domiciled' | 'transfer';


export interface Movement {
  id: string;
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
