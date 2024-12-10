import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { ScoreService } from '../services/score.service';
import { environment } from '../../environments/environment';
import { animate, transition, trigger } from '@angular/animations';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div *ngIf="authService.isLoggedIn(); else loginPrompt" class="max-w-4xl mx-auto">
        <!-- Game Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Sliding Puzzle</h1>
          <div class="flex justify-center space-x-8">
            <div class="text-lg">
              <span class="font-semibold">Moves:</span> {{ moves }}
            </div>
            <div class="text-lg">
              <span class="font-semibold">Time:</span> {{ timer }}s
            </div>
            <div class="text-lg">
              <span class="font-semibold">Score:</span> {{ score }}
            </div>
          </div>
        </div>

        <!-- Game Controls -->
        <div class="flex justify-center space-x-4 mb-8">
          <button (click)="initializePuzzle()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            New Game
          </button>
          <select [(ngModel)]="difficulty" 
                  (change)="onDifficultyChange()"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option [value]="1">Easy (2x2)</option>
            <option [value]="2">Medium (3x3)</option>
            <option [value]="3">Hard (4x4)</option>
            <option [value]="4">Expert (5x5)</option>
            <option [value]="5">Master (6x6)</option>
          </select>
          <!-- Test Win Button (only in development) -->
          <button *ngIf="!environment.production" 
                  (click)="testWin()"
                  class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 focus:outline-none">
            Test Win
          </button>
        </div>

        <!-- Puzzle Grid -->
        <div class="relative mx-auto" 
             [style.width.px]="baseSize" 
             [style.height.px]="baseSize">
          <!-- Background Image -->
          <img [src]="imageUrl" 
               class="absolute top-0 left-0 w-full h-full opacity-20">
          
          <!-- Puzzle Tiles -->
          <div class="relative w-full h-full">
            <div *ngFor="let tile of tiles; let i = index"
                 class="absolute cursor-pointer transition-all duration-200"
                 [style.width.px]="tileWidth"
                 [style.height.px]="tileHeight"
                 [style.left.px]="(i % gridSize) * tileWidth"
                 [style.top.px]="Math.floor(i / gridSize) * tileHeight"
                 (click)="moveTile(i)"
                 [@tileSlide]="tile">
              <div *ngIf="tile !== 0" 
                   class="w-full h-full border-2 border-white rounded-lg overflow-hidden shadow-lg relative">
                <div class="w-full h-full bg-cover bg-no-repeat"
                     [style.background-image]="'url(' + imageUrl + ')'"
                     [style.background-size]="baseSize + 'px ' + baseSize + 'px'"
                     [style.background-position]="getTileBackgroundPosition(tile)">
                  <!-- Tile Number -->
                  <div class="absolute top-2 left-2 bg-white bg-opacity-75 rounded-full w-8 h-8 flex items-center justify-center text-gray-800 font-bold shadow-md">
                    {{ tile }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Game Complete Modal -->
        <div *ngIf="showComplete" 
             class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-center mb-4">Puzzle Complete!</h2>
            <div class="text-center mb-6">
              <p class="text-lg mb-2">Score: {{ score }}</p>
              <p class="text-gray-600">Moves: {{ moves }} | Time: {{ maxTime - timer }}s</p>
            </div>
            <div class="flex justify-center space-x-4">
              <button (click)="initializePuzzle()" 
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Play Again
              </button>
              <button (click)="goToHome()" 
                      class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Login Prompt Template -->
      <ng-template #loginPrompt>
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="text-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 class="text-2xl font-bold text-gray-900">Login Required</h2>
              <p class="text-gray-600 mt-2">Please log in to play the puzzle game and track your scores.</p>
            </div>
            <div class="flex justify-center space-x-4">
              <button (click)="router.navigate(['/login'])" 
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Login
              </button>
              <button (click)="router.navigate(['/signup'])" 
                      class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  animations: [
    trigger("tileSlide", [
      transition("* => *", [
        animate("200ms ease-out")
      ])
    ])
  ]
})
export class PuzzleComponent implements OnInit, OnDestroy {
  environment = environment;
  
