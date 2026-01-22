import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'getReturnUrl',
      'clearReturnUrl'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('/');
    (routerSpy as any).events = new Subject();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { params: {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load return URL on init', () => {
      authService.getReturnUrl.and.returnValue('/protected/page');
      
      fixture.detectChanges();

      expect(component.returnUrl()).toBe('/protected/page');
    });

    it('should handle null return URL', () => {
      authService.getReturnUrl.and.returnValue(null);
      
      fixture.detectChanges();

      expect(component.returnUrl()).toBeNull();
    });
  });

  describe('onSubmit - validation', () => {
    it('should show error when username is empty', () => {
      component.username.set('');
      component.password.set('password123');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', () => {
      component.username.set('johndoe');
      component.password.set('');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should show error when both fields are empty', () => {
      component.username.set('');
      component.password.set('');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should clear previous error message on new submit', () => {
      component.errorMessage.set('Previous error');
      component.username.set('johndoe');
      component.password.set('password');
      authService.login.and.returnValue(true);
      authService.getReturnUrl.and.returnValue(null);

      component.onSubmit();

      expect(component.errorMessage()).toBe('');
    });
  });

  describe('onSubmit - successful login', () => {
    it('should navigate to home when login succeeds without return URL', () => {
      component.username.set('johndoe');
      component.password.set('password123');
      authService.login.and.returnValue(true);
      authService.getReturnUrl.and.returnValue(null);

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('johndoe', 'password123');
      expect(authService.clearReturnUrl).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate to return URL when login succeeds', () => {
      component.username.set('johndoe');
      component.password.set('password123');
      authService.login.and.returnValue(true);
      authService.getReturnUrl.and.returnValue('/protected/page');

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('johndoe', 'password123');
      expect(authService.clearReturnUrl).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/protected/page']);
    });

    it('should clear return URL after successful login', () => {
      component.username.set('johndoe');
      component.password.set('password123');
      authService.login.and.returnValue(true);
      authService.getReturnUrl.and.returnValue('/albums');

      component.onSubmit();

      expect(authService.clearReturnUrl).toHaveBeenCalled();
    });

    it('should not show error message on successful login', () => {
      component.username.set('johndoe');
      component.password.set('password123');
      authService.login.and.returnValue(true);
      authService.getReturnUrl.and.returnValue(null);

      component.onSubmit();

      expect(component.errorMessage()).toBe('');
    });
  });

  describe('onSubmit - failed login', () => {
    it('should show error when login fails', () => {
      component.username.set('johndoe');
      component.password.set('wrongpassword');
      authService.login.and.returnValue(false);

      component.onSubmit();

      expect(component.errorMessage()).toBe('Invalid username or password');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when login fails', () => {
      component.username.set('johndoe');
      component.password.set('wrongpassword');
      authService.login.and.returnValue(false);

      component.onSubmit();

      expect(router.navigate).not.toHaveBeenCalled();
      expect(authService.clearReturnUrl).not.toHaveBeenCalled();
    });

    it('should call login service with exact credentials', () => {
      component.username.set('testuser');
      component.password.set('testpass123');
      authService.login.and.returnValue(false);

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('testuser', 'testpass123');
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('signal reactivity', () => {
    it('should update username signal', () => {
      component.username.set('newuser');
      expect(component.username()).toBe('newuser');
    });

    it('should update password signal', () => {
      component.password.set('newpass');
      expect(component.password()).toBe('newpass');
    });

    it('should update errorMessage signal', () => {
      component.errorMessage.set('Test error');
      expect(component.errorMessage()).toBe('Test error');
    });

    it('should handle multiple signal updates', () => {
      component.username.set('user1');
      component.username.set('user2');
      component.username.set('user3');
      
      expect(component.username()).toBe('user3');
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only username', () => {
      component.username.set('   ');
      component.password.set('password');

      component.onSubmit();

      // Whitespace is truthy, so it will attempt login
      expect(authService.login).toHaveBeenCalledWith('   ', 'password');
    });

    it('should handle special characters in credentials', () => {
      component.username.set('user@email.com');
      component.password.set('p@$$w0rd!');
      authService.login.and.returnValue(true);
      authService.getReturnUrl.and.returnValue(null);

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('user@email.com', 'p@$$w0rd!');
    });

    it('should handle very long credentials', () => {
      const longUsername = 'a'.repeat(1000);
      const longPassword = 'b'.repeat(1000);
      component.username.set(longUsername);
      component.password.set(longPassword);
      authService.login.and.returnValue(false);

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith(longUsername, longPassword);
    });
  });
});
