import { Injectable } from '@angular/core';
import { Movement } from '../models/movement.model';

@Injectable()
export class CopyRecurringMovementsUseCase {

  /**
   * Copia los movimientos recurrentes de un salario a otro.
   *
   * Regla de negocio: solo se copian los movimientos marcados
   * como recurrentes que pertenecen al salario de origen.
   */
  execute(
    movements: Movement[],
    fromSalaryId: string,
    toSalaryId: string
  ): Movement[] {
    return movements
      .filter(m => m.belongsToSalary(fromSalaryId) && m.isRecurring)
      .map(m => m.copyForSalary(toSalaryId));
  }
}
