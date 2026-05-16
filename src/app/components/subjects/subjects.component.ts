import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import {
  AppService,
  Subject
} from '../../services/appService.component';
import { DialogFormComponent } from '../../utils/dialog-form/dialog-form.component';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,

    DialogFormComponent
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent
implements OnInit {

  subjects: Subject[] = [];

  loading = false;

  showDialog = false;

  editMode = false;

  selectedSubject: any = null;

  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  /* =========================
     LOAD SUBJECTS
  ========================= */
  loadSubjects() {

    this.loading = true;

    this.appService
      .getSubjects()
      .subscribe({

        next: (data) => {

          this.subjects = data;

          this.loading = false;
        },

        error: (err) => {

          console.error(err);

          this.loading = false;
        }
      });
  }

  /* =========================
     OPEN CREATE
  ========================= */
  openCreateDialog() {

    this.editMode = false;

    this.selectedSubject = null;

    this.showDialog = true;
  }

  /* =========================
     OPEN EDIT
  ========================= */
  editSubject(
    subject: Subject
  ) {

    this.editMode = true;

    this.selectedSubject = {
      name: subject.name
    };

    this.selectedSubject.id =
      subject.id;

    this.showDialog = true;
  }

  /* =========================
     SAVE
  ========================= */
  saveSubject(data: any) {

    // EDIT
    if (
      this.editMode &&
      this.selectedSubject?.id
    ) {

      this.appService
        .updateSubject(
          this.selectedSubject.id,
          data
        )
        .subscribe({

          next: () => {
            this.loadSubjects();
          }
        });

      return;
    }

    // CREATE
    this.appService
      .addSubject(data)
      .subscribe({

        next: () => {
          this.loadSubjects();
        }
      });
  }

  /* =========================
     DELETE
  ========================= */
  deleteSubject(
    subject: Subject
  ) {

    if (
      !confirm(
        `Delete ${subject.name}?`
      )
    ) return;

    this.appService
      .deleteSubject(subject.id!)
      .subscribe({

        next: () => {
          this.loadSubjects();
        }
      });
  }

}