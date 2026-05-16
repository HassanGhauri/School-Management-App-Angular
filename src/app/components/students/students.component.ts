import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { AppService, User } from '../../services/appService.component';

import { DialogFormComponent } from '../../utils/dialog-form/dialog-form.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogFormComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  students: User[] = [];

  loading = false;

  showStudentDialog = false;

  editMode = false;

  selectedStudentId?: number;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  /* =========================
     LOAD
  ========================= */
  loadStudents() {
    this.loading = true;

    this.appService.getUsers().subscribe({
      next: (data) => {
        this.students = data.filter((u) => u.role === 'student');

        this.loading = false;
      },

      error: () => (this.loading = false),
    });
  }

  /* =========================
     ADD
  ========================= */
  openAddStudentDialog() {
    this.editMode = false;

    this.selectedStudentId = undefined;

    this.showStudentDialog = true;
  }

  /* =========================
     EDIT
  ========================= */
  editStudent(student: User) {
    this.editMode = true;

    this.selectedStudentId = student.id;

    this.showStudentDialog = true;
  }

  /* =========================
     SAVE (ADD + UPDATE)
  ========================= */
  saveStudent(formData: any) {
    const payload: User = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      passwordHash: formData.passwordHash,
      age: Number(formData.age),
      role: 'student',
    };

    // UPDATE
    if (this.editMode && this.selectedStudentId) {
      this.appService.updateUser(this.selectedStudentId, payload).subscribe({
        next: () => this.loadStudents(),
      });

      return;
    }

    // CREATE
    this.appService.addUser(payload).subscribe({
      next: () => this.loadStudents(),
    });
  }

  /* =========================
     DELETE
  ========================= */
  deleteStudent(student: User, event: Event) {
    event.stopPropagation();

    if (!confirm(`Delete ${student.firstName}?`)) return;

    this.appService.deleteUser(student.id!).subscribe({
      next: () => this.loadStudents(),
    });
  }
}
