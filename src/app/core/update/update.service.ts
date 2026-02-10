import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { AlertService } from '@core/ui/alert/alert.service';

@Injectable({ providedIn: 'root' })
export class UpdateService {

  private swUpdate = inject(SwUpdate);
  private alertService = inject(AlertService);

  init() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
    ).subscribe(() => this.promptUpdate());
  }

  private async promptUpdate() {
    const confirmed = await this.alertService.open({
      title: 'Nueva versión disponible',
      message: 'Hay una actualización disponible. Pulsa para actualizar la aplicación.',
      confirmText: 'Actualizar',
      variant: 'info',
    });

    if (confirmed) {
      document.location.reload();
    }
  }
}
