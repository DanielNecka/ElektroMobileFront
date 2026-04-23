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
  is3D: boolean = true;
  showTheme: boolean = false;
  bearing = 0;

  constructor() {
    addIcons({ layers, map });
  }

  ngOnInit() {
    this.map.on('rotate', () => {
      this.bearing = this.map.getBearing();
    });
  }

  pointNorth() {
    this.map.easeTo({
      bearing: 0,
      duration: 600
    });
  }

  toggle3D() {
    this.is3D = !this.is3D;

    this.map.easeTo({
      pitch: this.is3D ? 60 : 0,
      duration: 600
    });
  }

  toggleTheme() {
    this.showTheme = !this.showTheme;
  }

  changeTheme(event: any) {
    const value = event.detail.value;
    const presets: Record<string, string> = {
      default: 'dawn',
      segment: 'dusk'
    };
    this.map.setConfigProperty('basemap', 'lightPreset', presets[value]);
  }
}
