import { Injectable, computed, inject, signal } from '@angular/core';
import { Movement } from '@domain/finance/interfaces/movements.interface';
import { SalaryState } from './salary.state';
import { STORAGE } from 'src/app/app.config';

const STORAGE_KEY = 'movements'

@Injectable({ providedIn: 'root' })
export class MovementState {

  storageService = inject(STORAGE);
  private readonly salaryState = inject(SalaryState);

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

  constructor() {
    this._initPromise = this.init();
  }

  async add(movement: Movement) {
    this._movements.update(list => [...list, movement]);
    await this.persist();
  }

  private async init(): Promise<void> {
    const stored = await this.storageService.get<Movement[]>(STORAGE_KEY);
    if (!stored) return;
    this._movements.set(stored);
  }

  ready(): Promise<void> {
    return this._initPromise ?? Promise.resolve();
  }

  remove(id: string) {
    this._movements.update(list => list.filter(m => m.id !== id));
    this.persist();
  }

  async removeBySalaryId(salaryId: string) {
    this._movements.update(list => list.filter(m => m.salaryId !== salaryId));
    await this.persist();
  }

  async update(movement: Movement) {
    this._movements.update(
      list => list.map(m => m.id === movement.id ? movement : m)
    );
    await this.persist()
  }

  private persist() {
    this.storageService.set(STORAGE_KEY, this._movements())
  }

  reset() {
    this._movements.set([]);
    this.storageService.remove(STORAGE_KEY);
  }

}
