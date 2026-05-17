import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5164/sms';

  // =========================
  // LOCAL STORAGE KEYS
  // =========================

  private currentUserKey = 'currentUser';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  // =========================
  // LOGIN
  // =========================

  login(data: LoginDto): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      data
    ).pipe(
      tap(response => {

        // =====================
        // STORE TOKEN
        // =====================

        if (response?.token) {
          localStorage.setItem(
            this.tokenKey,
            response.token
          );
        }

        // =====================
        // STORE USER
        // =====================

        if (response?.user) {
          localStorage.setItem(
            this.currentUserKey,
            JSON.stringify(response.user)
          );
        }
      })
    );
  }

  // =========================
  // GET TOKEN
  // =========================

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // =========================
  // GET CURRENT USER
  // =========================

  getCurrentUser(): AuthUser | null {

    const user = localStorage.getItem(
      this.currentUserKey
    );

    return user ? JSON.parse(user) : null;
  }

  // =========================
  // CHECK LOGIN
  // =========================

  isLoggedIn(): boolean {

    return !!localStorage.getItem(this.tokenKey);
  }

  // =========================
  // ROLE CHECKS
  // =========================

  hasRole(role: string): boolean {

    const user = this.getCurrentUser();

    return user?.role === role;
  }

  // =========================
  // ADMIN CHECK
  // =========================

  isAdmin(): boolean {
    return this.hasRole('Principal');
  }

  // =========================
  // TEACHER CHECK
  // =========================

  isTeacher(): boolean {
    return this.hasRole('Teacher');
  }

  // =========================
  // STUDENT CHECK
  // =========================

  isStudent(): boolean {
    return this.hasRole('Student');
  }

  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    localStorage.removeItem(this.tokenKey);

    localStorage.removeItem(this.currentUserKey);
  }
}