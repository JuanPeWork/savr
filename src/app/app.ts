import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/components/toast/toast";
import { Alert } from "./shared/components/alert/alert";
import { UpdateService } from "./core/update/update.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('savr');

  private updateService = inject(UpdateService);

  constructor() {
    this.updateService.init();
  }
}
