import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './app/login/login.component';
import { CoursesComponent } from './app/courses/courses.component';
// import { AdminComponent } from './app/admin/admin.component';
import { RegisterComponent } from './app/register/register.component';
import { ProfileComponent } from './app/profile/profile.component';
import { AdminLoginComponent } from './app/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './app/admin/admin-dashboard/admin-dashboard.component';
import { CourseVideoComponent } from './app/course-video/course-video.component';
import { SearchComponent } from './app/search/search.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'course-video', component: CourseVideoComponent},
  { path: 'course-video/:videoUrl', component: CourseVideoComponent }, 
  { path: 'search', component: SearchComponent},
  // { path: 'admin', component: AdminComponent},
  { path: 'profile', component: ProfileComponent},
  // { path: '', redirectTo: 'login', pathMatch: 'full' }
  //admin path
  {path:'adminlogin', component: AdminLoginComponent},
  {path:'admindashboard', component: AdminDashboardComponent},
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
})
  .catch((err) => console.error(err));
