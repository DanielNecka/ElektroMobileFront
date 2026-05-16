import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Firestore, collection, query, where, onSnapshot, doc } from '@angular/fire/firestore';

export interface CreateOrderRequest {
  brand: string;
  model: string;
  kwh: number;
  locationLat: number;
  locationLng: number;
}

export interface OrderRecord {
  id: string;
  userId: string;
  brand: string;
  model: string;
  kwh: number;
  locationLat: number;
  locationLng: number;
  totalPrice: number;
  statusId: string;
  driverUid?: string;
  driverLocationLat?: number;
  driverLocationLng?: number;
  createdAt?: { _seconds: number; _nanoseconds: number } | string | Date;
  updatedAt?: { _seconds: number; _nanoseconds: number } | string | Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  async createOrder(order: CreateOrderRequest) {
    const token = await this.authService.getToken();
    
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

  watchLocation(callback: (coords: { latitude: number; longitude: number }) => void): number | null {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return null;
    }
    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => console.warn(error),
      { enableHighAccuracy: true }
    );
  }

  clearWatchLocation(watchId: number): void {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  private firestore = inject(Firestore);  

  listenToPendingOrders(callback: (orders: any[]) => void): () => void {
    const q = query(
      collection(this.firestore, 'orders'),
      where('statusId', '==', 'Oczekuje na kierowce')
    );
    return onSnapshot(q, snapshot => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }

  listenToOrder(orderId: string, callback: (order: any) => void): () => void {
    const docRef = doc(this.firestore, 'orders', orderId);
    return onSnapshot(docRef, docSnap => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      }
    });
  }

  async acceptOrder(orderId: string): Promise<void> {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    await firstValueFrom(
      this.http.patch(`${environment.backendUrl}/orders/${orderId}/accept`, {}, { headers })
    );
  }

  async getMyOrders(): Promise<OrderRecord[]> {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return firstValueFrom(
      this.http.get<OrderRecord[]>(`${environment.backendUrl}/orders`, { headers })
    );
  }

  async updateOrderStatus(orderId: string, statusId: string): Promise<void> {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    await firstValueFrom(
      this.http.patch(`${environment.backendUrl}/orders/${orderId}/status`, { statusId }, { headers })
    );
  }
}
