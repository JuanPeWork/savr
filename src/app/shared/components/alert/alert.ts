import { Component, inject } from '@angular/core';
import { AlertService } from '@core/ui/alert/alert.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {
  alertConfirm = inject(AlertService)
}
