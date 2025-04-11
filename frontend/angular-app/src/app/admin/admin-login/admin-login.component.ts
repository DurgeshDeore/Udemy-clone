import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true, 
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  imports: [FormsModule,CommonModule, ReactiveFormsModule]
})
export class AdminLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  loginForm: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.authService.adminLogin({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.router.navigateByUrl("/admindashboard");
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
  

  goToRegister(): void {
    alert('Redirecting to register page...');
    this.router.navigate(['/admindashboard']); 
  }
}
