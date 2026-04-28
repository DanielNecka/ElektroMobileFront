import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './pages/login/login';
import { Main } from "./pages/main/main";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Main],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ElektroMobileFront');
  //isLoggedIn: boolean = false;
}