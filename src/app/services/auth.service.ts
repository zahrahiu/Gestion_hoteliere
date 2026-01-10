import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8070/v1';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('user', JSON.stringify({
            email: response.email,
            roles: response.roles
          }));
          this.currentUserSubject.next(response);
        })
      );
  }



  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, {
      firstName,
      lastName,
      email,
      password,
      role: ["CLIENT"] // backend kayforce role CLIENT
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getClientProfile() {
    const token = localStorage.getItem('token');
    return this.http.get('http://127.0.0.1:8088/clients/me', {
      headers: { Authorization: `Bearer ${token}` } // tzid token hna
    });
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  refreshToken(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.apiUrl}/users/refresh-token`, { token })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.accessToken);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
