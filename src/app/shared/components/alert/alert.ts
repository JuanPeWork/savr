import { Component, computed, inject } from '@angular/core';
import { AlertService } from '@core/ui/alert/alert.service';
import { AlertOptions } from '@core/ui/alert/alert-config.interface';

const variantClasses: Record<NonNullable<AlertOptions['variant']>, string> = {
  danger: 'btn-error',
  warning: 'btn-warning',
  info: 'btn-accent'
};

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {
  alertConfirm = inject(AlertService);

  btnClass = computed(() => {
    const variant = this.alertConfirm.state()?.variant;
    return variant ? variantClasses[variant] : 'btn-error';
  });
}
