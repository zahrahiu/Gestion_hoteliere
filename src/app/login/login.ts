import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterModule ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

}
