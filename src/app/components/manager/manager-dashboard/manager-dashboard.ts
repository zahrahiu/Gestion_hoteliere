// src/app/components/manager/manager-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Manager Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ userEmail }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <i class="fas fa-bed"></i>
            <h3>Total Rooms</h3>
            <p class="stat-number">120</p>
          </div>
          <div class="stat-card">
            <i class="fas fa-users"></i>
            <h3>Active Bookings</h3>
            <p class="stat-number">45</p>
          </div>
          <div class="stat-card">
            <i class="fas fa-dollar-sign"></i>
            <h3>Today's Revenue</h3>
            <p class="stat-number">$12,450</p>
          </div>
          <div class="stat-card">
            <i class="fas fa-star"></i>
            <h3>Occupancy Rate</h3>
            <p class="stat-number">78%</p>
          </div>
        </div>

        <div class="actions-section">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button routerLink="/manager/rooms" class="action-btn">
              <i class="fas fa-edit"></i> Manage Rooms
            </button>
            <button routerLink="/manager/bookings" class="action-btn">
              <i class="fas fa-calendar-alt"></i> View Bookings
            </button>
            <button routerLink="/manager/reports" class="action-btn">
              <i class="fas fa-chart-bar"></i> Generate Reports
            </button>
            <button routerLink="/manager/staff" class="action-btn">
              <i class="fas fa-user-tie"></i> Staff Management
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      background: #f8f9fa;
      min-height: 100vh;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }
    .dashboard-header h1 {
      color: #2c3e50;
      margin: 0;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
    }
    .stat-card i {
      font-size: 2.5rem;
      color: #4a6cf7;
      margin-bottom: 15px;
    }
    .stat-card h3 {
      color: #6c757d;
      margin: 10px 0;
      font-size: 1rem;
    }
    .stat-number {
      font-size: 2.2rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
    }
    .actions-section {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .actions-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 1rem;
      transition: opacity 0.3s;
    }
    .action-btn:hover {
      opacity: 0.9;
    }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  userEmail = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
    }
  }

  logout() {
    this.authService.logout();
  }
}
