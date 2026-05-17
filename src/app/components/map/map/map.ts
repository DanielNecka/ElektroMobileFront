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
  protected map!: mapboxgl.Map;
  private mapConfig: mapboxgl.MapOptions;
  private position: [number, number] = [19.9450, 50.0647];
  private driverMarker: mapboxgl.Marker | null = null;
  private userMarker: mapboxgl.Marker | null = null;

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
      
      (window as any).showDriverLocation = async (userCoords: [number, number], driverCoords: [number, number], role: 'driver' | 'client', cb?: (eta: string) => void) => {
         
         if (role === 'client') {
            if (!this.driverMarker) {
                const driverEl = document.createElement('div');
                driverEl.style.width = '40px';
                driverEl.style.height = '40px';
                driverEl.style.display = 'flex';
                driverEl.style.alignItems = 'center';
                driverEl.style.justifyContent = 'center';
                driverEl.innerHTML = '<span class="material-symbols-outlined" style="font-size: 40px; color: black; display: block;">directions_car</span>';
                this.driverMarker = new mapboxgl.Marker({ element: driverEl }).setLngLat(driverCoords).addTo(this.map);
            } else {
                this.driverMarker.setLngLat(driverCoords);
            }
         }

         if (role === 'driver') {
            if (!this.userMarker) {
                const userEl = document.createElement('div');
                userEl.style.width = '40px';
                userEl.style.height = '40px';
                userEl.style.display = 'flex';
                userEl.style.alignItems = 'center';
                userEl.style.justifyContent = 'center';
                userEl.innerHTML = '<span class="material-symbols-outlined" style="font-size: 40px; color: black; display: block;">electric_car</span>';
                this.userMarker = new mapboxgl.Marker({ element: userEl }).setLngLat(userCoords).addTo(this.map);
            } else {
                this.userMarker.setLngLat(userCoords);
            }
         }
         
         try {
           const query = await fetch(
             `https://api.mapbox.com/directions/v5/mapbox/driving/${driverCoords[0]},${driverCoords[1]};${userCoords[0]},${userCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
           );
           const json = await query.json();
           const data = json.routes[0];
           const route = data.geometry.coordinates;

           if (cb) {
             const minutes = Math.floor(data.duration / 60);
             cb(`${minutes} min`);
           }
           
           if (this.map.getSource('route')) {
             (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData({
               type: 'Feature',
               properties: {},
               geometry: { type: 'LineString', coordinates: route }
             });
           } else {
             this.map.addLayer({
               id: 'route',
               type: 'line',
               source: {
                 type: 'geojson',
                 data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route } }
               },
               layout: { 'line-join': 'round', 'line-cap': 'round' },
               paint: { 'line-color': '#000000', 'line-width': 5, 'line-opacity': 0.75 }
             });
           }
         } catch(e) {}
         
         const bounds = new mapboxgl.LngLatBounds(userCoords, userCoords);
         bounds.extend(driverCoords);
         this.map.fitBounds(bounds, { padding: 50 });
      };
      
      (window as any).clearRoute = () => {
         if (this.driverMarker) {
             this.driverMarker.remove();
             this.driverMarker = null;
         }
         if (this.userMarker) {
             this.userMarker.remove();
             this.userMarker = null;
         }
         if (this.map.getSource('route')) {
           this.map.removeLayer('route');
           this.map.removeSource('route');
         }
         this.goToCurrentPosition();
      };
    });
  }

  protected goToCurrentPosition(): void {
    this.map.easeTo({
      center: this.position,
      zoom: 18.5,
      offset: [0, -200],
      duration: 1000
    });
  }
}