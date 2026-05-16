import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Router,
  RouterOutlet
} from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import {
  AppService,
  ClassDto,
  ClassModel,
  Subject
} from '../../services/appService.component';

import { DialogFormComponent }
from '../../utils/dialog-form/dialog-form.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RouterOutlet,
    TooltipModule,

    DialogFormComponent
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent
implements OnInit {

  classes: ClassDto[] = [];

  teachers: any[] = [];

  students: any[] = [];

  subjects: Subject[] = [];

  showClassDialog = false;

  editMode = false;

  selectedClassId?: number;

  selectedClassData: any = null;

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadClasses();

    this.loadUsers();

    this.loadSubjects();
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
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  /* =========================
     LOAD USERS
  ========================= */
  loadUsers() {

    this.appService
      .getUsers()
      .subscribe({

        next: (users) => {

          // teachers
          this.teachers = users
            .filter(
              u => u.role === 'Teacher'
            )
            .map(t => ({
              id: t.id,

              fullName:
                t.firstName +
                ' ' +
                t.lastName
            }));

          // students
          this.students = users
            .filter(
              u => u.role === 'student'
            )
            .map(s => ({
              id: s.id,

              fullName:
                s.firstName +
                ' ' +
                s.lastName
            }));
        }
      });
  }

  /* =========================
     LOAD SUBJECTS
  ========================= */
  loadSubjects() {

    this.appService
      .getSubjects()
      .subscribe({

        next: (data) => {

          this.subjects = data;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  /* =========================
     OPEN CLASS DETAIL
  ========================= */
  openClass(cls: ClassDto) {

    this.router.navigate([
      '/app/classes',
      cls.id
    ]);
  }

  /* =========================
     CREATE DIALOG
  ========================= */
  openCreateDialog() {

    this.editMode = false;

    this.selectedClassData = null;

    this.showClassDialog = true;
  }

  /* =========================
     EDIT DIALOG
  ========================= */
  editClass(
    cls: ClassDto
  ) {

    this.editMode = true;

    this.selectedClassId = cls.id;

    this.selectedClassData = {

      className:
        cls.className,

      classTeacherId:
        this.teachers.find(
          t =>
            t.fullName ===
            cls.classTeacherName
        )?.id || null,

      studentIds:
        cls.students.map(
          s => s.id
        ),

      subjectIds:
        this.subjects
          .filter(sub =>
            cls.subjects.includes(
              sub.name
            )
          )
          .map(sub => sub.id),

      teacherIds:
        cls.assignedTeachers.map(
          t => t.id
        )
    };

    this.showClassDialog = true;
  }

  /* =========================
     SAVE CLASS
  ========================= */
  saveClass(formData: any) {

    const payload: ClassModel = {

      className:
        formData.className,

      classTeacherId:
        formData.classTeacherId
    };

    /* =========================
       EDIT
    ========================= */
    if (
      this.editMode &&
      this.selectedClassId
    ) {

      this.appService
        .updateClass(
          this.selectedClassId,
          payload
        )
        .subscribe({

          next: () => {

            this.loadClasses();

            // relationships
            this.assignStudents(
              this.selectedClassId!,
              formData.studentIds
            );

            this.assignTeachers(
              this.selectedClassId!,
              formData.teacherIds
            );

            this.assignSubjects(
              this.selectedClassId!,
              formData.subjectIds
            );
          }
        });

      return;
    }

    /* =========================
       CREATE
    ========================= */
    this.appService
      .addClass(payload)
      .subscribe({

        next: (res) => {

          const classId =
            res.data.id;

          this.loadClasses();

          // relationships
          this.assignStudents(
            classId,
            formData.studentIds
          );

          this.assignTeachers(
            classId,
            formData.teacherIds
          );

          this.assignSubjects(
            classId,
            formData.subjectIds
          );
        }
      });
  }

  /* =========================
     ASSIGN STUDENTS
  ========================= */
  assignStudents(
    classId: number,
    studentIds: number[]
  ) {

    if (!studentIds?.length)
      return;

    studentIds.forEach(studentId => {

      this.appService
        .addStudentToClass(
          classId,
          studentId
        )
        .subscribe();
    });
  }

  /* =========================
     ASSIGN TEACHERS
  ========================= */
  assignTeachers(
    classId: number,
    teacherIds: number[]
  ) {

    if (!teacherIds?.length)
      return;

    teacherIds.forEach(teacherId => {

      this.appService
        .addTeacherToClass(
          classId,
          teacherId
        )
        .subscribe();
    });
  }

  /* =========================
     ASSIGN SUBJECTS
  ========================= */
  assignSubjects(
    classId: number,
    subjectIds: number[]
  ) {

    if (!subjectIds?.length)
      return;

    subjectIds.forEach(subjectId => {

      this.appService
        .addSubjectToClass(
          classId,
          subjectId
        )
        .subscribe();
    });
  }

  /* =========================
     DELETE CLASS
  ========================= */
  deleteClass(
    cls: ClassDto,
    event: Event
  ) {

    event.stopPropagation();

    if (
      !confirm(
        `Delete ${cls.className}?`
      )
    ) return;

    this.appService
      .deleteClass(cls.id)
      .subscribe({

        next: () => {

          this.loadClasses();
        }
      });
  }

}