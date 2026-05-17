import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* =========================
   USER MODEL
========================= */
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  age: number;
  createdAt?: string;
}

/* =========================
   SUBJECT MODEL
========================= */
export interface Subject {
  id?: number;
  name: string;
  classes?: any[];
}

/* =========================
   CLASS DTO
========================= */
export interface ClassDto {
  id: number;
  className: string;

  classTeacherName?: string;

  students: {
    id: number;
    fullName: string;
  }[];

  assignedTeachers: {
    id: number;
    fullName: string;
  }[];

  subjects: string[];
}

/* =========================
   CLASS MODEL
========================= */
export interface ClassModel {
  id?: number;
  className: string;
  classTeacherId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl = 'http://localhost:5164/sms';

  constructor(private http: HttpClient) {}

  /* =========================
     JWT HELPERS
  ========================= */

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders() {
    const token = this.getToken();

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  }

  /* =========================
     USER APIs (PROTECTED)
  ========================= */

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/users`,
      this.getAuthHeaders()
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.baseUrl}/user/${id}`,
      this.getAuthHeaders()
    );
  }

  addUser(user: User): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/user`,
      user,
      this.getAuthHeaders()
    );
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/user/${id}`,
      user,
      this.getAuthHeaders()
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/user/${id}`,
      this.getAuthHeaders()
    );
  }

  /* =========================
     CLASS APIs (PROTECTED)
  ========================= */

  getClasses(): Observable<ClassDto[]> {
    return this.http.get<ClassDto[]>(
      `${this.baseUrl}/classes`,
      this.getAuthHeaders()
    );
  }

  getClassById(id: number): Observable<ClassDto> {
    return this.http.get<ClassDto>(
      `${this.baseUrl}/class/${id}`,
      this.getAuthHeaders()
    );
  }

  addClass(cls: ClassModel): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/class`,
      cls,
      this.getAuthHeaders()
    );
  }

  updateClass(id: number, cls: ClassModel): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/class/${id}`,
      cls,
      this.getAuthHeaders()
    );
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/class/${id}`,
      this.getAuthHeaders()
    );
  }

  /* =========================
     CLASS RELATIONSHIPS
  ========================= */

  addStudentToClass(classId: number, studentId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/class/${classId}/add-student/${studentId}`,
      {},
      this.getAuthHeaders()
    );
  }

  addTeacherToClass(classId: number, teacherId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/class/${classId}/add-teacher/${teacherId}`,
      {},
      this.getAuthHeaders()
    );
  }

  addSubjectToClass(classId: number, subjectId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/class/${classId}/add-subject/${subjectId}`,
      {},
      this.getAuthHeaders()
    );
  }

  /* =========================
     SUBJECT APIs (PROTECTED)
  ========================= */

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(
      `${this.baseUrl}/subjects`,
      this.getAuthHeaders()
    );
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<Subject>(
      `${this.baseUrl}/subject/${id}`,
      this.getAuthHeaders()
    );
  }

  addSubject(subject: Subject): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/subject`,
      subject,
      this.getAuthHeaders()
    );
  }

  updateSubject(id: number, subject: Subject): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/subject/${id}`,
      subject,
      this.getAuthHeaders()
    );
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/subject/${id}`,
      this.getAuthHeaders()
    );
  }
}