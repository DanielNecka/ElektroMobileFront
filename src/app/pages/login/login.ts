import { Component } from '@angular/core';
import { RegisterPage } from '../../components/login/register-page/register-page';
import { LoginPage } from '../../components/login/login-page/login-page';

@Component({
  selector: 'app-login',
  imports: [LoginPage, RegisterPage],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected page: "login" | "register" = "register"; 
}
