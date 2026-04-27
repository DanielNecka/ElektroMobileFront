import { Component, Input } from '@angular/core';
import { IonFab, IonFabButton, IonSegment, IonSegmentButton, IonLabel} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { layers, map } from 'ionicons/icons';

@Component({
  selector: 'app-controls',
  imports: [IonFab, IonFabButton, IonSegment, IonSegmentButton, IonLabel],
  templateUrl: './controls.html',
  styleUrl: './controls.scss',
})
export class Controls {
  @Input() map!: mapboxgl.Map;
  @Input() onGoToPosition!: () => void;
  protected is3D: boolean = true;
  protected showTheme: boolean = false;
  protected bearing = 0;

  constructor() {
    addIcons({ layers, map });
  }

  ngOnInit() {
    this.map.on('rotate', () => {
      this.bearing = this.map.getBearing();
    });
  }

  protected pointNorth(): void {
    this.map.easeTo({
      bearing: 0,
      duration: 600
    });
  }

  protected toggle3D(): void {
    this.is3D = !this.is3D;

    this.map.easeTo({
      pitch: this.is3D ? 60 : 0,
      duration: 600
    });
  }

  protected toggleTheme(): void {
    this.showTheme = !this.showTheme;
  }

  protected changeTheme(event: any): void {
    const value = event.detail.value;
    const presets: Record<string, string> = {
      default: 'dawn',
      segment: 'dusk'
    };
    this.map.setConfigProperty('basemap', 'lightPreset', presets[value]);
  }
}
