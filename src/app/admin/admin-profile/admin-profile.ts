// admin-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule
  ],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup;
  saving = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Données du profil avec le style de la première image
  adminProfile = {
    firstName: 'Olivia',
    lastName: 'Rhye',
    email: 'admin@example.com',
    phone: '+61 412 345 678',
    location: 'Melbourne, Australia',
    bio: `I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development. I'm always striving to grow and learn something new and I don't take myself too seriously.\n\nI'm passionate about helping startups grow, improve their customer experience, and to raise venture capital through good design.`,
    specialisation: 'UX/UI design, brand strategy, Webflow development',
    portfolio: 'https://oliviarhye.design',
    twitter: '@oliviarhye',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      bio: [''],
      specialisation: [''],
      portfolio: [''],
      twitter: [''],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileForm.patchValue(this.adminProfile);
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(field: string): void {
    switch(field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.saving = true;

      // Simuler un appel API
      setTimeout(() => {
        const formValue = this.profileForm.value;
        
        // Mettre à jour les données locales
        this.adminProfile = {
          ...this.adminProfile,
          ...formValue
        };

        this.saving = false;
        this.showSuccess('Profile updated successfully');
      }, 1500);
    }
  }

  resetForm(): void {
    this.loadProfileData();
    this.profileForm.markAsPristine();
    this.showInfo('Changes cancelled');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}