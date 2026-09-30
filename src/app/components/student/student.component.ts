import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AppService, User } from '../../services/appService.component';
import { AttendanceCalendarComponent } from '../attendance-calendar/attendance-calendar.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, RouterLink, AttendanceCalendarComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent implements OnInit {
  student: User | null = null;
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    const studentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(studentId) || studentId < 1) {
      this.loading = false;
      this.notFound = true;
      return;
    }

    this.appService.getUserById(studentId).subscribe({
      next: (student) => {
        this.student = student;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.notFound = true;
      }
    });
  }
}