  // Add Math to component scope for template
  Math = Math;
  
  // Game properties
  tiles: number[] = [];
  gridSize: number = 3;
  moves: number = 0;
  gameComplete: boolean = false;
  baseSize: number = 500;
  tileWidth: number = 0;
  tileHeight: number = 0;
  imageUrl: string = "https://picsum.photos/500/500";
  showComplete: boolean = false;
  timer: number = 150;
  maxTime: number = 150;
  timerInterval: any;
  maxMoves: number = 500;
  moveWeight: number = 10;
  timeWeight: number = 5;
  score: number = 0;
  timeTaken: number = 0;
  difficulty: number = 2;

  constructor(
    public router: Router,
    public authService: AuthService,
    private scoreService: ScoreService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.updateGridSize();
      this.initializePuzzle();
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onDifficultyChange() {
    this.updateGridSize();
    this.initializePuzzle();
  }

  getTileBackgroundPosition(tile: number): string {
    if (tile === 0) return 'center';
    tile -= 1; // Convert to 0-based index
    const row = Math.floor(tile / this.gridSize);
    const col = tile % this.gridSize;
    const x = -(col * (this.baseSize / this.gridSize));
    const y = -(row * (this.baseSize / this.gridSize));
    return `${x}px ${y}px`;
  }

  updateGridSize() {
    switch (Number(this.difficulty)) {
      case 1:
        this.gridSize = 2;
        this.maxTime = 60;
        break;
      case 2:
        this.gridSize = 3;
        this.maxTime = 150;
        break;
      case 3:
        this.gridSize = 4;
        this.maxTime = 300;
        break;
      case 4:
        this.gridSize = 5;
        this.maxTime = 600;
        break;
      case 5:
        this.gridSize = 6;
        this.maxTime = 1000;
        break;
      default:
        this.gridSize = 3;
        this.maxTime = 150;
        break;
    }
    this.tileWidth = this.baseSize / this.gridSize;
    this.tileHeight = this.baseSize / this.gridSize;
    this.timer = this.maxTime;
  }

  initializePuzzle() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    // Load a new random image
    this.imageUrl = `https://picsum.photos/${this.baseSize}/${this.baseSize}?random=${Date.now()}`;
    
    this.tiles = Array.from({ length: this.gridSize * this.gridSize - 1 }, (_, i) => i + 1);
    this.tiles.push(0);
    this.shuffleTiles();
    this.moves = 0;
    this.gameComplete = false;
    this.showComplete = false;
    this.timer = this.maxTime;
    this.score = 0;
    
    // Start the timer
    this.timerInterval = setInterval(() => {
      if (this.timer > 0 && !this.gameComplete) {
        this.timer--;
        if (this.timer === 0) {
          this.handleGameOver();
        }
      }
    }, 1000);
  }

  handleGameOver() {
    clearInterval(this.timerInterval);
    this.gameComplete = true;
    this.showComplete = true;
  }

  moveTile(index: number) {
    if (this.gameComplete || this.timer === 0) return;

    const emptyIndex = this.tiles.indexOf(0);
    if (this.canMove(index, emptyIndex)) {
      [this.tiles[index], this.tiles[emptyIndex]] = [this.tiles[emptyIndex], this.tiles[index]];
      this.moves++;
      
      if (this.isComplete()) {
        this.gameComplete = true;
        this.showComplete = true;
        this.calculateScore();
        this.triggerConfetti();
        clearInterval(this.timerInterval);
      }
    }
  }

  canMove(index: number, emptyIndex: number): boolean {
    const row = Math.floor(index / this.gridSize);
    const emptyRow = Math.floor(emptyIndex / this.gridSize);
    const col = index % this.gridSize;
    const emptyCol = emptyIndex % this.gridSize;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  }

  isComplete(): boolean {
    return this.tiles.every((tile, index) => 
      index === this.tiles.length - 1 ? tile === 0 : tile === index + 1
    );
  }

