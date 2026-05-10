import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AppService, User } from '../../services/appService.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {

  students: User[] = [];
  loading = false;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;

    this.appService.getUsers().subscribe({
      next: (data) => {
        // only students
        this.students = data.filter(u => u.role === 'student');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

}