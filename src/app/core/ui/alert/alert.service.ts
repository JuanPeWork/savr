import { Injectable, signal } from "@angular/core";
import { AlertOptions } from "./alert-config.interface";

@Injectable({ providedIn: 'root' })
export class AlertService {
  private _state = signal<AlertOptions | null>(null);
  private _resolver?: (value: boolean) => void;

  open(options: AlertOptions): Promise<boolean> {
    this._state.set(options);

    return new Promise(resolve => {
      this._resolver = resolve;
    });
  }

  confirm() {
    this._resolver?.(true);
    this.close();
  }

  cancel() {
    this._resolver?.(false);
    this.close();
  }

  private close() {
    this._state.set(null);
    this._resolver = undefined;
  }

  readonly state = this._state.asReadonly();
}
