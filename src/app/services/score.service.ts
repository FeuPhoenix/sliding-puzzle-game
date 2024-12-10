import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Score {
  id?: number;
  user_id?: number;
  points: number;
  achievement_type: string;
  description?: string;
  user_name?: string;
  achieved_at?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getTopScores(): Observable<Score[]> {
    return this.http.get<Score[]>(`${this.apiUrl}/scores/top`);
  }

  getUserScores(): Observable<Score[]> {
    return this.http.get<Score[]>(`${this.apiUrl}/scores/user`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  saveScore(points: number, moves: number, time: number, gridSize: number): Observable<Score> {
    const difficultyNames = ['Easy', 'Medium', 'Hard', 'Expert', 'Master'];
    const difficulty = Math.min(Math.max(Math.floor((gridSize - 1) / 1), 0), 4);
    const achievementType = `${difficultyNames[difficulty]} ${gridSize}x${gridSize}`;
    
    const scoreData = {
      points: points,
      achievement_type: achievementType,
      description: `Completed ${gridSize}x${gridSize} puzzle in ${moves} moves with ${time}s time`
    };

    return this.http.post<Score>(`${this.apiUrl}/scores`, scoreData, {
      headers: this.authService.getAuthHeaders()
    });
  }
} 