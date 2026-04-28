import { Component, Output, EventEmitter } from '@angular/core';
import { IonInput, IonItem, IonList, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [IonInput, IonItem, IonList, IonButton, IonSpinner, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  @Output() switchToRegister = new EventEmitter<void>();

  protected email = '';
  protected password = '';
  protected isSubmitting = false;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      await firstValueFrom(this.authService.login(this.email, this.password));
      this.isSubmitting = false;
      this.router.navigate(['/main']);
    } catch (err: any) {
      this.isSubmitting = false;
    }
  }

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Sposób logowania niedostępny w tej wersji aplikacji. Przepraszamy za niedogodności.',
      duration: 5000,
      position: 'bottom',
    });
    await toast.present();
  }
}