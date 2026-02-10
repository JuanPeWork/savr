import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'hide_amounts';

@Injectable({ providedIn: 'root' })
export class PrivacyState {

  readonly hideAmounts = signal<boolean>(this.loadFromStorage());

  toggleAmounts(): void {
    this.hideAmounts.update(v => !v);
    localStorage.setItem(STORAGE_KEY, String(this.hideAmounts()));
  }

  private loadFromStorage(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

}
