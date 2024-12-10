import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ScoreService, Score } from '../services/score.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to the Sliding Puzzle Game</h1>
          <p class="text-lg text-gray-600 mb-8">Challenge yourself with our interactive sliding puzzle!</p>
          
          <!-- Logged In Content -->
          <ng-container *ngIf="authService.isLoggedIn(); else loggedOut">
            <button (click)="goToPuzzle()" 
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Play Now
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Scores Section -->
            <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Top Scores -->
              <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Top Scores</h2>
                <div *ngIf="topScores.length > 0; else noTopScores" class="space-y-4">
                  <div *ngFor="let score of topScores; let i = index" 
                       class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <span class="w-8 h-8 flex items-center justify-center rounded-full" 
                            [class.bg-yellow-400]="i === 0"
                            [class.bg-gray-300]="i === 1"
                            [class.bg-orange-400]="i === 2"
                            [class.text-white]="i < 3">
                        {{ i + 1 }}
                      </span>
                      <span class="ml-3 font-medium">{{ score.user_name }}</span>
                    </div>
                    <span class="font-bold">{{ score.points }} pts</span>
                  </div>
                </div>
                <ng-template #noTopScores>
                  <p class="text-gray-500 text-center">No scores yet. Be the first to play!</p>
                </ng-template>
              </div>

              <!-- Your Scores -->
              <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Your High Scores</h2>
                <div *ngIf="userScores.length > 0; else noUserScores" class="space-y-4">
                  <div *ngFor="let score of userScores; let i = index" 
                       class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <span class="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                        {{ i + 1 }}
                      </span>
                      <div class="ml-3">
                        <span class="font-medium">{{ score.points }} pts</span>
                        <span class="text-sm text-gray-500 block">{{ score.achieved_at | date:'medium' }}</span>
                      </div>
                    </div>
                    <span class="text-sm text-gray-500">{{ score.achievement_type }}</span>
                  </div>
                </div>
                <ng-template #noUserScores>
                  <p class="text-gray-500 text-center">You haven't played any games yet. Start playing now!</p>
                </ng-template>
              </div>
            </div>
          </ng-container>

          <!-- Logged Out Content -->
          <ng-template #loggedOut>
            <div class="space-y-4">
              <p class="text-gray-600 mb-8">Sign up or log in to track your scores and compete with others!</p>
              <div class="flex justify-center space-x-4">
                <button (click)="goToSignUp()" 
                        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign Up
                </button>
                <button (click)="goToLogIn()" 
                        class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Log In
                </button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  topScores: Score[] = [];
  userScores: Score[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,
    private scoreService: ScoreService
  ) {}

  ngOnInit() {
    this.loadScores();
  }

  loadScores() {
    // Always load top scores
    this.scoreService.getTopScores().subscribe({
      next: (scores) => this.topScores = scores,
      error: (error) => console.error('Error loading top scores:', error)
    });

    // Load user scores only if logged in
    if (this.authService.isLoggedIn()) {
      this.scoreService.getUserScores().subscribe({
        next: (scores) => this.userScores = scores,
        error: (error) => console.error('Error loading user scores:', error)
      });
    }
  }

  goToPuzzle() {
    this.router.navigate(['/puzzle']);
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  goToLogIn() {
    this.router.navigate(['/login']);
  }
}