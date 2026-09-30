import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService, StudentAttendance } from '../../services/appService.component';

interface AttendanceCalendarCell {
  date: Date | null;
  key: string;
  records: StudentAttendance[];
  isToday: boolean;
}

@Component({
  selector: 'app-attendance-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-calendar.component.html',
  styleUrl: './attendance-calendar.component.scss'
})
export class AttendanceCalendarComponent implements OnInit {
  @Input({ required: true }) studentId!: number;

  attendanceLoading = false;
  attendanceError = '';
  attendanceHistory: StudentAttendance[] = [];
  calendarCells: AttendanceCalendarCell[] = [];
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  selectedDateKey = this.toDateKey(new Date());

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.loadAttendanceHistory();
  }

  get monthLabel(): string {
    return this.currentMonth.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric'
    });
  }

  get selectedDateLabel(): string {
    const [year, month, day] = this.selectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  get selectedDateAttendance(): StudentAttendance[] {
    return this.attendanceHistory.filter(
      record => this.normalizeDateKey(record.date) === this.selectedDateKey
    );
  }

  changeMonth(offset: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + offset,
      1
    );
    this.selectedDateKey = this.toDateKey(this.currentMonth);
    this.loadAttendanceHistory();
  }

  selectCalendarDate(cell: AttendanceCalendarCell): void {
    if (cell.date) {
      this.selectedDateKey = cell.key;
    }
  }

  private loadAttendanceHistory(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const from = this.toDateKey(new Date(year, month, 1));
    const to = this.toDateKey(new Date(year, month + 1, 0));

    this.attendanceLoading = true;
    this.attendanceError = '';
    this.appService.getStudentAttendance(this.studentId, from, to).subscribe({
      next: (history) => {
        this.attendanceHistory = history;
        this.attendanceLoading = false;
        this.buildCalendar();
      },
      error: (err) => {
        console.error(err);
        this.attendanceHistory = [];
        this.attendanceLoading = false;
        this.attendanceError = 'Attendance history could not be loaded.';
        this.buildCalendar();
      }
    });
  }

  private buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const recordsByDate = new Map<string, StudentAttendance[]>();

    for (const record of this.attendanceHistory) {
      const key = this.normalizeDateKey(record.date);
      const records = recordsByDate.get(key) ?? [];
      records.push(record);
      recordsByDate.set(key, records);
    }

    const cells: AttendanceCalendarCell[] = [];
    for (let index = 0; index < firstWeekday; index++) {
      cells.push({ date: null, key: `blank-start-${index}`, records: [], isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = this.toDateKey(date);
      cells.push({
        date,
        key,
        records: recordsByDate.get(key) ?? [],
        isToday: key === this.toDateKey(new Date())
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ date: null, key: `blank-end-${cells.length}`, records: [], isToday: false });
    }

    this.calendarCells = cells;
  }

  private normalizeDateKey(value: string): string {
    return value.slice(0, 10);
  }

  private toDateKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}