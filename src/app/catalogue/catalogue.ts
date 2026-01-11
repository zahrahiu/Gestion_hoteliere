// src/app/components/catalogue/catalogue.component.ts
import { Component, OnInit } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [NgForOf, NgIf, CommonModule, RouterModule],
  templateUrl: './catalogue.html',
  styleUrls: ['./catalogue.css'],
})
export class Catalogue implements OnInit {

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/catalogue/profil', active: false }
  ];

  rooms: any[] = [];
  loading = true;

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit() {
    // Subscribe rooms$ first
    this.roomService.rooms$.subscribe(data => {
      this.rooms = data;
      this.loading = false;
    });

    // Trigger loadRooms after subscription
    this.roomService.loadRooms();
  }

  goToRoomDetails(id: number) {
    this.router.navigate(['/room', id]);
  }
}
