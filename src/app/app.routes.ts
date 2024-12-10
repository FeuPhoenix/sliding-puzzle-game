import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { PaymentComponent } from './payment/payment.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'puzzle', component: PuzzleComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [() => authGuard()]
  },
  { 
    path: 'achievements', 
    component: AchievementsComponent,
    canActivate: [() => authGuard()]
  },
  { 
    path: 'payment', 
    component: PaymentComponent,
    canActivate: [() => authGuard()]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Catch all route
];