import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgFor,
    NgIf,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  navItems = [
    { name: 'Home', active: false },
    { name: 'Rooms', active: false },
    { name: 'Services', active: false },
    { name: 'Contact', active: false }
  ];

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor(private router: Router) {}

  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isLoading = true;

    setTimeout(() => {
      console.log('REGISTER', this.email, this.password);
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1500);
  }

  onGoogleLogin() {}
  onFacebookLogin() {}

  onSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
