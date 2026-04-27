import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OrderInfo } from '../order-info/order-info';
import { OrderDetail } from "../order-detail/order-detail";

@Component({
  selector: 'app-details',
  imports: [IonicModule, OrderInfo, OrderDetail],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  step: number = 1;
}
