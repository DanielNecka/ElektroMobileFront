import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map {
  map!: mapboxgl.Map;
  mapConfig: mapboxgl.MapOptions;

  constructor() {
    this.mapConfig = {
      container: 'map-container',
      style: 'mapbox://styles/danielnecka/cmoakir4f001h01s3a7tgagwu',
      center: [19.9450, 50.0647],
      zoom: 18.5,
      pitch: 60,
      bearing: 0,
      config: {
        basemap: {
          theme: 'monochrome',
          lightPreset: 'dawn' //dawn | dusk
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
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      geolocate.trigger();

      geolocate.on('geolocate', (e: any) => {
        const position: [number, number] = [e.coords.longitude, e.coords.latitude];
        
        this.map.easeTo({
          center: position,
          zoom: 18.5,
          offset: [0, 200],
          duration: 1000 
        });
      });
    });
  }
}