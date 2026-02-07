import { computed, inject, Injectable, signal } from "@angular/core";

import { Salary } from "@domain/finance/interfaces/salary.interface";
import { SALARY_COLLECTION } from "@core/storage/collection.tokens";
import { LocalStorageService } from "@core/storage/local-storage.service";
import { AuthService } from "@core/auth/auth.service";

const SELECTED_KEY = 'selected_salary_id';

@Injectable({ providedIn: 'root' })
export class SalaryState {

  private collection = inject(SALARY_COLLECTION);
  private storage = inject(LocalStorageService);
  private authService = inject(AuthService);

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

    return [...list].sort((a, b) => b.date.localeCompare(a.date))[0];
  });

  private _initPromise?: Promise<void>;
  private _loadedForUid?: string | null;

  async ready(): Promise<void> {
    const currentUid = this.authService.currentUid;
    if (!currentUid) return;

    if (this._loadedForUid !== currentUid) {
      this._initPromise = undefined;
      this._salaries.set([]);
      this._selectedId.set(null);
    }

    if (!this._initPromise) {
      this._loadedForUid = currentUid;
      this._initPromise = this.init();
    }
    return this._initPromise;
  }

  async create(salary: Salary) {
    await this.collection.create(salary);
    this._salaries.update((s) => [...s, salary]);
    await this.select(salary.id);
  }

  async update(salary: Salary) {
    await this.collection.update(salary);
    this._salaries.update((list) =>
      list.map((s) => s.id === salary.id ? salary : s)
    );
  }

  async delete(id: string) {
    await this.collection.delete(id);
    this._salaries.update((list) => list.filter((s) => s.id !== id));

    if (this._selectedId() === id) {
      this._selectedId.set(null);
      await this.storage.remove(SELECTED_KEY);
    }
  }

  getById(id: string): Salary | undefined {
    return this._salaries().find((s) => s.id === id);
  }

  async select(id: string) {
    this._selectedId.set(id);
    await this.storage.set<string>(SELECTED_KEY, id);
  }

  private async init() {
    const stored = await this.collection.getAll();
    const selectedId = await this.storage.get<string>(SELECTED_KEY);

    if (stored && Array.isArray(stored)) {
      this._salaries.set(stored);
    }

    if (selectedId) {
      this._selectedId.set(selectedId);
    }
  }

  async reset() {
    this._salaries.set([]);
    this._selectedId.set(null);
    await this.collection.clear();
    await this.storage.remove(SELECTED_KEY);
  }

  clearLocal() {
    this._salaries.set([]);
    this._selectedId.set(null);
    this._initPromise = undefined;
    this._loadedForUid = undefined;
  }
}