  calculateScore() {
    // Base score calculation based on grid size
    const baseScore = this.gridSize * 1000;
    
    // Time bonus (more time remaining = higher bonus)
    const timeBonus = Math.max(0, this.timer) * 10;
    
    // Move penalty (fewer moves = higher score)
    const movesPenalty = Math.min(this.moves * 5, baseScore / 2);
    
    // Calculate final score
    this.score = Math.max(100, baseScore + timeBonus - movesPenalty);

    // Save the score
    if (this.authService.isLoggedIn()) {
      const timeTaken = this.maxTime - this.timer;
      
      this.scoreService.saveScore(
        this.score,
        this.moves,
        timeTaken,
        this.gridSize
      ).subscribe({
        next: (savedScore) => {
          console.log('Score saved successfully:', savedScore);
          // Update the displayed score with the saved score
          this.score = savedScore.points;
          // Show the completion modal
          this.showComplete = true;
          this.triggerConfetti();
        },
        error: (error) => {
          console.error('Error saving score:', error);
          // Still show the completion modal even if score saving fails
          this.showComplete = true;
          this.triggerConfetti();
        }
      });
    }
  }

  triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  shuffleTiles() {
    let attempts = 0;
    const maxAttempts = 100;

    do {
      // Shuffle the tiles
      for (let i = this.tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
      }
      attempts++;
    } while (!this.isSolvable() && attempts < maxAttempts);

    // If we couldn't find a solvable configuration, create a nearly solved puzzle
    if (attempts >= maxAttempts) {
      this.createNearlySolvedPuzzle();
    }
  }

  createNearlySolvedPuzzle() {
    // Create a solved puzzle first
    this.tiles = Array.from({ length: this.gridSize * this.gridSize - 1 }, (_, i) => i + 1);
    this.tiles.push(0);

    // Make a few random valid moves to slightly shuffle it
    for (let i = 0; i < 10; i++) {
      const emptyIndex = this.tiles.indexOf(0);
      const validMoves = this.getValidMoves(emptyIndex);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        [this.tiles[emptyIndex], this.tiles[randomMove]] = [this.tiles[randomMove], this.tiles[emptyIndex]];
      }
    }
  }

  getValidMoves(emptyIndex: number): number[] {
    const validMoves: number[] = [];
    const row = Math.floor(emptyIndex / this.gridSize);
    const col = emptyIndex % this.gridSize;

    // Check all possible moves (up, down, left, right)
    const possibleMoves = [
      { row: row - 1, col }, // up
      { row: row + 1, col }, // down
      { row, col: col - 1 }, // left
      { row, col: col + 1 }  // right
    ];

    for (const move of possibleMoves) {
      if (move.row >= 0 && move.row < this.gridSize && 
          move.col >= 0 && move.col < this.gridSize) {
        validMoves.push(move.row * this.gridSize + move.col);
      }
    }

    return validMoves;
  }

  isSolvable(): boolean {
    let inversions = 0;
    const emptyRow = Math.floor(this.tiles.indexOf(0) / this.gridSize);

    // Count inversions
    for (let i = 0; i < this.tiles.length - 1; i++) {
      for (let j = i + 1; j < this.tiles.length; j++) {
        if (this.tiles[i] && this.tiles[j] && this.tiles[i] > this.tiles[j]) {
          inversions++;
        }
      }
    }

    // For odd-sized grids
    if (this.gridSize % 2 === 1) {
      return inversions % 2 === 0;
    }
    // For even-sized grids
    else {
      const emptyFromBottom = this.gridSize - emptyRow;
      return (emptyFromBottom % 2 === 0) === (inversions % 2 === 0);
    }
  }

  testWin() {
    // Sort tiles to winning position
    this.tiles = Array.from({ length: this.gridSize * this.gridSize - 1 }, (_, i) => i + 1);
    this.tiles.push(0);
    
    // Set some reasonable stats
    this.moves = 20;
    this.timer = Math.floor(this.maxTime * 0.8); // 80% of max time remaining
    
    // Trigger win
    this.gameComplete = true;
    this.showComplete = true;
    this.calculateScore();
    this.triggerConfetti();
    clearInterval(this.timerInterval);
  }
}
