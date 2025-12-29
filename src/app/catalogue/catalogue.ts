import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-catalogue',
  imports: [
    NgForOf
  ],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {

  navItems = [
    { name: 'Home', active: false },
    { name: 'About', active: false },
    { name: 'Contact', active: false },
    { name: 'Profile', active: false }
  ];

  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  openBookingModal(): void {
    alert('Welcome to Royellas Hotel! Our booking system would open here. For now, please call +1 (310) 555-1234 to make a reservation.');
  }

  updateYear(): void {
    // Cette fonction pourrait être utilisée pour mettre à jour dynamiquement l'année dans le footer
    const currentYear = new Date().getFullYear();
    // Logique pour mettre à jour l'année si nécessaire
  }

  onRoomHover(roomId: number, isHovering: boolean): void {
    // Logique supplémentaire pour l'interaction avec les cartes de chambres
    console.log(`Room ${roomId} hover: ${isHovering}`);
  }

}
