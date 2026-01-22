import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User, UserSession } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key] || null;
    });
    
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStorageMock[key];
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  describe('signup', () => {
    it('should successfully register a new user and create session', () => {
      const newUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123'
      };

      const result = service.signup(newUser);

      expect(result).toBe(true);
      expect(service.currentUser()).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe'
      });
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should store user in localStorage after signup', () => {
      const newUser: User = {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        password: 'secure123'
      };

      service.signup(newUser);

      const storedUsers = JSON.parse(localStorageMock['blog_users']);
      expect(storedUsers).toContain(jasmine.objectContaining({
        username: 'janesmith',
        firstName: 'Jane'
      }));
    });

    it('should reject signup with duplicate username', () => {
      const user1: User = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123'
      };

      const user2: User = {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'johndoe', // Same username
        password: 'different'
      };

      service.signup(user1);
      const result = service.signup(user2);

      expect(result).toBe(false);
      expect(service.currentUser()?.firstName).toBe('John'); // First user still logged in
    });

    it('should not store password in session', () => {
      const newUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123'
      };

      service.signup(newUser);

      const session = JSON.parse(localStorageMock['blog_session']);
      expect(session.password).toBeUndefined();
      expect(session.username).toBe('johndoe');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // Pre-populate with a test user
      const testUser: User = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        password: 'testpass'
      };
      localStorageMock['blog_users'] = JSON.stringify([testUser]);
    });

    it('should successfully login with correct credentials', () => {
      const result = service.login('testuser', 'testpass');

      expect(result).toBe(true);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()).toEqual({
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser'
      });
    });

    it('should fail login with incorrect password', () => {
      const result = service.login('testuser', 'wrongpass');

      expect(result).toBe(false);
      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
    });

    it('should fail login with non-existent username', () => {
      const result = service.login('nonexistent', 'anypass');

      expect(result).toBe(false);
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should create session in localStorage on successful login', () => {
      service.login('testuser', 'testpass');

      const session = JSON.parse(localStorageMock['blog_session']);
      expect(session).toEqual({
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser'
      });
    });
  });

  describe('logout', () => {
    it('should clear session and set currentUser to null', () => {
      // Login first
      const testUser: User = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        password: 'testpass'
      };
      service.signup(testUser);
      expect(service.isAuthenticated()).toBe(true);

      // Logout
      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(localStorageMock['blog_session']).toBeUndefined();
    });
  });

  describe('getInitials', () => {
    it('should return correct initials for logged in user', () => {
      const testUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'pass'
      };
      service.signup(testUser);

      const initials = service.getInitials();

      expect(initials).toBe('JD');
    });

    it('should return empty string when no user is logged in', () => {
      const initials = service.getInitials();

      expect(initials).toBe('');
    });

    it('should handle single character names', () => {
      const testUser: User = {
        firstName: 'A',
        lastName: 'B',
        username: 'ab',
        password: 'pass'
      };
      service.signup(testUser);

      const initials = service.getInitials();

      expect(initials).toBe('AB');
    });
  });

  describe('return URL management', () => {
    it('should store and retrieve return URL', () => {
      const url = '/protected/page';
      
      service.setReturnUrl(url);
      const retrieved = service.getReturnUrl();

      expect(retrieved).toBe(url);
      expect(localStorageMock['blog_return_url']).toBe(url);
    });

    it('should clear return URL', () => {
      service.setReturnUrl('/some/page');
      expect(service.getReturnUrl()).toBe('/some/page');

      service.clearReturnUrl();

      expect(service.getReturnUrl()).toBeNull();
      expect(localStorageMock['blog_return_url']).toBeUndefined();
    });

    it('should return null when no return URL is set', () => {
      const url = service.getReturnUrl();

      expect(url).toBeNull();
    });
  });

  describe('session persistence', () => {
    it('should load existing session on service initialization', () => {
      const existingSession: UserSession = {
        firstName: 'Existing',
        lastName: 'User',
        username: 'existing'
      };
      localStorageMock['blog_session'] = JSON.stringify(existingSession);

      // Create new service instance to trigger constructor
      const newService = new AuthService();

      expect(newService.currentUser()).toEqual(existingSession);
      expect(newService.isAuthenticated()).toBe(true);
    });

    it('should handle missing session gracefully', () => {
      // No session in localStorage
      const newService = new AuthService();

      expect(newService.currentUser()).toBeNull();
      expect(newService.isAuthenticated()).toBe(false);
    });
  });
});
