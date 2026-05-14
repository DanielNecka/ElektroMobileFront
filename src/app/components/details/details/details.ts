import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonicModule, ToastController } from '@ionic/angular';
import { OrderInfo } from '../order-info/order-info';
import { OrderDetail, OrderSummary } from "../order-detail/order-detail";
import { Order, OrderData } from "../order/order";
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-details',
  imports: [IonicModule, OrderInfo, OrderDetail, Order],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  protected isOpen = true;
  protected step: number = 1;
  protected orderData: OrderData | null = null;
  protected orderSummary: OrderSummary | null = null;
  private _touchHandler: ((e: Event) => void) | null = null;
  private authService = inject(AuthService);
  private ordersService = inject(OrdersService);
  private toastController = inject(ToastController);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.isOpen = !!user;
      });
  }

  protected onAccordionChange(isOpen: boolean): void {
    isOpen ? this.lockModal() : this.unlockModal();
  }

  protected onOrderSubmit(data: OrderData): void {
    this.orderData = data;
    this.step = 2;
  }

  protected async onOrderDetailSubmit(summary: OrderSummary): Promise<void> {
    this.orderSummary = summary;
    this.step = 3;
    
    // Send order to backend
    await this.sendOrderToBackend(summary);
  }

  private async sendOrderToBackend(summary: OrderSummary): Promise<void> {
    try {
      // Default location (Kraków center)
      let lat = 50.0647;
      let lng = 19.9450;

      if (summary.location === 'current') {
        try {
          const location = await this.ordersService.getCurrentLocation();
          lat = location.latitude;
          lng = location.longitude;
        } catch (error) {
          console.warn('Geolocation failed, using default location:', error);
          // Continue with default location
        }
      }

      await this.ordersService.createOrder({
        brand: summary.brand,
        model: summary.model,
        kwh: summary.kwh,
        locationLat: lat,
        locationLng: lng
      });

      const toast = await this.toastController.create({
        message: 'Zamówienie dodane! Czekamy na kierowcę.',
        duration: 3000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Error creating order:', error);
      const toast = await this.toastController.create({
        message: 'Błąd przy dodawaniu zamówienia. Spróbuj ponownie.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  private lockModal(): void {
    const modal = document.querySelector('ion-modal');
    this._touchHandler = (e: Event) => e.stopPropagation();
    modal?.addEventListener('touchmove', this._touchHandler, { capture: true });
  }

  private unlockModal(): void {
    const modal = document.querySelector('ion-modal');
    if (this._touchHandler) {
      modal?.removeEventListener('touchmove', this._touchHandler, { capture: true });
      this._touchHandler = null;
    }
  }
}
