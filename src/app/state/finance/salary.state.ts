import { computed, inject, Injectable, signal } from "@angular/core";

import { Salary } from "@domain/finance/interfaces/salary.interface";
import { STORAGE } from "src/app/app.config";

const STORAGE_KEY = 'finance_space';
const SELECTED_KEY = 'selected_salary_id';

@Injectable({ providedIn: 'root' })
export class SalaryState {

  private storageService = inject(STORAGE);

  private readonly _salaries = signal<Salary[]>([]);
  private readonly _selectedId = signal<string | null>(null);

  readonly salaries = this._salaries.asReadonly();
  readonly hasAnySalary = computed(() => this._salaries().length > 0);

  readonly activeSalary = computed(() => {
    const list = this._salaries();
    if (!list.length) return null;

    const selectedId = this._selectedId();
    if (selectedId) {
      const selected = list.find(s => s.id === selectedId);
      if (selected) return selected;
    }

    return list[list.length - 1];
  });

  private _initPromise?: Promise<void>;

  constructor() {
    this._initPromise = this.init();
  }

  ready(): Promise<void> {
    return this._initPromise ?? Promise.resolve();
  }

  async create(salary: Salary) {
    this._salaries.update((s) => [...s, salary]);
    await this.storageService.set<Salary[]>(STORAGE_KEY, this._salaries());
    await this.select(salary.id);
  }

  async update(salary: Salary) {
    this._salaries.update((list) =>
      list.map((s) => s.id === salary.id ? salary : s)
    );
    await this.storageService.set<Salary[]>(STORAGE_KEY, this._salaries());
  }

  async delete(id: string) {
    this._salaries.update((list) => list.filter((s) => s.id !== id));
    await this.storageService.set<Salary[]>(STORAGE_KEY, this._salaries());

    if (this._selectedId() === id) {
      this._selectedId.set(null);
      await this.storageService.remove(SELECTED_KEY);
    }
  }

  getById(id: string): Salary | undefined {
    return this._salaries().find((s) => s.id === id);
  }

  async select(id: string) {
    this._selectedId.set(id);
    await this.storageService.set<string>(SELECTED_KEY, id);
  }

  private async init() {
    const stored = await this.storageService.get<Salary[]>(STORAGE_KEY);
    const selectedId = await this.storageService.get<string>(SELECTED_KEY);

    if (stored && Array.isArray(stored)) {
      this._salaries.set(stored);
    }

    if (selectedId) {
      this._selectedId.set(selectedId);
    }
  }

  reset() {
    this._salaries.set([]);
    this._selectedId.set(null);
    this.storageService.remove(STORAGE_KEY);
    this.storageService.remove(SELECTED_KEY);
  }

}
