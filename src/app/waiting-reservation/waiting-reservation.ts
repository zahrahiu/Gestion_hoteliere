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
  }



  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
