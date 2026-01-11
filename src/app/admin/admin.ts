// src/app/admin/admin.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'; // Ajouté
import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../services/user-profile.service';
import { UserService } from '../services/user.service';
import { filter, Subscription, interval } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    HttpClientModule, 
    MatSnackBarModule // Ajouté
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit, OnDestroy {
  sidenavOpened = true;
  currentRoute = '';
  isMobile = false;
  
  // Statistiques améliorées
  stats = {
    totalUsers: 0,
    pendingProfiles: 0,
    activeUsers: 0,
    totalRoles: 5,
    todayBookings: 0,
    occupancyRate: 0,
    revenueToday: 0,
    satisfactionRate: 4.8
  };
  
  user: any;
  loading = false;
  notifications: any[] = [];
  lastUpdate = new Date();
  
  private subscriptions = new Subscription();

  // Menu items amélioré avec tooltips
  menuItems = [
    { 
      path: '/admin', 
      icon: 'dashboard', 
      label: 'Tableau de bord',
      exact: true,
      tooltip: 'Vue d\'ensemble des statistiques'
    },
    { 
      path: '/admin/users', 
      icon: 'people', 
      label: 'Utilisateurs',
      badge: 0,
      tooltip: 'Gestion des utilisateurs'
    },
    { 
      path: '/admin/roles', 
      icon: 'admin_panel_settings', 
      label: 'Rôles & Permissions',
      tooltip: 'Gestion des autorisations'
    },
    { 
      path: '/admin/profiles', 
      icon: 'assignment_ind', 
      label: 'Profils Internes',
      badge: 0,
      tooltip: 'Validation des profils'
    },
    { 
      path: '/admin/bookings', 
      icon: 'event_available', 
      label: 'Réservations',
      badge: 3,
      tooltip: 'Gestion des réservations'
    },
    { 
      path: '/admin/rooms', 
      icon: 'king_bed', 
      label: 'Chambres',
      tooltip: 'Gestion des chambres'
    },
    { 
      path: '/admin/logs', 
      icon: 'history', 
      label: 'Journal d\'activité',
      tooltip: 'Historique des actions'
    },
    { 
      path: '/admin/settings', 
      icon: 'settings', 
      label: 'Paramètres',
      tooltip: 'Configuration du système'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private profileService: UserProfileService,
    private snackBar: MatSnackBar // Ajouté
  ) {
    this.checkMobile();
    
    const routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        this.adjustSidenavForMobile();
      });
    this.subscriptions.add(routeSub);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobile();
    this.adjustSidenavForMobile();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
    this.setupAutoRefresh();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  adjustSidenavForMobile(): void {
    if (this.isMobile) {
      this.sidenavOpened = false;
    }
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  // Dans la méthode loadStats() :
loadStats(): void {
  this.loading = true;
  
  const userSub = this.userService.getAllUsers().subscribe({
    next: (users: any[]) => {
      this.stats.totalUsers = users.length;
      this.stats.activeUsers = users.filter(u => u.active).length;
      this.menuItems[1].badge = users.length;
      
      // Simuler d'autres données pour l'hôtel
      this.stats.todayBookings = Math.floor(Math.random() * 20) + 10;
      this.stats.occupancyRate = Math.floor(Math.random() * 30) + 70;
      this.stats.revenueToday = Math.floor(Math.random() * 5000) + 10000;
      
      this.loading = false; // IMPORTANT: Désactiver le loading
    },
    error: (error: any) => {
      console.error('Erreur chargement utilisateurs:', error);
      this.loading = false; // IMPORTANT: Désactiver même en cas d'erreur
    }
  });

  const profileSub = this.profileService.getAllUserProfiles().subscribe({
    next: (profiles: any[]) => {
      const pending = profiles.filter(p => p.status === 'PENDING').length;
      this.stats.pendingProfiles = pending;
      this.menuItems[3].badge = pending;
      this.updateNotifications();
    },
    error: (error: any) => {
      console.error('Erreur chargement profils:', error);
    }
  });

  this.subscriptions.add(userSub);
  this.subscriptions.add(profileSub);
}

  loadNotifications(): void {
    this.notifications = [
      {
        id: 1,
        title: 'Nouvelle réservation',
        message: 'Chambre 301 réservée pour 2 nuits',
        time: '10 min',
        icon: 'event_available',
        color: 'primary',
        read: false,
        type: 'booking'
      },
      {
        id: 2,
        title: 'Check-in requis',
        message: 'M. Dupont arrive à 14h00',
        time: '25 min',
        icon: 'login',
        color: 'accent',
        read: false,
        type: 'checkin'
      },
      {
        id: 3,
        title: 'Maintenance',
        message: 'Chambre 205 en maintenance',
        time: '1h',
        icon: 'build',
        color: 'warn',
        read: true,
        type: 'maintenance'
      }
    ];
  }

  updateNotifications(): void {
    if (this.stats.pendingProfiles > 0) {
      // Vérifier si la notification existe déjà
      const existingNotification = this.notifications.find(n => 
        n.type === 'pending_profiles'
      );
      
      if (!existingNotification) {
        this.notifications.unshift({
          id: Date.now(),
          title: 'Profils en attente',
          message: `${this.stats.pendingProfiles} profil(s) nécessitent validation`,
          time: 'Maintenant',
          icon: 'assignment_ind',
          color: 'warn',
          read: false,
          type: 'pending_profiles'
        });
      } else {
        // Mettre à jour le message existant
        existingNotification.message = `${this.stats.pendingProfiles} profil(s) nécessitent validation`;
      }
    } else {
      // Supprimer la notification si plus de profils en attente
      this.notifications = this.notifications.filter(n => 
        n.type !== 'pending_profiles'
      );
    }
  }

  setupAutoRefresh(): void {
    // Actualiser les stats toutes les 5 minutes
    const refreshSub = interval(300000).subscribe(() => {
      this.loadStats();
      this.lastUpdate = new Date();
      this.showSnackbar('Données actualisées', 'OK');
    });
    this.subscriptions.add(refreshSub);
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  getPageTitle(): string {
    const titles: {[key: string]: string} = {
      '/admin': 'Tableau de bord',
      '/admin/users': 'Gestion des utilisateurs',
      '/admin/roles': 'Rôles & Permissions',
      '/admin/profiles': 'Profils internes',
      '/admin/bookings': 'Gestion des réservations',
      '/admin/rooms': 'Gestion des chambres',
      '/admin/logs': 'Journal d\'activité',
      '/admin/settings': 'Paramètres système'
    };
    
    return titles[this.currentRoute] || 'Administration Hôtel';
  }

  getLastUpdateTime(): string {
    return this.lastUpdate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // NOUVELLE MÉTHODE : Marquer une notification comme lue
  markNotificationAsRead(notification: any): void {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index !== -1 && !this.notifications[index].read) {
      this.notifications[index].read = true;
      
      // Si c'est une notification de profils en attente, mettre à jour le badge
      if (notification.type === 'pending_profiles') {
        this.stats.pendingProfiles = 0;
        this.menuItems[3].badge = 0;
      }
      
      this.showSnackbar('Notification marquée comme lue', 'OK');
    }
  }

  // NOUVELLE MÉTHODE : Marquer toutes les notifications comme lues
  markAllNotificationsAsRead(): void {
    let hasUnread = false;
    
    this.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        hasUnread = true;
      }
    });
    
    // Réinitialiser les notifications de profils en attente
    if (this.stats.pendingProfiles > 0) {
      this.stats.pendingProfiles = 0;
      this.menuItems[3].badge = 0;
    }
    
    if (hasUnread) {
      this.showSnackbar('Toutes les notifications sont lues', 'OK');
    }
  }

  // NOUVELLE MÉTHODE : Naviguer vers une notification
  navigateToNotification(notification: any): void {
    this.markNotificationAsRead(notification);
    
    switch (notification.type) {
      case 'booking':
        this.router.navigate(['/admin/bookings']);
        break;
      case 'checkin':
        this.router.navigate(['/admin/bookings'], { queryParams: { filter: 'today' } });
        break;
      case 'pending_profiles':
        this.router.navigate(['/admin/profiles']);
        break;
      case 'maintenance':
        this.router.navigate(['/admin/rooms']);
        break;
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  // NOUVELLE MÉTHODE : Afficher un snackbar
  showSnackbar(message: string, action: string = 'OK'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }

  // NOUVELLE MÉTHODE : Obtenir le nombre de notifications non lues
  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // NOUVELLE MÉTHODE : Obtenir le texte du taux d'occupation
  getOccupancyStatus(): string {
    if (this.stats.occupancyRate > 90) return 'Complet';
    if (this.stats.occupancyRate > 70) return 'Élevé';
    if (this.stats.occupancyRate > 50) return 'Moyen';
    return 'Faible';
  }
  get unreadNotificationsCount(): number {
  return this.notifications.filter(n => !n.read).length;
}



}