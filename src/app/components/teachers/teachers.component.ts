import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import {
  AppService,
  User
} from '../../services/appService.component';

import { DialogFormComponent } from '../../utils/dialog-form/dialog-form.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    DialogFormComponent
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent implements OnInit {

  teachers: User[] = [];

  loading = false;

  showTeacherDialog = false;

  editMode = false;

  selectedTeacherId?: number;

  // 👇 SELECTED TEACHER DATA
  selectedTeacher: User | null = null;

  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  /* =========================
     LOAD TEACHERS
  ========================= */
  loadTeachers() {

    this.loading = true;

    this.appService.getUsers().subscribe({

      next: (data) => {

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

  /* =========================
     OPEN ADD DIALOG
  ========================= */
  openAddTeacherDialog() {

    this.editMode = false;

    this.selectedTeacherId = undefined;

    // RESET DATA
    this.selectedTeacher = null;

    this.showTeacherDialog = true;
  }

  /* =========================
     EDIT TEACHER
  ========================= */
  editTeacher(teacher: User) {

    this.editMode = true;

    this.selectedTeacherId = teacher.id;

    // PASS DATA TO FORM
    this.selectedTeacher = teacher;

    this.showTeacherDialog = true;
  }

  /* =========================
     SAVE (ADD + UPDATE)
  ========================= */
  addTeacher(formData: any) {

    const payload: User = {

      firstName: formData.firstName,

      lastName: formData.lastName,

      email: formData.email,

      passwordHash:
        formData.passwordHash,

      age: Number(formData.age),

      role: 'Teacher'
    };

    /* =========================
       UPDATE
    ========================= */
    if (
      this.editMode &&
      this.selectedTeacherId
    ) {

      this.appService
        .updateUser(
          this.selectedTeacherId,
          payload
        )
        .subscribe({

          next: () => {

            this.loadTeachers();

            this.showTeacherDialog = false;
          },

          error: (err) => {
            console.error(err);
          }
        });

      return;
    }

    /* =========================
       CREATE
    ========================= */
    this.appService
      .addUser(payload)
      .subscribe({

        next: () => {

          this.loadTeachers();

          this.showTeacherDialog = false;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  /* =========================
     DELETE
  ========================= */
  deleteTeacher(
    teacher: User,
    event: Event
  ) {

    event.stopPropagation();

    if (
      !confirm(
        `Delete ${teacher.firstName}?`
      )
    ) return;

    this.appService
      .deleteUser(teacher.id!)
      .subscribe({

        next: () => {

          this.loadTeachers();
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

}