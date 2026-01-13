import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {

  clientReservations: any[] = [];
  notifications: any[] = [];

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/room/:id/profil', active: false }
  ];

  constructor(private reservationService: ReservationService) {
    // Hna katfetch reservations men backend b token
    this.reservationService.getClientReservations().subscribe({
      next: (res: any) => {
        this.clientReservations = Array.isArray(res) ? res : res.reservations || [];
        console.log('Reservations loaded in Payment:', this.clientReservations);
      },
      error: err => console.error(err)
    });
  }

}
