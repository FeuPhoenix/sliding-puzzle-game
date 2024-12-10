import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ScoreService, Score } from '../services/score.service';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  points?: number;
  date?: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 text-center mb-8">Achievements</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let achievement of achievements" 
               class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
               [class.opacity-50]="!achievement.unlocked">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-12 h-12 flex items-center justify-center rounded-full" 
                       [class.bg-blue-50]="achievement.unlocked"
                       [class.bg-gray-50]="!achievement.unlocked">
                    <i [class]="achievement.icon + ' text-2xl'"
                       [class.opacity-40]="!achievement.unlocked"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold text-gray-900">{{ achievement.name }}</h3>
                    <p class="text-sm text-gray-500">{{ achievement.description }}</p>
                  </div>
                </div>
                <div *ngIf="achievement.unlocked" class="flex flex-col items-end">
                  <span class="text-sm font-medium text-gray-900">{{ achievement.points }} pts</span>
                  <span class="text-xs text-gray-500">{{ achievement.date | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  `]
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[] = [
    {
      id: 'easy_puzzle',
      name: 'Easy Puzzle Master',
      description: 'Complete an easy puzzle',
      icon: 'fa-solid fa-puzzle-piece',
      unlocked: false
    },
    {
      id: 'medium_puzzle',
      name: 'Medium Puzzle Master',
      description: 'Complete a medium puzzle',
      icon: 'fa-solid fa-puzzle-piece text-yellow-500',
      unlocked: false
    },
    {
      id: 'hard_puzzle',
      name: 'Hard Puzzle Master',
      description: 'Complete a hard puzzle',
      icon: 'fa-solid fa-puzzle-piece text-orange-500',
      unlocked: false
    },
    {
      id: 'expert_puzzle',
      name: 'Expert Puzzle Master',
      description: 'Complete an expert puzzle',
      icon: 'fa-solid fa-puzzle-piece text-red-500',
      unlocked: false
    },
    {
      id: 'master_puzzle',
      name: 'Master Puzzle Master',
      description: 'Complete a master puzzle',
      icon: 'fa-solid fa-crown text-yellow-400',
      unlocked: false
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete a puzzle in under 1 minute',
      icon: 'fa-solid fa-bolt text-yellow-500',
      unlocked: false
    },
    {
      id: 'efficiency',
      name: 'Efficiency Expert',
      description: 'Complete a puzzle in under 20 moves',
      icon: 'fa-solid fa-gauge-high text-green-500',
      unlocked: false
    },
    {
      id: 'high_scorer',
      name: 'High Scorer',
      description: 'Score over 2000 points in a single game',
      icon: 'fa-solid fa-trophy text-yellow-500',
      unlocked: false
    }
  ];

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.loadAchievements();
  }

  private loadAchievements() {
    this.scoreService.getUserScores().subscribe({
      next: (scores: Score[]) => {
        scores.forEach(score => {
          // Check achievement types
          if (score.achievement_type.includes('Easy')) {
            this.unlockAchievement('easy_puzzle', score);
          }
          if (score.achievement_type.includes('Medium')) {
            this.unlockAchievement('medium_puzzle', score);
          }
          if (score.achievement_type.includes('Hard')) {
            this.unlockAchievement('hard_puzzle', score);
          }
          if (score.achievement_type.includes('Expert')) {
            this.unlockAchievement('expert_puzzle', score);
          }
          if (score.achievement_type.includes('Master')) {
            this.unlockAchievement('master_puzzle', score);
          }

          // Check points for high score achievement
          if (score.points >= 2000) {
            this.unlockAchievement('high_scorer', score);
          }

          // Check description for speed and efficiency achievements
          const description = score.description || '';
          if (description.includes('time: 60s') || description.includes('with 60s time')) {
            this.unlockAchievement('speed_demon', score);
          }
          if (description.includes('moves: 20') || description.includes('in 20 moves')) {
            this.unlockAchievement('efficiency', score);
          }
        });
      },
      error: (error) => {
        console.error('Error loading achievements:', error);
      }
    });
  }

  private unlockAchievement(id: string, score: Score) {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.points = score.points;
      achievement.date = score.achieved_at || score.created_at;
    }
  }
} 