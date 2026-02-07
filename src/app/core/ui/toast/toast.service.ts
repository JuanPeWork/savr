import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from './toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {

  private readonly _toasts = signal<Toast[]>([]);
  private readonly _timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'success', duration = 3000) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type
    };

    this._toasts.update(t => [...t, toast]);

    const timeoutId = setTimeout(() => {
      this.remove(toast.id);
    }, duration);

    this._timeouts.set(toast.id, timeoutId);
  }

  remove(id: string) {
    const timeoutId = this._timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this._timeouts.delete(id);
    }

    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
