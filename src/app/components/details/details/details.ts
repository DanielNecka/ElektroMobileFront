import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OrderInfo } from '../order-info/order-info';

@Component({
  selector: 'app-details',
  imports: [IonicModule, OrderInfo],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  step: number = 1;
}
