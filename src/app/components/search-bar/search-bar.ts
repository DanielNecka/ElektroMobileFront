import { Component, inject } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ModalController, ToastController } from '@ionic/angular';
import { Account } from '../account/account';

@Component({
  selector: 'app-search-bar',
  imports: [IonSearchbar],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

  async openAccount(): Promise<void> {
    const modal = await this.modalController.create({
      component: Account,
    });
    await modal.present();
  }

  async showToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Wyszukiwanie lokalizacji nie dostępne w tej wersji aplikacji. Przepraszamy za niedogodności.',
      duration: 5000,
      position: 'bottom',
    });
    await toast.present();
  }
}
