import { Component } from '@angular/core';
import { IonInput, IonItem, IonList, IonButton } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register-page',
  imports: [IonInput, IonItem, IonList, IonButton],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
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
