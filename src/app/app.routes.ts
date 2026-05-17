import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Main } from './pages/main/main';
import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: Login, canActivate: [loginGuard] },
	{ path: 'main', component: Main, canActivate: [authGuard] },
	{ path: '**', redirectTo: 'login' }
];
