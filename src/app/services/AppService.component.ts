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

  // optional
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

  private baseUrl =
    'http://localhost:5164/sms';

  constructor(
    private http: HttpClient
  ) {}

  /* =========================
     USER APIs
  ========================= */

  getUsers(): Observable<User[]> {

    return this.http.get<User[]>(
      `${this.baseUrl}/users`
    );
  }

  getUserById(
    id: number
  ): Observable<User> {

    return this.http.get<User>(
      `${this.baseUrl}/user/${id}`
    );
  }

  addUser(
    user: User
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/user`,
      user
    );
  }

  updateUser(
    id: number,
    user: User
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/user/${id}`,
      user
    );
  }

  deleteUser(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.baseUrl}/user/${id}`
    );
  }

  /* =========================
     CLASS APIs
  ========================= */

  getClasses():
    Observable<ClassDto[]> {

    return this.http.get<ClassDto[]>(
      `${this.baseUrl}/classes`
    );
  }

  getClassById(
    id: number
  ): Observable<ClassDto> {

    return this.http.get<ClassDto>(
      `${this.baseUrl}/class/${id}`
    );
  }

  addClass(
    cls: ClassModel
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/class`,
      cls
    );
  }

  updateClass(
    id: number,
    cls: ClassModel
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/class/${id}`,
      cls
    );
  }

  deleteClass(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.baseUrl}/class/${id}`
    );
  }

  /* =========================
     CLASS RELATIONSHIPS
  ========================= */

  addStudentToClass(
    classId: number,
    studentId: number
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/class/${classId}/add-student/${studentId}`,
      {}
    );
  }

  addTeacherToClass(
    classId: number,
    teacherId: number
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/class/${classId}/add-teacher/${teacherId}`,
      {}
    );
  }

  addSubjectToClass(
    classId: number,
    subjectId: number
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/class/${classId}/add-subject/${subjectId}`,
      {}
    );
  }

  /* =========================
     SUBJECT APIs
  ========================= */

  // GET ALL SUBJECTS
  getSubjects():
    Observable<Subject[]> {

    return this.http.get<Subject[]>(
      `${this.baseUrl}/subjects`
    );
  }

  // GET SUBJECT BY ID
  getSubjectById(
    id: number
  ): Observable<Subject> {

    return this.http.get<Subject>(
      `${this.baseUrl}/subject/${id}`
    );
  }

  // ADD SUBJECT
  addSubject(
    subject: Subject
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/subject`,
      subject
    );
  }

  // UPDATE SUBJECT
  updateSubject(
    id: number,
    subject: Subject
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/subject/${id}`,
      subject
    );
  }

  // DELETE SUBJECT
  deleteSubject(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.baseUrl}/subject/${id}`
    );
  }

}