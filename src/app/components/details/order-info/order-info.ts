import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonProgressBar  } from '@ionic/angular/standalone';
import { OrderSummary } from '../order-detail/order-detail';

@Component({
  selector: 'app-order-info',
  imports: [ IonProgressBar ],
  templateUrl: './order-info.html',
  styleUrl: './order-info.scss',
})
export class OrderInfo implements OnChanges {
  @Input() orderSummary: OrderSummary | null = null;
  @Input() acceptedOrder: any = null;
  @Input() etaAmount: string = '';
  protected buffer = 0.2;
  protected progress = 0.1;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.acceptedOrder?.statusId) {
       switch(this.acceptedOrder.statusId) {
         case 'Kierowca przydzielony':
           this.progress = 0.5; this.buffer = 0.6; break;
         case 'Ładowanie':
           this.progress = 0.8; this.buffer = 0.9; break;
         case 'Zakończone':
           this.progress = 1.0; this.buffer = 1.0; break;
         default:
           this.progress = 0.1; this.buffer = 0.2; break;
       }
    }
  }

  protected formatPrice(value: number): string {
    return value.toFixed(2);
  }
}