// src/app/components/catalogue/catalogue.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [NgForOf, RouterModule],
  templateUrl: './catalogue.html',
  styleUrls: ['./catalogue.css'],
})
export class Catalogue implements OnInit {

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/profil', active: false }
  ];

  rooms: any[] = []; // array dyal rooms

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  // Load rooms from backend
  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        console.log('Rooms API Response:', data); // debug
        this.rooms = data;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
      }
    });
  }

  // Open booking alert
  openBookingModal(room: any): void {
    alert(`You selected "${room.type}".\nPrice: $${room.prix}/night\nPlease call +1 (310) 555-1234 to book.`);
  }

  // Navigation click
  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  // Hover on room card
  onRoomHover(index: number, isHovering: boolean): void {
    console.log(`Room ${index} hover: ${isHovering}`);
  }

}
