import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { AppService, User } from '../../services/appService.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  users: User[] = [];

  totalTeachers = 0;
  totalStudents = 0;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.appService.getUsers().subscribe({
      next: (data) => {
        this.users = data;

        // assuming Role values: "Teacher" and "Student"
        this.totalTeachers = this.users.filter(u => u.role === 'Teacher').length;
        this.totalStudents = this.users.filter(u => u.role === 'student').length;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }
}