import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AppService, ClassDto } from '../../services/appService.component';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss'
})
export class ClassComponent implements OnInit {

  classId!: number;
  classData!: ClassDto;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClass();
  }

  loadClass() {
    this.loading = true;

    this.appService.getClassById(this.classId).subscribe({
      next: (data) => {
        this.classData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}