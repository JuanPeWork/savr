import { Injectable, signal } from "@angular/core";
import { AlertOptions } from "./alert-config.interface";

interface QueuedAlert {
  options: AlertOptions;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private _state = signal<AlertOptions | null>(null);
  private _queue: QueuedAlert[] = [];

  readonly state = this._state.asReadonly();

  open(options: AlertOptions): Promise<boolean> {
    return new Promise(resolve => {
      this._queue.push({ options, resolve });

      if (this._queue.length === 1) {
        this.showNext();
      }
    });
  }

  confirm() {
    this.resolveAndNext(true);
  }

  cancel() {
    this.resolveAndNext(false);
  }

  private showNext() {
    const next = this._queue[0];
    if (next) {
      this._state.set(next.options);
    }
  }

  private resolveAndNext(value: boolean) {
    const current = this._queue.shift();
    current?.resolve(value);

    if (this._queue.length > 0) {
      this.showNext();
    } else {
      this._state.set(null);
    }
  }
}
