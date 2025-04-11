
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // 'user' or 'admin'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:4020';
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.verifySession().subscribe(); // Check session on initialization
  }

  private loadUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData).pipe(
      tap((response: any) => {
        if (response.user) {
          this.setUser({ ...response.user, role: 'user' });
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials, { 
      withCredentials: true 
    }).pipe(
      tap((response: any) => {
        if (response.user) {
          this.setUser({ ...response.user, role: 'user' });
        }
      })
    );
  }

  adminLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/adminlogin`, credentials, { 
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        this.setUser({
          id: 'admin',
          name: 'Admin',
          email: credentials.email,
          role: 'admin'
        });
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.API_URL}/logout`, { withCredentials: true }).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/login']);
      })
    );
  }

  private setUser(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearAuth(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
  }

  verifySession(): Observable<any> {
    return this.http.get(`${this.API_URL}/verify-session`, { 
      withCredentials: true 
    }).pipe(
      tap((response: any) => {
        if (response?.session?.user) {
          const user = {
            id: response.session.user.id,
            name: response.session.user.name,
            email: response.session.user.email,
            role: response.session.user.role || 'user'
          };
          this.setUser(user);
        }
      })
    );
  }
}
// import { Injectable, signal, WritableSignal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable, tap } from 'rxjs';

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role?: string; // 'user' or 'admin'
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly API_URL = 'http://localhost:4020';
//   currentUser = signal<User | null>(null);

//   constructor(private http: HttpClient, private router: Router) {
//     this.loadUser();
//   }

//   private loadUser(): void {
//     const userData = localStorage.getItem('currentUser');
//     if (userData) {
//       this.currentUser.set(JSON.parse(userData));
//     }
//   }

//   isLoggedIn(): boolean {
//     return this.currentUser() !== null;
//   }

//   isAdmin(): boolean {
//     return this.currentUser()?.role === 'admin';
//   }

//   register(userData: { name: string; email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.API_URL}/register`, userData).pipe(
//       tap((response: any) => {
//         if (response.user) {
//           this.currentUser.set({ ...response.user, role: 'user' });
//           localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
//         }
//       })
//     );
//   }

//   login(credentials: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.API_URL}/login`, credentials, { 
//       withCredentials: true 
//     }).pipe(
//       tap((response: any) => {
//         if (response.user) {
//           const userWithRole = { ...response.user, role: 'user' };
//           this.currentUser.set(userWithRole);
//           localStorage.setItem('currentUser', JSON.stringify(userWithRole));
//         }
//       })
//     );
//   }

//   adminLogin(credentials: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.API_URL}/adminlogin`, credentials, { 
//       withCredentials: true
//     }).pipe(
//       tap((response: any) => {
//         const adminUser = {
//           id: 'admin',
//           name: 'Admin',
//           email: credentials.email,
//           role: 'admin'
//         };
//         this.currentUser.set(adminUser);
//         localStorage.setItem('currentUser', JSON.stringify(adminUser));
//       })
//     );
//   }

//   logout(): Observable<any> {
//     return this.http.get(`${this.API_URL}/logout`, { withCredentials: true }).pipe(
//       tap(() => {
//         this.clearAuth();
//         this.router.navigate(['/login']);
//       })
//     );
//   }

//   private clearAuth(): void {
//     this.currentUser.set(null);
//     localStorage.removeItem('currentUser');
//   }

//   verifySession(): Observable<any> {
//     return this.http.get(`${this.API_URL}/verify-session`, { 
//       withCredentials: true 
//     }).pipe(
//       tap((response: any) => {
//         if (response?.session?.user) {
//           const user = {
//             id: response.session.user.id,
//             name: response.session.user.name,
//             email: response.session.user.email,
//             role: response.session.user.role || 'user'
//           };
//           this.currentUser.set(user);
//           localStorage.setItem('currentUser', JSON.stringify(user));
//         }
//       })
//     );
//   }
// }

