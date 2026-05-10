import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/app/home'
    },
    {
      label: 'Students',
      icon: 'pi pi-users',
      routerLink: '/app/users'
    },
    {
      label: 'Teachers',
      icon: 'pi pi-building',
      routerLink: '/app/teachers'
    },
    {
      label: 'Classes',
      icon: 'pi pi-building',
      routerLink: '/app/classes'
    }
  ];

}