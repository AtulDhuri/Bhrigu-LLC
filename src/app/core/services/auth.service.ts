import { Injectable, signal } from '@angular/core';
import { User, UserSession } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'blog_users';
  private readonly SESSION_KEY = 'blog_session';
  private readonly RETURN_URL_KEY = 'blog_return_url';
  
  currentUser = signal<UserSession | null>(null);

  constructor() {
    this.loadSession();
  }

  signup(user: User): boolean {
    const users = this.getUsers();
    
    if (users.find(u => u.username === user.username)) {
      return false;
    }

    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    const session: UserSession = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.currentUser.set(session);
    
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return false;
    }

    const session: UserSession = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.currentUser.set(session);

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  setReturnUrl(url: string): void {
    localStorage.setItem(this.RETURN_URL_KEY, url);
  }

  getReturnUrl(): string | null {
    return localStorage.getItem(this.RETURN_URL_KEY);
  }

  clearReturnUrl(): void {
    localStorage.removeItem(this.RETURN_URL_KEY);
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private loadSession(): void {
    const sessionJson = localStorage.getItem(this.SESSION_KEY);
    if (sessionJson) {
      this.currentUser.set(JSON.parse(sessionJson));
    }
  }
}
