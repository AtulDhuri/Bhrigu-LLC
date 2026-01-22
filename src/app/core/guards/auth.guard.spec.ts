import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'setReturnUrl'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected/page' } as RouterStateSnapshot;

    spyOn(console, 'log'); // Suppress console logs
  });

  describe('authenticated user', () => {
    it('should allow access when user is authenticated', () => {
      authService.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(authService.setReturnUrl).not.toHaveBeenCalled();
    });

    it('should not save return URL when authenticated', () => {
      authService.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).not.toHaveBeenCalled();
    });

    it('should log authentication check', () => {
      authService.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(console.log).toHaveBeenCalledWith('Auth guard - checking authentication');
      expect(console.log).toHaveBeenCalledWith('Is authenticated:', true);
    });
  });

  describe('unauthenticated user', () => {
    it('should deny access when user is not authenticated', () => {
      authService.isAuthenticated.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
    });

    it('should redirect to login page', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should save return URL before redirecting', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/albums/5';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('/albums/5');
    });

    it('should save return URL before navigation', () => {
      authService.isAuthenticated.and.returnValue(false);
      let setReturnUrlCalled = false;
      let navigateCalled = false;

      authService.setReturnUrl.and.callFake(() => {
        setReturnUrlCalled = true;
        expect(navigateCalled).toBe(false); // Should be called before navigate
      });

      router.navigate.and.callFake(() => {
        navigateCalled = true;
        expect(setReturnUrlCalled).toBe(true); // Should be called after setReturnUrl
        return Promise.resolve(true);
      });

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(setReturnUrlCalled).toBe(true);
      expect(navigateCalled).toBe(true);
    });

    it('should log redirect information', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/protected/resource';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(console.log).toHaveBeenCalledWith('Not authenticated - saving return URL:', '/protected/resource');
      expect(console.log).toHaveBeenCalledWith('Redirecting to login');
    });
  });

  describe('different URLs', () => {
    it('should handle root URL', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('/');
    });

    it('should handle nested URLs', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/posts/123/comments';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('/posts/123/comments');
    });

    it('should handle URLs with query parameters', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/posts?page=2&filter=active';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('/posts?page=2&filter=active');
    });

    it('should handle URLs with fragments', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/posts/5#comments';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('/posts/5#comments');
    });
  });

  describe('logging behavior', () => {
    it('should log current URL being accessed', () => {
      authService.isAuthenticated.and.returnValue(true);
      mockState.url = '/albums';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(console.log).toHaveBeenCalledWith('Current URL:', '/albums');
    });

    it('should log authentication status', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(console.log).toHaveBeenCalledWith('Is authenticated:', false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty URL', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle very long URLs', () => {
      authService.isAuthenticated.and.returnValue(false);
      const longUrl = '/posts/' + 'a'.repeat(1000);
      mockState.url = longUrl;

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith(longUrl);
    });

    it('should handle special characters in URL', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState.url = '/search?q=hello%20world&filter=new';

      TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(authService.setReturnUrl).toHaveBeenCalledWith('/search?q=hello%20world&filter=new');
    });
  });
});
