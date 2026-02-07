import { Injectable, computed, inject, signal } from '@angular/core';
import { Movement } from '@domain/finance/interfaces/movements.interface';
import { SalaryState } from './salary.state';
import { MOVEMENT_COLLECTION } from '@core/storage/collection.tokens';
import { AuthService } from '@core/auth/auth.service';
import dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class MovementState {

  private collection = inject(MOVEMENT_COLLECTION);
  private readonly salaryState = inject(SalaryState);
  private authService = inject(AuthService);

  private readonly _movements = signal<Movement[]>([]);
  readonly movements = this._movements.asReadonly();
  readonly total = computed(() => this._movements().reduce((sum, m) => sum + m.amount, 0));

  readonly movementsOfActiveSalary = computed(() => {
    const salary = this.salaryState.activeSalary();
    if (!salary) return [];

    return this._movements().filter(
      m => m.salaryId === salary.id
    );
  });

  getById(id: string): Movement | undefined {
    return this._movements().find(m => m.id === id);
  }

  private _initPromise?: Promise<void>;
  private _loadedForUid?: string | null;

  async add(movement: Movement) {
    await this.collection.create(movement);
    this._movements.update(list => [...list, movement]);
  }

  private async init(): Promise<void> {
    const stored = await this.collection.getAll();
    if (!stored) return;
    this._movements.set(stored);
  }

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

  async remove(id: string) {
    await this.collection.delete(id);
    this._movements.update(list => list.filter(m => m.id !== id));
  }

  async removeBySalaryId(salaryId: string) {
    const toRemove = this._movements().filter(m => m.salaryId === salaryId);
    await this.collection.deleteBatch(toRemove.map(m => m.id));
    this._movements.update(list => list.filter(m => m.salaryId !== salaryId));
  }

  async update(movement: Movement) {
    await this.collection.update(movement);
    this._movements.update(
      list => list.map(m => m.id === movement.id ? movement : m)
    );
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

  async copyRecurringMovements(fromSalaryId: string, toSalaryId: string) {
    const recurring = this._movements().filter(
      m => m.salaryId === fromSalaryId && m.isRecurring
    );

    const copies = recurring.map(m => ({
      ...m,
      id: crypto.randomUUID(),
      salaryId: toSalaryId,
      date: dayjs().toISOString(),
    }));

    if (copies.length > 0) {
      await this.collection.createBatch(copies as Movement[]);
      this._movements.update(list => [...list, ...copies]);
    }
  }
}
