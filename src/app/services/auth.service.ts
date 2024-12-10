import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // Check if there's a token in cookies on service initialization
    this.isAuthenticatedSubject.next(!!this.cookieService.getAuthToken());
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.cookieService.setAuthToken(response.token);
          this.isAuthenticatedSubject.next(true);
          // Set user preferences with name
          if (response.user && response.user.name) {
            this.cookieService.setUserPreferences({
              name: response.user.name,
              theme: 'light'
            });
          }
          // Set last visit timestamp
          this.cookieService.updateLastVisit();
        }
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.cookieService.setAuthToken(response.token);
          this.isAuthenticatedSubject.next(true);
          // Set initial preferences with user's name
          this.cookieService.setUserPreferences({
            name: name,
            theme: 'light',
            notifications: true
          });
        }
      })
    );
  }

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.cookieService.setAuthToken(response.token);
          this.isAuthenticatedSubject.next(true);
          // Set initial preferences
          this.cookieService.setUserPreferences({
            notifications: true,
            theme: 'light'
          });
        }
      })
    );
  }

  logout(): void {
    this.cookieService.removeAuthToken();
    this.cookieService.clearAllCookies();
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string {
    return this.cookieService.getAuthToken();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Alias for isAuthenticated for backward compatibility
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Helper method to get auth headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
} 