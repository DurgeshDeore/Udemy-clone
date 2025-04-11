import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent, RouterModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


onRegister() {
  if (!this.name || !this.email || !this.password) {
    this.errorMessage = 'All fields are required';
    return;
  }

  this.isLoading = true;
  this.errorMessage = null;

  this.authService.register({
    name: this.name,
    email: this.email,
    password: this.password
  }).subscribe({
    next: () => {
      this.router.navigate(['/courses']);
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Registration error:', err); // Add logging
      this.errorMessage = err.error?.message || 
                         err.message || 
                         'Registration failed. Please try again.';
    }
  });
}
}

// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { FormsModule} from '@angular/forms';
// import { HeaderComponent } from '../header/header.component';
// import { FooterComponent } from '../footer/footer.component';
// @Component({
//   standalone: true,
//   imports : [FormsModule, HeaderComponent, FooterComponent],
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   username: string = '';
//   email: string = '';
//   password: string = '';

//   constructor(private http: HttpClient, private router: Router) {}

//   onRegister() {
//     this.http.post('http://localhost:4020/register', {
//       username: this.username,
//       email: this.email,
//       password: this.password
//     })
//     .subscribe(
//       (res: any) => {
//         alert(res.message);
//         this.router.navigate(['/login']);
//       },
//       err => alert(err.error.message)
//     );
//   }
// }
