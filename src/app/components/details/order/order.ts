import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonButton, IonContent, IonPicker, IonPickerColumn, IonPickerColumnOption } from '@ionic/angular/standalone';

export interface OrderData {
  brand: string;
  model: string;
  kwh: number;
  location: 'current' | 'custom';
}

@Component({
  selector: 'app-order',
  imports: [IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonButton, IonContent, IonPicker, IonPickerColumn, IonPickerColumnOption],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order {
  private models: string[] = [];
  private isOrderAccordionOpen: boolean = false;

  protected selectedBrand: string = '';
  protected selectedModel: string = '';
  protected selectedKwh: number = 5;
  protected selectedLocation: 'current' | 'custom' = 'current';
  protected brands: { brand: string, models: string[] }[] = [
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
  @Output() orderAccordionOpenChange = new EventEmitter<boolean>();
  @Output() orderSubmit = new EventEmitter<OrderData>();

  protected selectModel(brand: string, model: string): void  {
    this.selectedBrand = brand;
    this.selectedModel = model;
    this.accordionGroup.value = undefined;
    this.isOrderAccordionOpen = false;
    this.orderAccordionOpenChange.emit(false);
  }

  protected onAccordionChange(event: CustomEvent): void {
    this.isOrderAccordionOpen = Boolean(event.detail?.value);
    this.orderAccordionOpenChange.emit(this.isOrderAccordionOpen);
  }

  protected onInnerAccordionChange(event: CustomEvent): void {
    event.stopPropagation();
  }

  protected onKwhChange(event: CustomEvent): void {
    const value = Number(event.detail?.value);
    if (!Number.isNaN(value)) {
      this.selectedKwh = value;
    }
  }

  protected onLocationChange(event: CustomEvent): void {
    const value = event.detail?.value as 'current' | 'custom';
    if (value === 'current' || value === 'custom') {
      this.selectedLocation = value;
    }
  }

  protected submitOrder(): void {
    if (!this.selectedBrand || !this.selectedModel) {
      return;
    }

    this.orderSubmit.emit({
      brand: this.selectedBrand,
      model: this.selectedModel,
      kwh: this.selectedKwh,
      location: this.selectedLocation,
    });
  }
}
