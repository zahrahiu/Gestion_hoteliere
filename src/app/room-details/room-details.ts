import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RoomService } from '../services/room.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, FormsModule],
  templateUrl: './room-details.html',
  styleUrls: ['./room-details.css'],
})
export class RoomDetails {

  room: any;
  loading = true;
  errorMsg = '';

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/profil', active: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {
    const roomId = +this.route.snapshot.paramMap.get('id')!;

    if (!roomId) {
      this.errorMsg = 'Room ID not found';
      this.loading = false;
    } else {
      this.roomService.getRoomById(roomId).subscribe({
        next: (data) => {
          this.room = data;
          this.loading = false;

          // Fill readonly fields in form
          this.reservation.roomNumber = this.room.numero;
          this.reservation.roomType = this.room.type;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to load room';
          this.loading = false;
        }
      });
    }
  }




  showModal = false; // <-- Angular variable to control modal

  // Form model
  reservation = {
    fname: '',
    lname: '',
    email: '',
    tel: '',
    roomNumber: '',
    roomType: '',
    startDate: '',
    endDate: '',
    dob: '',
    cni: ''
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitReservation() {
    console.log('Reservation data:', this.reservation);
    // hna t9dar tsift l-backend via RoomService
    alert('Reservation confirmed!');
    this.closeModal();
  }
}
