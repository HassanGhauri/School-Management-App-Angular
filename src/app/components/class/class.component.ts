import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AppService, AttendanceStatus, ClassAttendance, ClassDto } from '../../services/appService.component';
import { AuthService } from '../../services/AuthService.component';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss'
})
export class ClassComponent implements OnInit {

  classId!: number;
  classData!: ClassDto;

  loading = false;
  canManageAttendance = false;
  attendanceDate = this.getTodayDate();
  attendanceData: ClassAttendance | null = null;
  attendanceLoading = false;
  attendanceSaving = false;
  attendanceError = '';
  attendanceMessage = '';
  readonly attendanceStatuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused'];

  get allAttendanceMarked(): boolean {
    return !!this.attendanceData?.students.length &&
      this.attendanceData.students.every(student => !!student.status);
  }

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    const role = this.authService.getCurrentUser()?.role.toLowerCase();
    this.canManageAttendance = role === 'principal' || role === 'teacher';
    this.loadClass();
  }

  loadClass() {
    this.loading = true;

    this.appService.getClassById(this.classId).subscribe({
      next: (data) => {
        this.classData = data;
        this.loading = false;
        if (this.canManageAttendance) {
          this.loadAttendance();
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onAttendanceDateChange(date: string): void {
    this.attendanceDate = date;
    this.attendanceMessage = '';
    this.loadAttendance();
  }

  setAttendanceStatus(studentId: number, status: string): void {
    const student = this.attendanceData?.students.find(item => item.studentId === studentId);
    if (student && !student.isMarked) {
      student.status = this.attendanceStatuses.includes(status as AttendanceStatus)
        ? status as AttendanceStatus
        : null;
    }
  }

  saveAttendance(): void {
    const students = this.attendanceData?.students;
    if (!students?.length || students.some(student => !student.status)) {
      this.attendanceError = 'Choose an attendance status for every student.';
      return;
    }

    this.attendanceSaving = true;
    this.attendanceError = '';
    this.attendanceMessage = '';

    this.appService.saveClassAttendance(this.classId, {
      date: this.attendanceDate,
      records: students.map(student => ({
        studentId: student.studentId,
        status: student.status as AttendanceStatus
      }))
    }).subscribe({
      next: () => {
        this.attendanceSaving = false;
        this.attendanceMessage = 'Attendance saved.';
        this.loadAttendance();
      },
      error: (err) => {
        console.error(err);
        this.attendanceSaving = false;
        this.attendanceError = 'Could not save attendance for this class.';
      }
    });
  }

  private loadAttendance(): void {
    this.attendanceLoading = true;
    this.attendanceError = '';

    this.appService.getClassAttendance(this.classId, this.attendanceDate).subscribe({
      next: (data) => {
        this.attendanceData = {
          ...data,
          students: data.students.map(student => ({
            ...student,
            isMarked: !!student.isMarked || student.status != null
          }))
        };
        this.attendanceLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.attendanceData = null;
        this.attendanceLoading = false;
        this.attendanceError = 'You are not allowed to mark attendance for this class.';
      }
    });
  }

  private getTodayDate(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }
}