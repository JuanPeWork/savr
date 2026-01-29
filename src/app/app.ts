import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/components/toast/toast";
import { Alert } from "./shared/components/alert/alert";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('savr');
}
