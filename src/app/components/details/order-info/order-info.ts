import { Component, Input } from '@angular/core';
import { IonProgressBar  } from '@ionic/angular/standalone';
import { OrderSummary } from '../order-detail/order-detail';

@Component({
  selector: 'app-order-info',
  imports: [ IonProgressBar ],
  templateUrl: './order-info.html',
  styleUrl: './order-info.scss',
})
export class OrderInfo {
  @Input() orderSummary: OrderSummary | null = null;
  protected buffer = 0.06;
  protected progress = 0.2;

  protected formatPrice(value: number): string {
    return value.toFixed(2);
  }
}