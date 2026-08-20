import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiTester } from './api-tester/api-tester';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ApiTester],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
