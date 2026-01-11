import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  isLoading = false;
  error = '';

  navItems = [
    { name: 'Home', active: false },
    { name: 'About', active: false },
    { name: 'Rooms', active: false },
    { name: 'Contact', active: false }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  onSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    alert('Mot de passe oublié cliqué !');
  }

  onGoogleLogin() { console.log('Google login clicked'); }
  onFacebookLogin() { console.log('Facebook login clicked'); }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Vérifier les rôles depuis le token décodé
        const user = this.authService.getCurrentUser();
        console.log('User après login:', user); // Pour déboguer
        
        // Redirection selon rôle
        if (user?.roles?.includes('ADMIN')) {
          this.router.navigate(['/admin']);
        } else if (user?.roles?.includes('MANAGER')) {
          this.router.navigate(['/manager']);
        } else if (user?.roles?.includes('CLIENT')) {
          this.router.navigate(['/catalogue']);
        } else if (user?.roles?.includes('HOUSEKEEPING')) {
          this.router.navigate(['/housekeeping']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        
        if (err.status === 401) {
          this.error = 'Email ou mot de passe incorrect';
        } else if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}