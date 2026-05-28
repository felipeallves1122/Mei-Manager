import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';

  constructor() {
    this.isAuthenticated.set(!!localStorage.getItem('token'));
  }

  login(email: string, pass: string) {
    return this.http.post<{access_token: string}>(`${this.apiUrl}/login`, { email, password: pass }).pipe(
      tap(res => {
        this.isAuthenticated.set(true);
        localStorage.setItem('token', res.access_token);
      })
    );
  }

  register(email: string, pass: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password: pass });
  }

  logout() {
    this.isAuthenticated.set(false);
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
