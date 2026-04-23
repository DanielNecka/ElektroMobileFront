import { Component, ViewChild } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-order-info',
  imports: [IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList],
  templateUrl: './order-info.html',
  styleUrl: './order-info.scss',
})
export class OrderInfo {
  selectedBrand = '';
  selectedModel = '';
  models: string[] = [];

  brands: { brand: string, models: string[] }[] = [
    { brand: 'Tesla', models: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
    { brand: 'Rivian', models: ['R1T', 'R1S'] },
    { brand: 'BMW', models: ['iX', 'i4', 'i5'] },
    { brand: 'Audi', models: ['e-tron', 'Q4 e-tron', 'e-tron GT'] },
    { brand: 'Volkswagen', models: ['ID.3', 'ID.4', 'ID.7'] },
    { brand: 'Hyundai', models: ['IONIQ 5', 'IONIQ 6'] },
    { brand: 'Kia', models: ['EV6', 'EV9'] },
    { brand: 'Mercedes', models: ['EQA', 'EQB', 'EQS'] },
    { brand: 'Polestar', models: ['Polestar 2', 'Polestar 3'] },
    { brand: 'Volvo', models: ['EX30', 'EX40', 'EX90'] },
  ];

  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;

  selectBrand(brand: string, models: string[]) {
    this.selectedBrand = brand;
    this.models = models;
    this.selectedModel = '';
    this.accordionGroup.value = 'model';
  }

  selectModel(model: string) {
    this.selectedModel = model;
    this.accordionGroup.value = undefined;
  }
}