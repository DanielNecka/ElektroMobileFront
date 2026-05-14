import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonRadio, IonRadioGroup, IonButton } from '@ionic/angular/standalone';
import { OrderData } from '../order/order';

export interface OrderSummary extends OrderData {
  paymentMethod: 'cash' | 'transfer' | 'applepay';
  pricePerKwh: number;
  totalPrice: number;
}

@Component({
  selector: 'app-order-detail',
  imports: [IonRadio, IonRadioGroup, IonButton],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail {
  @Input({ required: true }) orderData!: OrderData;
  @Output() orderDetailSubmit = new EventEmitter<OrderSummary>();

  protected paymentMethod: 'cash' | 'transfer' | 'applepay' = 'cash';
  protected pricePerKwh = 2;
  protected travelFee = 30;

  protected onPaymentChange(event: CustomEvent): void {
    const value = event.detail?.value as 'cash' | 'transfer' | 'applepay';
    if (value === 'cash' || value === 'transfer' || value === 'applepay') {
      this.paymentMethod = value;
    }
  }

  protected submitPayment(): void {
    const totalPrice = Number((this.orderData.kwh * this.pricePerKwh + this.travelFee).toFixed(2));

    this.orderDetailSubmit.emit({
      ...this.orderData,
      paymentMethod: this.paymentMethod,
      pricePerKwh: this.pricePerKwh,
      totalPrice,
    });
  }

  protected formatPrice(value: number): string {
    return value.toFixed(2);
  }
}
