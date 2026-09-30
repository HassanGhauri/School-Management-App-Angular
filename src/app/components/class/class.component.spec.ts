import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClassComponent } from './class.component';
import { AppService } from '../../services/appService.component';
import { AuthService } from '../../services/AuthService.component';

describe('ClassComponent', () => {
  let component: ClassComponent;
  let fixture: ComponentFixture<ClassComponent>;
  const appService = {
    getClassById: jasmine.createSpy().and.returnValue(of({
      id: 1,
      className: 'Class 1',
      students: [],
      assignedTeachers: [],
      subjects: []
    })),
    getClassAttendance: jasmine.createSpy().and.returnValue(of({
      classId: 1,
      className: 'Class 1',
      date: '2026-09-30',
      students: []
    })),
    saveClassAttendance: jasmine.createSpy().and.returnValue(of(undefined))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: AppService, useValue: appService },
        { provide: AuthService, useValue: { getCurrentUser: () => ({ role: 'Principal' }) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update a student attendance status', () => {
    component.attendanceData = {
      classId: 1,
      className: 'Class 1',
      date: '2026-09-30',
      students: [{ studentId: 7, fullName: 'Student One', status: null, note: null, isMarked: false }]
    };

    component.setAttendanceStatus(7, 'Present');

    expect(component.attendanceData.students[0].status).toBe('Present');
    expect(component.allAttendanceMarked).toBeTrue();
  });

  it('should not change a status already saved for the date', () => {
    component.attendanceData = {
      classId: 1,
      className: 'Class 1',
      date: '2026-09-30',
      students: [{
        studentId: 7,
        fullName: 'Student One',
        status: 'Absent',
        note: null,
        isMarked: true
      }]
    };

    component.setAttendanceStatus(7, 'Present');

    expect(component.attendanceData.students[0].status).toBe('Absent');
  });
});
