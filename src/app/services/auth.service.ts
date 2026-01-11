import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8070/v1/users';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.currentUserSubject = new BehaviorSubject<any>(
      this.isBrowser ? this.getUserFromStorage() : null
    );

    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // ===================== AUTH =====================

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          const userData = {
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles || [],
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          };

          this.saveUserData(userData);
          this.currentUserSubject.next(userData);
        })
      );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      firstName,
      lastName,
      email,
      password,
      role: ['CLIENT']
    });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ===================== USER =====================

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isBrowser && !!localStorage.getItem('accessToken');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes('ADMIN') || false;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('accessToken') : null;
  }

  // ===================== STORAGE =====================

  private saveUserData(user: any): void {
    if (!this.isBrowser) return;

    localStorage.setItem('accessToken', user.accessToken);
    if (user.refreshToken) {
      localStorage.setItem('refreshToken', user.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromStorage(): any {
    if (!this.isBrowser) return null;

    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
