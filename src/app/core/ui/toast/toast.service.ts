import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from './toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {

  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'success', duration = 3000) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type
    };

    this._toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: string) {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
