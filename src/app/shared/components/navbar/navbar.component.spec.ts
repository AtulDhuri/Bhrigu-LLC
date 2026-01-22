import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated', 'getInitials'], {
      currentUser: signal(null)
    });
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      isDarkMode: signal(false)
    });

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { params: {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with menu closed', () => {
      expect(component.menuOpen).toBe(false);
    });

    it('should inject AuthService', () => {
      expect(component.authService).toBeDefined();
      expect(component.authService).toBe(authService);
    });

    it('should inject ThemeService', () => {
      expect(component.themeService).toBeDefined();
      expect(component.themeService).toBe(themeService);
    });
  });

  describe('toggleMenu', () => {
    it('should open menu when closed', () => {
      component.menuOpen = false;

      component.toggleMenu();

      expect(component.menuOpen).toBe(true);
    });

    it('should close menu when open', () => {
      component.menuOpen = true;

      component.toggleMenu();

      expect(component.menuOpen).toBe(false);
    });

    it('should toggle menu multiple times', () => {
      expect(component.menuOpen).toBe(false);

      component.toggleMenu();
      expect(component.menuOpen).toBe(true);

      component.toggleMenu();
      expect(component.menuOpen).toBe(false);

      component.toggleMenu();
      expect(component.menuOpen).toBe(true);
    });
  });

  describe('closeMenu', () => {
    it('should close open menu', () => {
      component.menuOpen = true;

      component.closeMenu();

      expect(component.menuOpen).toBe(false);
    });

    it('should keep menu closed when already closed', () => {
      component.menuOpen = false;

      component.closeMenu();

      expect(component.menuOpen).toBe(false);
    });

    it('should be idempotent', () => {
      component.menuOpen = true;

      component.closeMenu();
      component.closeMenu();
      component.closeMenu();

      expect(component.menuOpen).toBe(false);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should close menu after logout', () => {
      component.menuOpen = true;

      component.logout();

      expect(component.menuOpen).toBe(false);
    });

    it('should call logout before closing menu', () => {
      let logoutCalled = false;
      let menuClosedWhenLogoutCalled = false;

      authService.logout.and.callFake(() => {
        logoutCalled = true;
        menuClosedWhenLogoutCalled = !component.menuOpen;
      });

      component.menuOpen = true;
      component.logout();

      expect(logoutCalled).toBe(true);
      expect(menuClosedWhenLogoutCalled).toBe(false); // Menu should still be open when logout is called
      expect(component.menuOpen).toBe(false); // Menu should be closed after
    });

    it('should work when menu is already closed', () => {
      component.menuOpen = false;

      component.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(component.menuOpen).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('should call themeService.toggleTheme', () => {
      component.toggleTheme();

      expect(themeService.toggleTheme).toHaveBeenCalled();
    });

    it('should call toggleTheme each time', () => {
      component.toggleTheme();
      component.toggleTheme();
      component.toggleTheme();

      expect(themeService.toggleTheme).toHaveBeenCalledTimes(3);
    });

    it('should not affect menu state', () => {
      component.menuOpen = true;

      component.toggleTheme();

      expect(component.menuOpen).toBe(true);
    });
  });

  describe('service integration', () => {
    it('should access authService.currentUser', () => {
      const currentUser = component.authService.currentUser;
      expect(currentUser).toBeDefined();
    });

    it('should access themeService.isDarkMode', () => {
      const isDarkMode = component.themeService.isDarkMode;
      expect(isDarkMode).toBeDefined();
    });

    it('should call authService.isAuthenticated', () => {
      authService.isAuthenticated.and.returnValue(true);

      const result = component.authService.isAuthenticated();

      expect(result).toBe(true);
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });

    it('should call authService.getInitials', () => {
      authService.getInitials.and.returnValue('JD');

      const initials = component.authService.getInitials();

      expect(initials).toBe('JD');
      expect(authService.getInitials).toHaveBeenCalled();
    });
  });

  describe('menu state management', () => {
    it('should maintain menu state across multiple operations', () => {
      component.toggleMenu();
      expect(component.menuOpen).toBe(true);

      component.toggleTheme();
      expect(component.menuOpen).toBe(true);

      component.closeMenu();
      expect(component.menuOpen).toBe(false);
    });

    it('should reset menu state after logout', () => {
      component.menuOpen = true;
      component.logout();
      
      expect(component.menuOpen).toBe(false);

      component.toggleMenu();
      expect(component.menuOpen).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid menu toggles', () => {
      for (let i = 0; i < 100; i++) {
        component.toggleMenu();
      }

      expect(component.menuOpen).toBe(false); // Even number of toggles
    });

    it('should handle logout without authentication', () => {
      authService.isAuthenticated.and.returnValue(false);

      expect(() => component.logout()).not.toThrow();
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should handle theme toggle without affecting other state', () => {
      component.menuOpen = true;
      const initialMenuState = component.menuOpen;

      component.toggleTheme();

      expect(component.menuOpen).toBe(initialMenuState);
    });
  });

  describe('method chaining behavior', () => {
    it('should allow sequential operations', () => {
      component.toggleMenu();
      component.toggleTheme();
      component.closeMenu();

      expect(component.menuOpen).toBe(false);
      expect(themeService.toggleTheme).toHaveBeenCalled();
    });

    it('should handle logout followed by menu operations', () => {
      component.menuOpen = true;
      component.logout();
      component.toggleMenu();

      expect(component.menuOpen).toBe(true);
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('component state consistency', () => {
    it('should maintain consistent state after multiple interactions', () => {
      // Simulate user interactions
      component.toggleMenu(); // Open
      expect(component.menuOpen).toBe(true);

      component.toggleTheme(); // Theme change
      expect(component.menuOpen).toBe(true);

      component.logout(); // Logout closes menu
      expect(component.menuOpen).toBe(false);

      component.toggleMenu(); // Open again
      expect(component.menuOpen).toBe(true);

      component.closeMenu(); // Explicit close
      expect(component.menuOpen).toBe(false);
    });

    it('should not have side effects between methods', () => {
      const initialMenuState = component.menuOpen;

      component.toggleTheme();
      expect(component.menuOpen).toBe(initialMenuState);

      authService.getInitials();
      expect(component.menuOpen).toBe(initialMenuState);
    });
  });

  describe('public API', () => {
    it('should expose toggleMenu method', () => {
      expect(typeof component.toggleMenu).toBe('function');
    });

    it('should expose closeMenu method', () => {
      expect(typeof component.closeMenu).toBe('function');
    });

    it('should expose logout method', () => {
      expect(typeof component.logout).toBe('function');
    });

    it('should expose toggleTheme method', () => {
      expect(typeof component.toggleTheme).toBe('function');
    });

    it('should expose menuOpen property', () => {
      expect(component.menuOpen).toBeDefined();
      expect(typeof component.menuOpen).toBe('boolean');
    });

    it('should expose authService', () => {
      expect(component.authService).toBeDefined();
    });

    it('should expose themeService', () => {
      expect(component.themeService).toBeDefined();
    });
  });
});
