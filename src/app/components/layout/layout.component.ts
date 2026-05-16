import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/app/home',
    },
    {
      label: 'Students',
      icon: 'pi pi-user', // 👈 better than pi-users for individual records
      routerLink: '/app/users',
    },
    {
      label: 'Teachers',
      icon: 'pi pi-user-edit', // 👈 clearly indicates staff/teachers
      routerLink: '/app/teachers',
    },
    {
      label: 'Classes',
      icon: 'pi pi-building', // 👈 correct for school structure
      routerLink: '/app/classes',
    },
    {
      label: 'Subjects',
      icon: 'pi pi-book', // 👈 best match for academic subjects
      routerLink: '/app/subjects',
    },
  ];
}
