import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
import { Controls } from "../controls/controls";

@Component({
  selector: 'app-map',
  imports: [Controls],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map {
  private map!: mapboxgl.Map;
  private mapConfig: mapboxgl.MapOptions;
  private position: [number, number] = [19.9450, 50.0647];

  constructor() {
    this.mapConfig = {
      container: 'map-container',
      style: 'mapbox://styles/danielnecka/cmoakir4f001h01s3a7tgagwu',
      center: this.position,
      zoom: 18.5,
      pitch: 60,
      bearing: 0,
      config: {
        basemap: {
          theme: 'monochrome',
          lightPreset: 'dawn'
        }
      }
    };
  }

  ngOnInit(): void {
    mapboxgl.accessToken = environment.mapboxToken;
    this.map = new mapboxgl.Map(this.mapConfig);

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });

    this.map.addControl(geolocate);

    this.map.on('load', () => {
      geolocate.trigger();

      geolocate.on('geolocate', (e: any) => {
        this.position = [e.coords.longitude, e.coords.latitude];
        this.goToCurrentPosition();
      });
    });
  }

  private goToCurrentPosition(): void {
    this.map.easeTo({
      center: this.position,
      zoom: 18.5,
      offset: [0, -200],
      duration: 1000
    });
  }
}