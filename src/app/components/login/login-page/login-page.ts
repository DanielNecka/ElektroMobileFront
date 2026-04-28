import { Component } from '@angular/core';
import { IonInput, IonItem, IonList, IonButton } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-page',
  imports: [IonInput, IonItem, IonList, IonButton],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  constructor(private toastController: ToastController) {}

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Sposób logowania niedostępny w tej wersji aplikacji. Przepraszamy za niedogodności.',
      duration: 5000,
      position: 'bottom',
    });

    await toast.present();
  }
}
