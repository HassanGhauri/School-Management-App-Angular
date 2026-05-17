import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/AuthService.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {

  items: MenuItem[] = [];
  currentUser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {

    this.currentUser = this.authService.getCurrentUser();
    const role = this.currentUser?.role;

    // =========================
    // TEACHER / STUDENT
    // =========================
    if (role === 'Teacher' || role === 'student') {

      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/app/home',
        },
        {
          label: 'Profile',
          icon: 'pi pi-user',
          routerLink: '/app/profile',
        }
      ];
    }

    // =========================
    // PRINCIPAL (ADMIN)
    // =========================
    else if (role === 'Principal') {

      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/app/home',
        },
        {
          label: 'Students',
          icon: 'pi pi-users',
          routerLink: '/app/users',
        },
        {
          label: 'Teachers',
          icon: 'pi pi-user-edit',
          routerLink: '/app/teachers',
        },
        {
          label: 'Classes',
          icon: 'pi pi-building',
          routerLink: '/app/classes',
        },
        {
          label: 'Subjects',
          icon: 'pi pi-book',
          routerLink: '/app/subjects',
        },
        {
          label: 'Profile',
          icon: 'pi pi-user',
          routerLink: '/app/profile',
        },
      ];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}