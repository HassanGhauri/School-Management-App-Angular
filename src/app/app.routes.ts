import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { StudentsComponent } from './components/students/students.component';
import { ClassesComponent } from './components/classes/classes.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { ClassComponent } from './components/class/class.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },

    {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'users', component: StudentsComponent },
      { path: 'subjects', component: SubjectsComponent},
      { path: 'classes', component: ClassesComponent},
      { path: 'classes/:id', component: ClassComponent},
      { path: 'teachers', component: TeachersComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];
