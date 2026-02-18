import { Salary } from '@domain/finance/models/salary.model';

export interface SalaryDTO {
  id: string;
  amount: number;
  distribution: {
    fixed: number;
    variable: number;
    saving: number;
    leisure: number;
  };
  date: string;
}

export class SalaryMapper {
  static toDomain(dto: SalaryDTO): Salary {
    return new Salary(dto);  // el constructor valida
  }

  static toDTO(model: Salary): SalaryDTO {
    return {
      id: model.id,
      amount: model.amount,
      distribution: model.distribution,
      date: model.date,
    };
  }
}
