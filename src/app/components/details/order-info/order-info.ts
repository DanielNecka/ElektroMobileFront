import { Component } from '@angular/core';
import { IonProgressBar  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-order-info',
  imports: [ IonProgressBar ],
  templateUrl: './order-info.html',
  styleUrl: './order-info.scss',
})
export class OrderInfo {
  protected buffer = 0.06;
  protected progress = 0.2;
}