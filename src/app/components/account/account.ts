import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonFooter,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSkeletonText,
  IonNote,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ModalController, ToastController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { AuthService, UserProfile } from '../../services/auth.service';
import { OrdersService, OrderRecord } from '../../services/orders.service';
import {
  tsToDate,
  statusBadgeColor,
  roleLabel,
  initials,
} from './account-helpers';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonFooter,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSkeletonText,
    IonNote,
    IonSpinner,
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {
  private authService = inject(AuthService);
  private ordersService = inject(OrdersService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private router = inject(Router);
  private auth = inject(Auth);

  protected profile: UserProfile | null = null;
  protected orders: OrderRecord[] = [];
  protected photoURL: string | null = null;
  protected loadingProfile = true;
  protected loadingOrders = true;
  protected loggingOut = false;

  ngOnInit(): void {
    this.photoURL = this.auth.currentUser?.photoURL ?? null;
    void this.loadProfile();
    void this.loadOrders();
  }

  protected dismiss(): void {
    void this.modalController.dismiss();
  }

  protected async logout(): Promise<void> {
    if (this.loggingOut) return;
    this.loggingOut = true;

    try {
      await new Promise<void>((resolve, reject) => {
        this.authService.logout().subscribe({
          next: () => resolve(),
          error: (err) => reject(err),
        });
      });
    } catch {
      // ignore — still navigate to /login
    }

    this.loggingOut = false;
    await this.modalController.dismiss();
    await this.router.navigate(['/login'], { replaceUrl: true });
  }

  protected memberSince(value: UserProfile['createdAt']): string {
    const date = tsToDate(value);
    if (!date) return '';
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  protected orderDate(value: OrderRecord['createdAt']): string {
    const date = tsToDate(value);
    if (!date) return '';
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  protected statusColor(status: string): string {
    return statusBadgeColor(status);
  }

  protected roleText(role?: string): string {
    return roleLabel(role);
  }

  protected initialsFor(name?: string | null): string {
    return initials(name ?? '');
  }

  protected formatPrice(value: number | undefined | null): string {
    if (value == null) return '0.00';
    return Number(value).toFixed(2);
  }

  protected onAvatarError(): void {
    this.photoURL = null;
  }

  private async loadProfile(): Promise<void> {
    try {
      this.profile = await this.authService.getMyProfile();
    } catch {
      await this.showError('Nie udało się załadować profilu');
    } finally {
      this.loadingProfile = false;
    }
  }

  private async loadOrders(): Promise<void> {
    try {
      const list = await this.ordersService.getMyOrders();
      this.orders = (list ?? []).slice().sort((a, b) => {
        const aDate = tsToDate(a.createdAt)?.getTime() ?? 0;
        const bDate = tsToDate(b.createdAt)?.getTime() ?? 0;
        return bDate - aDate;
      });
    } catch {
      await this.showError('Nie udało się załadować historii zamówień');
    } finally {
      this.loadingOrders = false;
    }
  }

  private async showError(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }
}
