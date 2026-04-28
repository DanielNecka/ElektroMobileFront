import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private injector = inject(EnvironmentInjector);

  currentUser$ = user(this.auth);

  login(email: string, password: string) {
    return from(
      runInInjectionContext(this.injector, () =>
        signInWithEmailAndPassword(this.auth, email, password)
      )
    );
  }

  async register(email: string, password: string, name: string, phone: string): Promise<{ backendOk: boolean }> {
    const credential = await runInInjectionContext(this.injector, () =>
      createUserWithEmailAndPassword(this.auth, email, password)
    );
    const token = await credential.user.getIdToken();

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    try {
      await firstValueFrom(this.http.post(
        `${environment.backendUrl}/auth/register`,
        { name, email, phone },
        { headers }
      ));
      return { backendOk: true };
    } catch {
      return { backendOk: false };
    }
  }

  logout() {
    return from(
      runInInjectionContext(this.injector, () => signOut(this.auth))
    );
  }

  async getToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken();
  }
}