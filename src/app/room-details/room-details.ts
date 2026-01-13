import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RoomService } from '../services/room.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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
    private roomService: RoomService,
    private authService: AuthService

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

    this.authService.getClientProfile().subscribe({
      next: (client: any) => {
        this.reservation.fname = client.nom || '';
        this.reservation.lname = client.prenom || '';
        this.reservation.email = client.email || '';
        this.reservation.tel = client.tel || '';
        this.reservation.cni = client.cni || '';
        this.reservation.dob = client.dateNaissance || '';
      },
      error: (err) => {
        console.error('Error loading client profile', err);
      }
    });
  }


  closeModal() {
    this.showModal = false;
  }

  submitReservation() {

    // 1️⃣ نوجد data ديال client
    const clientUpdate = {
      tel: this.reservation.tel,
      cni: this.reservation.cni,
      dateNaissance: this.reservation.dob
    };

    // 2️⃣ نحدّث client ف DB
    this.authService.updateClientProfile(clientUpdate).subscribe({
      next: () => {
        console.log('Client profile updated');

        // 3️⃣ من بعد دير reservation
        console.log('Reservation data:', this.reservation);

        alert('Reservation confirmed!');
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating client', err);
        alert('Erreur lors de la mise à jour du profil');
      }
    });
  }

}
