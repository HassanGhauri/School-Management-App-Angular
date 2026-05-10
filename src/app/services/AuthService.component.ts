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

  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  // =========================
  // LOGIN API
  // =========================
  login(data: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, data).pipe(
      tap(response => {
        // store user in localStorage
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
  // GET CURRENT USER
  // =========================
  getCurrentUser(): AuthUser | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  // =========================
  // CHECK LOGIN STATUS
  // =========================
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

}