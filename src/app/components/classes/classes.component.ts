import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AppService, ClassDto } from '../../services/appService.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterOutlet],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit {

  classes: ClassDto[] = [];

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses() {
    this.appService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // 👉 NAVIGATE TO CLASS DETAIL
  openClass(cls: ClassDto) {
    this.router.navigate(['/app/classes', cls.id]);
  }
}