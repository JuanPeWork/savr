import { Injectable, computed, inject, signal } from '@angular/core';
import { Movement } from '@domain/finance/models/movement.model';
import { MovementMapper } from '@core/storage/mappers/movement.mapper';
import { SalaryState } from './salary.state';
import { MOVEMENT_COLLECTION } from '@core/storage/collection.tokens';
import { AuthService } from '@core/auth/auth.service';
import { CopyRecurringMovementsUseCase } from '@domain/finance/usecases/copy-recurring-movements.usecase';

@Injectable({ providedIn: 'root' })
export class MovementState {

  private collection = inject(MOVEMENT_COLLECTION);
  private readonly salaryState = inject(SalaryState);
  private authService = inject(AuthService);
  private copyUseCase = inject(CopyRecurringMovementsUseCase);

  private readonly _movements = signal<Movement[]>([]);
  readonly movements = this._movements.asReadonly();

  readonly total = computed(() =>
    this._movements().reduce((sum, m) => sum + m.amount, 0)
  );

  readonly movementsOfActiveSalary = computed(() => {
    const salary = this.salaryState.activeSalary();
    if (!salary) return [];
    return this._movements().filter(m => m.belongsToSalary(salary.id));
  });

  getById(id: string): Movement | undefined {
    return this._movements().find(m => m.id === id);
  }

  async add(movement: Movement) {
    await this.collection.create(MovementMapper.toDTO(movement));
    this._movements.update(list => [...list, movement]);
  }

  async update(movement: Movement) {
    await this.collection.update(MovementMapper.toDTO(movement));
    this._movements.update(list =>
      list.map(m => m.id === movement.id ? movement : m)
    );
  }

  async remove(id: string) {
    await this.collection.delete(id);
    this._movements.update(list => list.filter(m => m.id !== id));
  }

  async removeBySalaryId(salaryId: string) {
    const toRemove = this._movements().filter(m => m.belongsToSalary(salaryId));
    await this.collection.deleteBatch(toRemove.map(m => m.id));
    this._movements.update(list => list.filter(m => !m.belongsToSalary(salaryId)));
  }

  async copyRecurringMovements(fromSalaryId: string, toSalaryId: string) {
    const copies = this.copyUseCase.execute(
      this._movements(),
      fromSalaryId,
      toSalaryId
    );

    if (copies.length === 0) return;

    await this.collection.createBatch(copies.map(m => MovementMapper.toDTO(m)));
    this._movements.update(list => [...list, ...copies]);
  }

  private _initPromise?: Promise<void>;
  private _loadedForUid?: string | null;

  async ready(): Promise<void> {
    const currentUid = this.authService.currentUid;
    if (!currentUid) return;

    if (this._loadedForUid !== currentUid) {
      this._initPromise = undefined;
      this._movements.set([]);
    }

    if (!this._initPromise) {
      this._loadedForUid = currentUid;
      this._initPromise = this.init();
    }
    return this._initPromise;
  }

  private async init(): Promise<void> {
    const stored = await this.collection.getAll();
    if (!stored?.length) return;
    this._movements.set(stored.map(dto => MovementMapper.toDomain(dto)));
  }

  async reset() {
    this._movements.set([]);
    await this.collection.clear();
  }

  clearLocal() {
    this._movements.set([]);
    this._initPromise = undefined;
    this._loadedForUid = undefined;
  }
}
