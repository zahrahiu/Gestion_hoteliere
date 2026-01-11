// src/app/services/user.service.ts - الإصلاح الكامل
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // تأكد من استيراد map
import { Router } from '@angular/router';

export interface UserResponseDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
}

export interface Role {
  id: number;
  name: string;
  permissions: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  active?: boolean;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8070/v1';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // تأكد أن جميع الدوال محددة بشكل صحيح
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // =============== الدوال العامة ===============

  // ✅ تأكد أن createUser موجودة
  createUser(userData: CreateUserRequest): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(
      `${this.apiUrl}/users/create`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ تأكد أن getAllUsers موجودة
  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(
      `${this.apiUrl}/users`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ تأكد أن getUserById موجودة
  getUserById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(
      `${this.apiUrl}/users/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ تأكد أن updateUser موجودة
  updateUser(id: number, data: UpdateUserRequest): Observable<UserResponseDTO> {
    return this.http.patch<UserResponseDTO>(
      `${this.apiUrl}/users/${id}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ تأكد أن deleteUser موجودة
  deleteUser(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/users/${id}`,
      { 
        headers: this.getHeaders(),
        observe: 'response',
        responseType: 'text'
      }
    ).pipe(
      tap(response => {
        console.log('✅ Delete Response:', response);
      }),
      map((response: any) => {  // أضف النوع هنا
        try {
          return JSON.parse(response.body || '{}');
        } catch {
          return { 
            success: true, 
            message: response.body || 'Utilisateur supprimé avec succès' 
          };
        }
      }),
      catchError(this.handleError)
    );
  }

  // ✅ تأكد أن getAllRoles موجودة
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(
      `${this.apiUrl}/roles`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // =============== دوال إضافية ===============

  toggleUserStatus(id: number, active: boolean): Observable<UserResponseDTO> {
    return this.http.patch<UserResponseDTO>(
      `${this.apiUrl}/users/${id}/status`,
      { active },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updatePassword(id: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/users/${id}/password`,
      { currentPassword, newPassword },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // =============== معالجة الأخطاء ===============

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors) {
      const errors = error.error.errors;
      errorMessage = Object.values(errors).flat().join(', ');
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur';
    } else if (error.status === 400) {
      errorMessage = 'Données invalides';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée';
    } else if (error.status === 409) {
      errorMessage = 'Conflit: Données déjà existantes';
    } else if (error.status === 500) {
      errorMessage = 'Erreur interne du serveur';
    }
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}