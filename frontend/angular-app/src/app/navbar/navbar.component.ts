import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isMenuOpen = false;
  searchQuery = '';
  isLoggedIn = this.authService.isAuthenticated;

  ngOnInit() {
    // Check auth status on initialization
    this.authService.verifySession().subscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearAuth(); // Now this works
        this.router.navigate(['/login']);
      }
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() }
      });
      this.searchQuery = '';
    }
  }
  
}
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent {
//   isLoggedIn = !!localStorage.getItem('user');
//   isMenuOpen = false;

//   toggleMenu() {
//     this.isMenuOpen = !this.isMenuOpen;
//   }
//   logout() {
//     localStorage.removeItem('user');
//     this.isLoggedIn = false;
//     window.location.href = '/login';
//   }
// }
