import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-active-order',
  imports: [IonButton],
  templateUrl: './active-order.html',
  styleUrl: './active-order.scss',
})
export class ActiveOrder {
  @Input() order: any = null;
  @Output() orderFinished = new EventEmitter<void>();
  private ordersService = inject(OrdersService);

  protected openMaps(): void {
    window.open(
      `https://www.google.com/maps?q=${this.order.locationLat},${this.order.locationLng}`,
      '_blank'
    );
  }

  protected async confirmArrival(): Promise<void> {
    if (this.order?.id) {
       this.order.statusId = 'Ładowanie';
       await this.ordersService.updateOrderStatus(this.order.id, 'Ładowanie');
    }
  }

  protected async finishOrder(): Promise<void> {
    if (this.order?.id) {
       await this.ordersService.updateOrderStatus(this.order.id, 'Zakończone');
       this.order = null;
       this.orderFinished.emit();
    }
  }
}