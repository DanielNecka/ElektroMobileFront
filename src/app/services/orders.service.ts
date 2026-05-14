import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CreateOrderRequest {
  brand: string;
  model: string;
  kwh: number;
  locationLat: number;
  locationLng: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  async createOrder(order: CreateOrderRequest) {
    const token = await this.authService.getToken();
    console.log('Token:', token);
    console.log('Order payload:', order);
    
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Headers:', headers.keys());
    
    return firstValueFrom(
      this.http.post(`${environment.backendUrl}/orders`, order, { headers })
    );
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
