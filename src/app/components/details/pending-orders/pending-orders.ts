import { Component, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pending-orders',
  imports: [IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle],
  templateUrl: './pending-orders.html',
  styleUrl: './pending-orders.scss',
})
export class PendingOrders implements OnDestroy {
  @Output() orderAccepted = new EventEmitter<any>();
  protected orders: any[] = [];
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private unsubscribe: () => void;

  constructor() {
    this.unsubscribe = this.ordersService.listenToPendingOrders(orders => {
      this.orders = orders;
    });
  }

  private auth = inject(Auth);

  protected async onAccept(order: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await this.ordersService.acceptOrder(order.id, user.uid);
    this.orderAccepted.emit(order);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}