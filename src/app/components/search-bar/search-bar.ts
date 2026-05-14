import { Component, inject } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-search-bar',
  imports: [IonSearchbar],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  constructor(
    private toastController: ToastController,
  ) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.navigateAndReload(),
      error: () => this.navigateAndReload(),
    });
  }

  private navigateAndReload(): void {
    this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Wyszukiwanie lokalizacji nie dostępne w tej wersji aplikacji. Przepraszamy za niedogodności.',
      duration: 5000,
      position: 'bottom',
    });
    await toast.present();
  }
}
