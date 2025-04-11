

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { AuthService } from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [FormsModule, CommonModule, RouterModule]
})
export class AdminDashboardComponent {
  course = {
    title: '',
    description: '',
    dprice: 0,
    price: 0,
    instructor: '',
    duration: '',
    videoLink: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  urlError: string | null = null;

  validateYouTubeUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const isValid = pattern.test(url);
    this.urlError = isValid ? null : 'Please enter a valid YouTube URL';
    return isValid;
  }


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.verifyAdminSession();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  async verifyAdminSession() {
    const isLoggedIn = await this.authService.verifySession();
    if (!isLoggedIn) {
      this.router.navigate(['/adminlogin']);
    }
  }

  async addCourse() {
    this.isLoading = true;
    this.errorMessage = null;

    if (!this.validateYouTubeUrl(this.course.videoLink)) {
      return;
    }

    try {
      if (!this.course.title || !this.course.description) {
        throw new Error('Title and description are required');
      }

      await this.http.post('http://localhost:4020/courses', {
        title: this.course.title,
        description: this.course.description,
        dprice: Number(this.course.dprice),
        price: Number(this.course.price),
        instructor: this.course.instructor,
        duration: this.course.duration,
        videoLink: this.course.videoLink,
      }, {
        withCredentials: true
      }).toPromise();

      this.successMessage = 'Course added successfully!';
      this.resetForm();
    } catch (err: any) {
      this.errorMessage = err.error?.message || err.message || 'Failed to add course';
      if (err.status === 401) {
        this.router.navigate(['/adminlogin']);
      }
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm() {
    this.course = {
      title: '',
      description: '',
      dprice: 0,
      price: 0,
      instructor: '',
      duration: '',
      videoLink: ''
    };
  }
}