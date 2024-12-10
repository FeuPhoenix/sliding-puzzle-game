import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg fixed w-full top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-xl font-bold text-blue-600">
                Puzzle Game
              </a>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a routerLink="/puzzle"
                 class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                 [class.border-blue-500]="router.url === '/puzzle'">
                Puzzle
              </a>
              <ng-container *ngIf="authService.isLoggedIn()">
                <a routerLink="/achievements"
                   class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                   [class.border-blue-500]="router.url === '/achievements'">
                  Achievements
                </a>
                <a routerLink="/profile"
                   class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                   [class.border-blue-500]="router.url === '/profile'">
                  Profile
                </a>
              </ng-container>
            </div>
          </div>
          <div class="flex items-center">
            <ng-container *ngIf="!authService.isLoggedIn(); else loggedIn">
              <a routerLink="/login"
                 class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
              <a routerLink="/signup"
                 class="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Sign Up
              </a>
            </ng-container>
            <ng-template #loggedIn>
              <div class="flex items-center space-x-4">
                <span class="text-gray-900 text-sm font-medium">
                  Welcome, {{ userName || 'User' }}
                </span>
                <button (click)="logout()"
                        class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Logout
                </button>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  userName: string = '';

  constructor(
    public router: Router,
    public authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.loadUserName();
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadUserName();
      } else {
        this.userName = '';
      }
    });
  }

  loadUserName() {
    const prefs = this.cookieService.getUserPreferences();
    console.log('User preferences:', prefs); // Debug log
    if (prefs && prefs.name) {
      this.userName = prefs.name;
    }
  }

  logout() {
    this.authService.logout();
    this.userName = '';
    this.router.navigate(['/login']);
  }
} 