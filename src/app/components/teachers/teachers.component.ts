import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { AppService, User } from '../../services/appService.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent implements OnInit {

  teachers: User[] = [];
  loading = false;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.loading = true;

    this.appService.getUsers().subscribe({
      next: (data) => {

        // filter only teachers
        this.teachers = data.filter(
          user => user.role === 'Teacher'
        );

        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

}