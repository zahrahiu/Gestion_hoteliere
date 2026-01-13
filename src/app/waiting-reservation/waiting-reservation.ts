import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationService} from '../services/reservation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-waiting-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiting-reservation.html',
  styleUrls: ['./waiting-reservation.css'],
})
export class WaitingReservation implements OnInit, OnDestroy{

  reservation: any;
  intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to view this page!');
      this.router.navigate(['/login']);
      return; // stop further execution
    }

    const id = +this.route.snapshot.params['id'];
    this.loadReservation(id);

    // Polling
    this.intervalId = setInterval(() => this.loadReservation(id), 5000);
  }


  loadReservation(id: number) {
    this.reservationService.getReservationById(id).subscribe({
      next: res => this.reservation = res,
      error: err => {
        console.error(err);
        alert('Error loading reservation. Maybe your session expired!');
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
