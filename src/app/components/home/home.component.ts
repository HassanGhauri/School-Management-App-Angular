import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

import {
  AppService,
  User,
  ClassDto
} from '../../services/appService.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent
implements OnInit {

  users: User[] = [];

  classes: ClassDto[] = [];

  totalTeachers = 0;

  totalStudents = 0;

  totalClasses = 0;

  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {

    this.loadUsers();

    this.loadClasses();
  }

  /* =========================
     LOAD USERS
  ========================= */
  loadUsers() {

    this.appService
      .getUsers()
      .subscribe({

        next: (data) => {

          this.users = data;

          // teachers
          this.totalTeachers =
            this.users.filter(
              u => u.role === 'Teacher'
            ).length;

          // students
          this.totalStudents =
            this.users.filter(
              u => u.role === 'student'
            ).length;
        },

        error: (err) => {
          console.error(
            'Error loading users',
            err
          );
        }
      });
  }

  /* =========================
     LOAD CLASSES
  ========================= */
  loadClasses() {

    this.appService
      .getClasses()
      .subscribe({

        next: (data) => {

          this.classes = data;

          this.totalClasses =
            data.length;
        },

        error: (err) => {

          console.error(
            'Error loading classes',
            err
          );
        }
      });
  }

}