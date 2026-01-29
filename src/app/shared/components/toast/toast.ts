import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {

  readonly toastService = inject(ToastService);

}
