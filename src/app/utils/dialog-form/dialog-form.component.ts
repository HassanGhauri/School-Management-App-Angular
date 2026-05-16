import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    DialogModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule
  ],
  templateUrl: './dialog-form.component.html',
  styleUrl: './dialog-form.component.scss'
})
export class DialogFormComponent
implements OnInit, OnChanges {

  /* =========================
     DIALOG
  ========================= */
  @Input() visible = false;

  @Output()
  visibleChange =
    new EventEmitter<boolean>();

  /* =========================
     FORM TYPE
  ========================= */
  @Input() type:
    'student'
    | 'teacher'
    | 'class'
    | 'subject' = 'student';

  /* =========================
     EDIT MODE
  ========================= */
  @Input() editMode = false;

  /* =========================
     EDIT DATA
  ========================= */
  @Input() data: any = null;

  /* =========================
     DROPDOWNS
  ========================= */
  @Input() teachers: any[] = [];

  @Input() students: any[] = [];

  @Input() subjects: any[] = [];

  /* =========================
     SAVE EVENT
  ========================= */
  @Output()
  save = new EventEmitter<any>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['data'] &&
      this.form &&
      this.data
    ) {
      this.form.patchValue(this.data);
    }
  }

  /* =========================
     BUILD FORM
  ========================= */
  buildForm() {

    /* =========================
       STUDENT / TEACHER
    ========================= */
    if (
      this.type === 'student' ||
      this.type === 'teacher'
    ) {

      this.form = this.fb.group({

        firstName: [
          '',
          Validators.required
        ],

        lastName: [
          '',
          Validators.required
        ],

        age: [
          '',
          Validators.required
        ],

        email: [
          '',
          Validators.required
        ],

        passwordHash: [
          '',
          Validators.required
        ]
      });
    }

    /* =========================
       CLASS
    ========================= */
    if (this.type === 'class') {

      this.form = this.fb.group({

        className: [
          '',
          Validators.required
        ],

        classTeacherId: [
          null,
          Validators.required
        ],

        studentIds: [[]],

        teacherIds: [[]],

        subjectIds: [[]]
      });
    }

    /* =========================
       SUBJECT
    ========================= */
    if (this.type === 'subject') {

      this.form = this.fb.group({

        name: [
          '',
          Validators.required
        ]
      });
    }

    // patch edit values
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  /* =========================
     SUBMIT
  ========================= */
  submit() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.save.emit(
      this.form.value
    );

    this.close();
  }

  /* =========================
     CLOSE
  ========================= */
  close() {

    this.visible = false;

    this.visibleChange.emit(false);
  }

}