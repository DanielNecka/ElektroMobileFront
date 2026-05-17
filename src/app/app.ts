import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ElektroMobileFront');
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      const url = this.router.url;
      if (user && (url === '/login' || url === '/')) {
        this.router.navigate(['/main']);
        return;
      }
      if (!user && (url === '/' || url === '')) {
        this.router.navigate(['/login']);
      }
    });
  }
}