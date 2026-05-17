import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: AuthUser | null = null;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
}