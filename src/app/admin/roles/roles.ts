// src/app/admin/roles/roles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
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

  roles: any[] = [];
  permissions: any[] = [];

  selectedRole: any = null;
  selectedPermission: any = null;

  newRoleName = '';
  newPermissionName = '';

  loading = false;
  activeTab = 0;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  // ================== UTILS ==================
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ================== LOAD ==================
  loadAllData(): void {
    this.loading = true;
    const headers = this.getHeaders();

    this.http.get<any[]>('http://localhost:8070/v1/roles', { headers }).subscribe({
      next: res => {
        this.roles = res;
        this.selectedRole = res.length ? res[0] : null;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.http.get<any[]>('http://localhost:8070/v1/permissions', { headers }).subscribe({
      next: res => this.permissions = res
    });
  }

  // ================== ROLE ==================
  createRole(): void {
    if (!this.newRoleName.trim()) return;

    const headers = this.getHeaders();
    const params = new HttpParams().set('name', this.newRoleName.toUpperCase());

    this.http.post<any>('http://localhost:8070/v1/roles', null, { headers, params }).subscribe({
      next: role => {
        this.roles.push(role);
        this.newRoleName = '';
        this.snackBar.open('✅ Rôle créé', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteRole(role: any): void {
    if (!confirm(`Supprimer le rôle ${role.name} ?`)) return;

    const headers = this.getHeaders();

    this.http.delete(
      `http://localhost:8070/v1/roles/${encodeURIComponent(role.name)}`,
      { headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        this.roles = this.roles.filter(r => r.id !== role.id);
        this.selectedRole = this.roles.length ? this.roles[0] : null;
        this.snackBar.open('✅ Rôle supprimé', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ================== PERMISSION ==================
  createPermission(): void {
    if (!this.newPermissionName.trim()) return;

    const headers = this.getHeaders();
    const params = new HttpParams().set('name', this.newPermissionName.toUpperCase());

    this.http.post<any>('http://localhost:8070/v1/permissions', null, { headers, params }).subscribe({
      next: perm => {
        this.permissions.push(perm);
        this.newPermissionName = '';
        this.snackBar.open('✅ Permission créée', 'Fermer', { duration: 3000 });
      }
    });
  }

  deletePermission(permission: any): void {
    const headers = this.getHeaders();

    this.http.delete(
      `http://localhost:8070/v1/permissions/${permission.id}`,
      { headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        this.permissions = this.permissions.filter(p => p.id !== permission.id);
        this.snackBar.open('✅ Permission supprimée', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ================== ASSIGN ==================
  assignPermissionToRole(): void {
    if (!this.selectedRole || !this.selectedPermission) return;

    const headers = this.getHeaders();
    const params = new HttpParams().set('permissionName', this.selectedPermission.name);

    this.http.post(
      `http://localhost:8070/v1/roles/${encodeURIComponent(this.selectedRole.name)}/permissions`,
      null,
      { headers, params, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        this.selectedRole.permissions ??= [];
        this.selectedRole.permissions.push(this.selectedPermission);
        this.selectedPermission = null;
        this.snackBar.open('✅ Permission assignée', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ================== REMOVE ==================
  removePermissionFromRole(permission: any): void {
    if (!this.selectedRole) return;

    const headers = this.getHeaders();

    this.http.delete(
      `http://localhost:8070/v1/roles/${encodeURIComponent(this.selectedRole.name)}/permissions/${encodeURIComponent(permission.name)}`,
      { headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        this.selectedRole.permissions =
          this.selectedRole.permissions.filter((p: any) => p.name !== permission.name);
        this.snackBar.open('✅ Permission retirée', 'Fermer', { duration: 3000 });
      }
    });
  }
}
