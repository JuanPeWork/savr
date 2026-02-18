import { Movement } from '@domain/finance/models/movement.model';

export interface MovementDTO {
  id: string;
  salaryId: string;
  type: 'income' | 'expense';
  amount: number;
  category: 'fixed' | 'variable' | 'saving' | 'leisure';
  paymentMethod: 'cash' | 'card' | 'domiciled' | 'transfer';
  icon: string;
  concept: string;
  date: string;
  note?: string;
  isRecurring?: boolean;
}

export class MovementMapper {
  static toDomain(dto: MovementDTO): Movement {
    return new Movement(dto);  // el constructor valida
  }

  static toDTO(model: Movement): MovementDTO {
    return {
      id: model.id,
      salaryId: model.salaryId,
      type: model.type,
      amount: model.amount,
      category: model.category,
      paymentMethod: model.paymentMethod,
      icon: model.icon,
      concept: model.concept,
      date: model.date,
      isRecurring: model.isRecurring,
      ...(model.note && { note: model.note })
    };
  }
}
