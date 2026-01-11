// src/app/components/catalogue/catalogue.component.ts
import { Component, OnInit } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { RoomService } from '../services/room.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [NgForOf, NgIf, CommonModule, RouterModule],
  templateUrl: './catalogue.html',
  styleUrls: ['./catalogue.css'],
})
export class Catalogue  {

  navItems = [
    { name: 'Home',  route: '/', active: false },
    { name: 'About', route: '/about', active: false },
    { name: 'Contact', route: '/contact', active: false },
    { name: 'Profile', route: '/catalogue/profil', active: false }
  ];

  rooms$: Observable<any[]>; // <-- observable directly

  constructor(private roomService: RoomService, private router: Router) {
    this.rooms$ = this.roomService.getRooms(); // <-- getRooms observable directly
  }

  goToRoomDetails(id: number) {
    this.router.navigate(['/room', id]);
  }
}
