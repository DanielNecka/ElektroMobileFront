import { Component, Output, EventEmitter } from '@angular/core';
import { IonInput, IonItem, IonList, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [IonInput, IonItem, IonList, IonButton, IonSpinner, FormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  @Output() switchToLogin = new EventEmitter<void>();

  protected name = '';
  protected email = '';
  protected phone = '';
  protected password = '';
  protected passwordConfirm = '';
  protected isSubmitting = false;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  async register() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      await this.authService.register(this.email, this.password, this.name, this.phone);
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