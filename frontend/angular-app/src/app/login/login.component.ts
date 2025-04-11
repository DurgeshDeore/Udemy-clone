import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/courses';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}

// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common'; // Correct import for NgIf
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { HeaderComponent } from '../header/header.component';
// import { FooterComponent } from '../footer/footer.component';

// @Component({
//   standalone: true,
//   imports: [FormsModule, CommonModule, HeaderComponent,FooterComponent],
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';
//   isLoading: boolean = false;
//   errorMessage: string | null = null;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   onLogin() {
//     this.isLoading = true;
//     this.errorMessage = null;

//     this.authService.login({
//       email: this.email,
//       password: this.password
//     }).subscribe({
//       next: () => {
//         const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/courses';
//         this.router.navigateByUrl(returnUrl);
//       },
//       error: (err: { error: { message: string; }; }) => {
//         this.isLoading = false;
//         this.errorMessage = err.error?.message || 'Login failed. Please try again.';
//       }
//     });
//   }
// }