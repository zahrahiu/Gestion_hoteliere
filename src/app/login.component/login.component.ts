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

  // Navigation du site
  navItems = [
    { name: 'Accueil', active: true },
    { name: 'À propos', active: false },
    { name: 'Chambres', active: false },
    { name: 'Contact', active: false }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  // Afficher ou cacher le mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Gestion du clic sur un élément de navigation
  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  // Mot de passe oublié
  onForgotPassword(event: Event) {
    event.preventDefault();
    alert('Mot de passe oublié cliqué !');
  }

  // Redirection vers la page d’inscription
  onSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }

  // Login avec Google
  onGoogleLogin() {
    alert('Connexion Google cliquée !');
  }

  // Login avec Facebook
  onFacebookLogin() {
    alert('Connexion Facebook cliquée !');
  }

  // Soumission du formulaire de login
  async onSubmit() {
    this.isLoading = true;
    this.error = '';

    const isBackendRunning = await this.testBackend();
    if (!isBackendRunning) {
      this.error = 'Le backend n’est pas actif sur le port 8070';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirection selon le rôle
        if (response.roles?.includes('MANAGER')) this.router.navigate(['/manager']);
        else if (response.roles?.includes('CLIENT')) this.router.navigate(['/client']);
        else if (response.roles?.includes('HOUSEKEEPING')) this.router.navigate(['/housekeeping']);
        else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) this.error = 'Email ou mot de passe incorrect';
        else if (err.status === 0) this.error = 'Impossible de se connecter au serveur. Assurez-vous que Spring Boot est actif';
        else this.error = 'Une erreur est survenue. Veuillez réessayer';
      }
    });
  }

  // Vérifier si le backend est actif
  private async testBackend(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8070/v1/users/login', { method: 'OPTIONS' });
      return response.status !== 0;
    } catch {
      return false;
    }
  }
}
