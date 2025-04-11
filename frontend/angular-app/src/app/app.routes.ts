import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoursesComponent } from './courses/courses.component';
import { SettingsComponent } from './settings/settings.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { authGuard } from './auth.guard';
// import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CourseVideoComponent } from './course-video/course-video.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { AdminGuard } from './guards/admin.guard';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { 
      path: 'courses', 
      component: CoursesComponent,
      canActivate: [authGuard] 
    },
    { path:'course-video', component: CourseVideoComponent},
    { path: 'course-video/:videoUrl', component: CourseVideoComponent }, 
    { 
      path: 'profile',
      component: ProfileComponent,
      canActivate: [authGuard]
    },
    { path: 'search', component: SearchComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
      path: 'admin/users',
      component: UserListComponent,
      canActivate: [AdminGuard]
    },
    {
      path: 'admin',
      canActivate: [AdminGuard],
      children: [
        { path: 'dashboard', component: AdminDashboardComponent },
        { path: 'users', component: UserListComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
      ]
    },
    { path: '**', component: PagenotfoundComponent, title: 'Page Not Found' },
    //admin path
    { path: 'adminlogin', component: AdminLoginComponent},
    { path: 'admindashboard', component: AdminDashboardComponent},
  ];