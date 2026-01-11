// src/app/admin/roles/roles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class RolesComponent implements OnInit {
  // Section Rôles
  roles: any[] = [];
  newRoleName = '';
  newRoleDescription = '';
  
  // Section Permissions
  permissions: any[] = [];
  newPermissionName = '';
  newPermissionDescription = '';
  
  // Section Assignation
  selectedRole: any = null;
  selectedPermission: any = null;
  
  loading = false;
  activeTab = 'roles'; // 'roles', 'permissions', 'assign'

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  // ================ CHARGEMENT DES DONNÉES ================
// ================ CHARGEMENT DES DONNÉES ================
loadAllData(): void {
  this.loading = true;
  
  // CORRECTION 1 : Utilise 'accessToken' au lieu de 'token'
  const token = localStorage.getItem('accessToken'); // ← CHANGE ICI
  console.log('🔑 Token récupéré:', token ? 'OUI' : 'NON');
  
  if (!token) {
    this.snackBar.open('❌ Pas connecté! Token manquant.', 'OK', { duration: 3000 });
    this.loading = false;
    return;
  }

  // CORRECTION 2 : Log le début du token pour vérifier
  console.log('Token (début):', token.substring(0, 30) + '...');

  // Appelle l'API pour les rôles
  this.http.get('http://localhost:8070/v1/roles', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).subscribe({
    next: (res: any) => {
      console.log('✅ SUCCÈS - Rôles reçus:', res);
      this.roles = res;
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ ERREUR - Détails:', err);
      if (err.status === 401) {
        this.snackBar.open('Token expiré ou invalide! Reconnecte-toi.', 'OK', { duration: 3000 });
      } else {
        this.snackBar.open('Erreur: ' + err.message, 'OK', { duration: 3000 });
      }
      this.loading = false;
    }
  });

  // Appelle l'API pour les permissions
  this.http.get('http://localhost:8070/v1/permissions', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).subscribe({
    next: (res: any) => {
      console.log('✅ Permissions reçues:', res);
      this.permissions = res;
    },
    error: (err) => {
      console.error('Erreur permissions:', err);
    }
  });
}
  // ================ GESTION DES RÔLES ================
  createRole(): void {
    if (!this.newRoleName.trim()) {
      this.snackBar.open('Le nom du rôle est requis', 'Fermer', { duration: 3000 });
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8070/v1/roles?name=${this.newRoleName}`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          this.snackBar.open('Rôle créé avec succès', 'Fermer', { duration: 3000 });
          this.loadAllData();
          this.newRoleName = '';
          this.newRoleDescription = '';
          this.activeTab = 'roles';
        },
        error: (err) => {
          console.error('Erreur création rôle:', err);
          this.snackBar.open('Erreur lors de la création du rôle', 'Fermer', { duration: 3000 });
        }
      });
  }

  deleteRole(roleId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rôle?')) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:8070/v1/roles/${roleId}`, { headers })
      .subscribe({
        next: () => {
          this.snackBar.open('Rôle supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadAllData();
        },
        error: (err) => {
          console.error('Erreur suppression rôle:', err);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
  }

  // ================ GESTION DES PERMISSIONS ================
  createPermission(): void {
    if (!this.newPermissionName.trim()) {
      this.snackBar.open('Le nom de la permission est requis', 'Fermer', { duration: 3000 });
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8070/v1/permissions?name=${this.newPermissionName}`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          this.snackBar.open('Permission créée avec succès', 'Fermer', { duration: 3000 });
          this.loadAllData();
          this.newPermissionName = '';
          this.newPermissionDescription = '';
          this.activeTab = 'permissions';
        },
        error: (err) => {
          console.error('Erreur création permission:', err);
          this.snackBar.open('Erreur lors de la création de la permission', 'Fermer', { duration: 3000 });
        }
      });
  }

  // ================ ASSIGNATION DES PERMISSIONS ================
  assignPermissionToRole(): void {
    if (!this.selectedRole || !this.selectedPermission) {
      this.snackBar.open('Veuillez sélectionner un rôle et une permission', 'Fermer', { duration: 3000 });
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `http://localhost:8070/v1/roles/${this.selectedRole.name}/permissions?permissionName=${this.selectedPermission.name}`;

    this.http.post(url, {}, { headers })
      .subscribe({
        next: () => {
          this.snackBar.open('Permission assignée avec succès', 'Fermer', { duration: 3000 });
          this.loadAllData();
          this.selectedPermission = null;
        },
        error: (err) => {
          console.error('Erreur assignation:', err);
          this.snackBar.open('Erreur lors de l\'assignation', 'Fermer', { duration: 3000 });
        }
      });
  }

  removePermissionFromRole(permissionId: number): void {
    if (!this.selectedRole) return;

    // NOTE: Ton API ne supporte pas la suppression de permission d'un rôle
    // Tu dois ajouter cette fonctionnalité dans le backend
    this.snackBar.open('Fonctionnalité à implémenter dans le backend', 'Fermer', { duration: 3000 });
  }

  // ================ UTILITAIRES ================
  getUsersCount(users: any[]): number {
    return users ? users.length : 0;
  }

  isDeletable(role: any): boolean {
    return role.users && role.users.length === 0;
  }

  selectRole(role: any): void {
    this.selectedRole = role;
  }

  getRolePermissions(role: any): any[] {
    return role.permissions || [];
  }

  hasPermission(role: any, permissionId: number): boolean {
    return role.permissions?.some((p: any) => p.id === permissionId) || false;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}