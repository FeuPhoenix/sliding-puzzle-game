import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UserProfile {
  id?: number;
  user_id?: number;
  avatar_url?: string;
  bio?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, profile, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profile, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteProfile(): Observable<void> {
    return this.http.delete<void>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }
} 