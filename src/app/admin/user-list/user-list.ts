// src/app/admin/user-list/user-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, UserResponseDTO } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'email', 'name', 'roles', 'status', 'actions'];
  users: UserResponseDTO[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ===================== LOAD USERS =====================
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showError('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  // ===================== DELETE USER =====================
  deleteUser(user: UserResponseDTO): void {
    const ok = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`
    );
    if (!ok) return;

    this.loading = true;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id); // UI rapide
        this.loading = false;
        this.showSuccess('Utilisateur supprimé avec succès');
      },
      error: () => {
        this.loading = false;
        this.showError('Erreur lors de la suppression');
      }
    });
  }

  // ===================== ACTIVER / DESACTIVER =====================
  toggleUserStatus(user: UserResponseDTO): void {
    const newStatus = !user.active;
    const action = newStatus ? 'activer' : 'désactiver';

    const ok = window.confirm(
      `Êtes-vous sûr de vouloir ${action} ${user.firstName} ${user.lastName} ?`
    );
    if (!ok) return;

    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.active = newStatus; // update local
        this.showSuccess(`Utilisateur ${action} avec succès`);
      },
      error: () => {
        this.showError(`Erreur lors de la ${action}`);
      }
    });
  }

  // ===================== ROLES =====================
  getRoleClass(role: string): string {
    return {
      ADMIN: 'role-admin',
      MANAGER: 'role-manager',
      STAFF: 'role-staff',
      CLIENT: 'role-client'
    }[role] || 'role-default';
  }

  getRoleDisplayName(role: string): string {
    return {
      ADMIN: 'Admin',
      MANAGER: 'Manager',
      STAFF: 'Staff',
      CLIENT: 'Client'
    }[role] || role;
  }

  // ===================== SNACKBAR =====================
  showSuccess(message: string): void {
    this.snackBar.open(`✓ ${message}`, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  showError(message: string): void {
    this.snackBar.open(`✗ ${message}`, 'Fermer', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}
