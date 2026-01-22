import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../core/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('/');
    (routerSpy as any).events = new Subject();

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { params: {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty fields', () => {
      expect(component.firstName()).toBe('');
      expect(component.lastName()).toBe('');
      expect(component.username()).toBe('');
      expect(component.password()).toBe('');
      expect(component.confirmPassword()).toBe('');
      expect(component.errorMessage()).toBe('');
    });
  });

  describe('onSubmit - validation', () => {
    it('should show error when firstName is empty', () => {
      component.firstName.set('');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('password123');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should show error when lastName is empty', () => {
      component.firstName.set('John');
      component.lastName.set('');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('password123');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should show error when username is empty', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('');
      component.password.set('password123');
      component.confirmPassword.set('password123');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('');
      component.confirmPassword.set('password123');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should show error when confirmPassword is empty', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should show error when all fields are empty', () => {
      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
      expect(authService.signup).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit - password validation', () => {
    beforeEach(() => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
    });

    it('should show error when passwords do not match', () => {
      component.password.set('password123');
      component.confirmPassword.set('password456');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Passwords do not match');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should show error when password is too short', () => {
      component.password.set('12345');
      component.confirmPassword.set('12345');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Password must be at least 6 characters');
      expect(authService.signup).not.toHaveBeenCalled();
    });

    it('should accept password with exactly 6 characters', () => {
      component.password.set('123456');
      component.confirmPassword.set('123456');
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(component.errorMessage()).toBe('');
      expect(authService.signup).toHaveBeenCalled();
    });

    it('should accept password longer than 6 characters', () => {
      component.password.set('password123');
      component.confirmPassword.set('password123');
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalled();
    });

    it('should validate password length before matching', () => {
      component.password.set('12345');
      component.confirmPassword.set('12345');

      component.onSubmit();

      // Should show length error, not mismatch error
      expect(component.errorMessage()).toBe('Password must be at least 6 characters');
    });
  });

  describe('onSubmit - successful signup', () => {
    beforeEach(() => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('password123');
    });

    it('should call authService.signup with correct data', () => {
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123'
      });
    });

    it('should navigate to home on successful signup', () => {
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should not show error message on success', () => {
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(component.errorMessage()).toBe('');
    });

    it('should clear previous error message', () => {
      component.errorMessage.set('Previous error');
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(component.errorMessage()).toBe('');
    });
  });

  describe('onSubmit - failed signup', () => {
    beforeEach(() => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('existinguser');
      component.password.set('password123');
      component.confirmPassword.set('password123');
    });

    it('should show error when username already exists', () => {
      authService.signup.and.returnValue(false);

      component.onSubmit();

      expect(component.errorMessage()).toBe('Username already exists');
    });

    it('should not navigate when signup fails', () => {
      authService.signup.and.returnValue(false);

      component.onSubmit();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should call signup service even if it fails', () => {
      authService.signup.and.returnValue(false);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalledTimes(1);
    });
  });

  describe('signal reactivity', () => {
    it('should update firstName signal', () => {
      component.firstName.set('Jane');
      expect(component.firstName()).toBe('Jane');
    });

    it('should update lastName signal', () => {
      component.lastName.set('Smith');
      expect(component.lastName()).toBe('Smith');
    });

    it('should update username signal', () => {
      component.username.set('janesmith');
      expect(component.username()).toBe('janesmith');
    });

    it('should update password signal', () => {
      component.password.set('newpass');
      expect(component.password()).toBe('newpass');
    });

    it('should update confirmPassword signal', () => {
      component.confirmPassword.set('newpass');
      expect(component.confirmPassword()).toBe('newpass');
    });

    it('should update errorMessage signal', () => {
      component.errorMessage.set('Test error');
      expect(component.errorMessage()).toBe('Test error');
    });
  });

  describe('validation order', () => {
    it('should check empty fields before password match', () => {
      component.firstName.set('');
      component.password.set('pass1');
      component.confirmPassword.set('pass2');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please fill in all fields');
    });

    it('should check password match before length', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('12345');
      component.confirmPassword.set('54321');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Passwords do not match');
    });

    it('should check password length before calling signup', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('12345');
      component.confirmPassword.set('12345');

      component.onSubmit();

      expect(component.errorMessage()).toBe('Password must be at least 6 characters');
      expect(authService.signup).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in names', () => {
      component.firstName.set('  John  ');
      component.lastName.set('  Doe  ');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('password123');
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalledWith({
        firstName: '  John  ',
        lastName: '  Doe  ',
        username: 'johndoe',
        password: 'password123'
      });
    });

    it('should handle special characters in username', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('john.doe@email.com');
      component.password.set('password123');
      component.confirmPassword.set('password123');
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalledWith(
        jasmine.objectContaining({ username: 'john.doe@email.com' })
      );
    });

    it('should handle very long passwords', () => {
      const longPassword = 'a'.repeat(1000);
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set(longPassword);
      component.confirmPassword.set(longPassword);
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalledWith(
        jasmine.objectContaining({ password: longPassword })
      );
    });

    it('should handle unicode characters in names', () => {
      component.firstName.set('José');
      component.lastName.set('García');
      component.username.set('josegarcia');
      component.password.set('password123');
      component.confirmPassword.set('password123');
      authService.signup.and.returnValue(true);

      component.onSubmit();

      expect(authService.signup).toHaveBeenCalledWith({
        firstName: 'José',
        lastName: 'García',
        username: 'josegarcia',
        password: 'password123'
      });
    });
  });

  describe('multiple submissions', () => {
    it('should handle multiple failed submissions', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('password123');
      authService.signup.and.returnValue(false);

      component.onSubmit();
      expect(component.errorMessage()).toBe('Username already exists');

      component.onSubmit();
      expect(component.errorMessage()).toBe('Username already exists');
      expect(authService.signup).toHaveBeenCalledTimes(2);
    });

    it('should clear error on successful retry', () => {
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.username.set('johndoe');
      component.password.set('password123');
      component.confirmPassword.set('password123');

      authService.signup.and.returnValue(false);
      component.onSubmit();
      expect(component.errorMessage()).toBe('Username already exists');

      authService.signup.and.returnValue(true);
      component.onSubmit();
      expect(component.errorMessage()).toBe('');
    });
  });
});
