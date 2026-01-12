// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // أضف هذا الاستيراد

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
  role: string[];
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
    private router: Router,
    private authService: AuthService // أضف هذا
  ) {}

  private getHeaders(): HttpHeaders {
    // استخدم authService للحصول على التوكن
    const token = this.authService.getToken();
    
    if (!token) {
      console.error('❌ [UserService] No token available!');
      this.router.navigate(['/login']);
    }
    
    console.log('🔑 [UserService] Using token for request:', {
      tokenExists: !!token,
      firstChars: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // =============== الدوال الرئيسية ===============

  getAllUsers(): Observable<UserResponseDTO[]> {
    console.log('🔄 [UserService] Fetching all users...');
    console.log('🌐 API URL:', `${this.apiUrl}/users`);
    
    return this.http.get<UserResponseDTO[]>(
      `${this.apiUrl}/users`,
      { headers: this.getHeaders() }
    ).pipe(
      tap({
        next: (users) => {
          console.log('✅ [UserService] Users fetched successfully!');
          console.log('📊 Number of users:', users.length);
          if (users.length > 0) {
            console.log('👤 First user:', users[0]);
          }
        },
        error: (error) => {
          console.error('❌ [UserService] Error fetching users:', error);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getUserById(id: number): Observable<UserResponseDTO> {
    console.log('🔄 [UserService] Fetching user by ID:', id);
    
    return this.http.get<UserResponseDTO>(
      `${this.apiUrl}/users/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap({
        next: (user) => {
          console.log('✅ [UserService] User fetched:', user.email);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  createUser(userData: CreateUserRequest): Observable<UserResponseDTO> {
    console.log('🔄 [UserService] Creating new user:', userData.email);
    
    return this.http.post<UserResponseDTO>(
      `${this.apiUrl}/users/create`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      tap({
        next: (createdUser) => {
          console.log('✅ [UserService] User created successfully:', createdUser);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateUser(id: number, data: UpdateUserRequest): Observable<UserResponseDTO> {
    console.log('🔄 [UserService] Updating user:', id, data);
    
    return this.http.patch<UserResponseDTO>(
      `${this.apiUrl}/users/${id}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      tap({
        next: (updatedUser) => {
          console.log('✅ [UserService] User updated:', updatedUser.email);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteUser(id: number): Observable<any> {
    console.log('🔄 [UserService] Deleting user:', id);
    
    return this.http.delete(
      `${this.apiUrl}/users/${id}`,
      { 
        headers: this.getHeaders(),
        observe: 'response',
        responseType: 'text'
      }
    ).pipe(
      tap(response => {
        console.log('✅ [UserService] Delete response status:', response.status);
      }),
      map((response: any) => {
        try {
          return JSON.parse(response.body || '{}');
        } catch {
          return { 
            success: true, 
            message: response.body || 'Utilisateur supprimé avec succès' 
          };
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // =============== دوال إضافية ===============

  // Dans user.service.ts - modifier la méthode toggleUserStatus

toggleUserStatus(id: number, active: boolean): Observable<UserResponseDTO> {
  console.log('🔄 [UserService] Toggling status for user:', id, 'to', active);
  console.log('📤 [UserService] Sending payload:', { active });
  console.log('🌐 [UserService] URL:', `${this.apiUrl}/users/${id}/status`);
  
  // Option 1: Avec body
  return this.http.patch<UserResponseDTO>(
    `${this.apiUrl}/users/${id}/status`,
    { active: active },
    { 
      headers: this.getHeaders(),
      observe: 'response' // Pour voir la réponse complète
    }
  ).pipe(
    tap({
      next: (response) => {
        console.log('✅ [UserService] Status toggled successfully!');
        console.log('📥 [UserService] Response status:', response.status);
        console.log('📥 [UserService] Response body:', response.body);
      },
      error: (error) => {
        console.error('❌ [UserService] Error toggling status:');
        console.error('Status:', error.status);
        console.error('Error:', error.error);
        console.error('Headers:', error.headers);
      }
    }),
    map(response => response.body as UserResponseDTO),
    catchError(this.handleError.bind(this))
  );

  // OU Option 2: Avec query parameter (si l'API l'attend ainsi)
  // return this.http.patch<UserResponseDTO>(
  //   `${this.apiUrl}/users/${id}/status?active=${active}`,
  //   {},
  //   { headers: this.getHeaders() }
  // ).pipe(...);

  // OU Option 3: Utiliser PUT au lieu de PATCH
  // return this.http.put<UserResponseDTO>(
  //   `${this.apiUrl}/users/${id}/status`,
  //   { active },
  //   { headers: this.getHeaders() }
  // ).pipe(...);
}

  getAllRoles(): Observable<Role[]> {
    console.log('🔄 [UserService] Fetching all roles...');
    
    return this.http.get<Role[]>(
      `${this.apiUrl}/roles`,
      { headers: this.getHeaders() }
    ).pipe(
      tap({
        next: (roles) => {
          console.log('✅ [UserService] Roles fetched:', roles.length);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // =============== معالجة الأخطاء ===============

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ [UserService] Error occurred:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error
    });
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors) {
      const errors = error.error.errors;
      errorMessage = Object.values(errors).flat().join(', ');
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le serveur est démarré sur le port 8070.';
    } else if (error.status === 400) {
      errorMessage = 'Données invalides envoyées';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      // تأخير قليل قبل التوجيه
      setTimeout(() => {
        this.authService.logout();
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: this.router.url } 
        });
      }, 2000);
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée';
    } else if (error.status === 409) {
      errorMessage = 'Conflit: Données déjà existantes';
    } else if (error.status === 500) {
      errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
    }
    
    console.error('📋 [UserService] Error message to display:', errorMessage);
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}