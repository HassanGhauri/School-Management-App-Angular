import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

import {
  AppService,
  User,
  ClassDto
} from '../../services/appService.component';
import { Router, RouterOutlet } from '@angular/router';
import { Button } from "primeng/button";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, RouterOutlet, Button],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  users: User[] = [];
  classes: ClassDto[] = [];

  totalTeachers = 0;
  totalStudents = 0;
  totalClasses = 0;

  currentUser: any;

  constructor(private appService: AppService,private router: Router) {}

  ngOnInit(): void {

    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );

    this.loadUsers();
    this.loadClasses();
  }

  /* =========================
     ROLE CHECK HELPERS
  ========================= */
  isAdmin(): boolean {
    return this.currentUser?.role === 'Principal';
  }

  isTeacherOrStudent(): boolean {
    return (
      this.currentUser?.role === 'Teacher' ||
      this.currentUser?.role === 'student'
    );
  }

  /* =========================
     LOAD USERS (ADMIN ONLY)
  ========================= */
  loadUsers() {

    if (!this.isAdmin()) return;

    this.appService.getUsers().subscribe({
      next: (data) => {

        this.users = data;

        this.totalTeachers =
          this.users.filter(u => u.role === 'Teacher').length;

        this.totalStudents =
          this.users.filter(u => u.role === 'student').length;
      },
      error: (err) => console.error(err)
    });
  }

  openClass(cls: ClassDto) {

    this.router.navigate([
      '/app/classes',
      cls.id
    ]);
  }

  /* =========================
     LOAD CLASSES (ROLE BASED)
  ========================= */
  loadClasses() {

    this.appService.getClasses().subscribe({
      next: (data) => {

        const user = this.currentUser;

        // =========================
        // PRINCIPAL → ALL CLASSES
        // =========================
        if (user.role === 'Principal') {

          this.classes = data;
        }

        // =========================
        // TEACHER → THEIR CLASS
        // =========================
        else if (user.role === 'Teacher') {

          this.classes = data.filter(cls =>
            cls.classTeacherName?.includes(user.firstName) ||
            cls.classTeacherName?.includes(user.lastName)
          );
        }

        // =========================
        // STUDENT → THEIR CLASS
        // =========================
        else if (user.role === 'student') {

          this.classes = data.filter(cls =>
            cls.students.some(s =>
              s.fullName.includes(user.firstName) ||
              s.fullName.includes(user.lastName)
            )
          );
        }

        this.totalClasses = this.classes.length;
      },

      error: (err) => console.error(err)
    });
  }
}