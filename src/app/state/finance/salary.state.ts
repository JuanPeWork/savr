import { computed, inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "@core/storage/local-storage.service";
import { Salary } from "@domain/finance/interfaces/salary.interface";

const STORAGE_KEY = 'finance_space';
const SELECTED_KEY = 'selected_salary_id';

@Injectable({ providedIn: 'root' })
export class SalaryState {

  private localStorageService = inject(LocalStorageService);

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
    await this.localStorageService.set<Salary[]>(STORAGE_KEY, this._salaries());
    await this.select(salary.id);
  }

  async update(salary: Salary) {
    this._salaries.update((list) =>
      list.map((s) => s.id === salary.id ? salary : s)
    );
    await this.localStorageService.set<Salary[]>(STORAGE_KEY, this._salaries());
  }

  getById(id: string): Salary | undefined {
    return this._salaries().find((s) => s.id === id);
  }

  async select(id: string) {
    this._selectedId.set(id);
    await this.localStorageService.set<string>(SELECTED_KEY, id);
  }

  private async init() {
    const stored = await this.localStorageService.get<Salary[]>(STORAGE_KEY);
    const selectedId = await this.localStorageService.get<string>(SELECTED_KEY);

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
    this.localStorageService.remove(STORAGE_KEY);
    this.localStorageService.remove(SELECTED_KEY);
  }

}
