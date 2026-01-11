import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ne pas ajouter de token pour les routes publiques
    const publicRoutes = ['/login', '/register'];
    if (publicRoutes.some(route => req.url.includes(route))) {
      return next.handle(req);
    }

    // Récupérer le token
    const token = this.authService.getToken();
    
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // Token expiré ou invalide
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
    } else if (error.status === 403) {
      // Accès interdit
      this.router.navigate(['/unauthorized']);
    }
    
    return throwError(() => error);
  }
}