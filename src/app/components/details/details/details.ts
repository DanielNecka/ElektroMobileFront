import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OrderInfo } from '../order-info/order-info';
import { OrderDetail } from "../order-detail/order-detail";
import { Order } from "../order/order";

@Component({
  selector: 'app-details',
  imports: [IonicModule, OrderInfo, OrderDetail, Order],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  protected step: number = 1;
  private _touchHandler: ((e: Event) => void) | null = null;

  protected onAccordionChange(isOpen: boolean): void {
    isOpen ? this.lockModal() : this.unlockModal();
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
