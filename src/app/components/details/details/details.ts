import { Component, DestroyRef, ChangeDetectorRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonicModule, ToastController } from '@ionic/angular';
import { OrderInfo } from '../order-info/order-info';
import { OrderDetail, OrderSummary } from "../order-detail/order-detail";
import { Order, OrderData } from "../order/order";
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ActiveOrder } from '../active-order/active-order';
import { PendingOrders } from "../pending-orders/pending-orders";

@Component({
  selector: 'app-details',
  imports: [IonicModule, OrderInfo, OrderDetail, Order, ActiveOrder, PendingOrders],
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
  private cdr = inject(ChangeDetectorRef);
  public isDriver: boolean = false;
  private firestore = inject(Firestore);
  protected acceptedOrder: any = null;
  protected etaAmount: string = '';
  private driverWatchId: number | null = null;

  constructor() {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async user => {
        this.isOpen = !!user;

        if (user) {
          const snap = await getDoc(doc(this.firestore, 'users', user.uid));
          this.isDriver = snap.data()?.['role'] === 'driver';
        } else {
          this.isDriver = false;
        }
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
    
    await this.sendOrderToBackend(summary);
  }

  private async sendOrderToBackend(summary: OrderSummary): Promise<void> {
    try {
      let lat = 50.0647;
      let lng = 19.9450;

      if (summary.location === 'current') {
        try {
          const location = await this.ordersService.getCurrentLocation();
          lat = location.latitude;
          lng = location.longitude;
        } catch (error) {
          console.warn('Geolocation failed, using default location:', error);
        }
      }

      const response: any = await this.ordersService.createOrder({
        brand: summary.brand,
        model: summary.model,
        kwh: summary.kwh,
        locationLat: lat,
        locationLng: lng
      });

      if (response && response.id) {
        this.ordersService.listenToOrder(response.id, (orderData) => {
          this.acceptedOrder = orderData;
          if (orderData.statusId === 'Kierowca przydzielony') {
             if ((window as any).showDriverLocation) {
                const userLng = orderData.locationLng || lng;
                const userLat = orderData.locationLat || lat;
                const driverLng = orderData.driverLocationLng || (userLng + 0.005);
                const driverLat = orderData.driverLocationLat || (userLat + 0.005);
                
                (window as any).showDriverLocation([userLng, userLat], [driverLng, driverLat], 'client', (eta: string) => {
                   this.etaAmount = eta;
                   this.cdr.detectChanges();
                });
             }
          } else if (orderData.statusId === 'Zakończone') {
             setTimeout(() => {
                this.onOrderFinished();
                this.cdr.detectChanges();
             }, 3000);
          }
          this.cdr.detectChanges();
        });
      }

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

  protected async onOrderAccepted(order: any): Promise<void> {
    this.acceptedOrder = order;
    
    if (this.isDriver && (window as any).showDriverLocation) {
       this.driverWatchId = this.ordersService.watchLocation(async (location) => {
           const orderRef = doc(this.firestore, 'orders', order.id);
           try {
             await updateDoc(orderRef, {
                 driverLocationLng: location.longitude,
                 driverLocationLat: location.latitude
             });
           } catch (error) {}

           (window as any).showDriverLocation(
             [order.locationLng, order.locationLat],
             [location.longitude, location.latitude],
             'driver'
           );
       });
    }
  }

  protected onOrderFinished(): void {
    if (this.driverWatchId !== null) {
       this.ordersService.clearWatchLocation(this.driverWatchId);
       this.driverWatchId = null;
    }
    this.acceptedOrder = null;
    this.step = 1;
    this.orderData = null;
    this.orderSummary = null;
    if ((window as any).clearRoute) {
      (window as any).clearRoute();
    }
  }
}
