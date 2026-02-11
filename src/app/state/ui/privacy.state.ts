import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/storage/local-storage.service';

const STORAGE_KEY = 'hide_amounts';

@Injectable({ providedIn: 'root' })
export class PrivacyState {

  private storage = inject(LocalStorageService);

  readonly hideAmounts = signal(false);

  async ready(): Promise<void> {
    const stored = await this.storage.get<boolean>(STORAGE_KEY);
    this.hideAmounts.set(stored ?? false);
  }

  async toggleAmounts(): Promise<void> {
    this.hideAmounts.update(v => !v);
    await this.storage.set(STORAGE_KEY, this.hideAmounts());
  }
}
