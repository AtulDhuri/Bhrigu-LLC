import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  const testUrl = 'https://api.test.com/data';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(console, 'error'); // Suppress error logging
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('successful requests', () => {
    it('should pass through successful requests', (done) => {
      const mockData = { id: 1, name: 'Test' };

      httpClient.get(testUrl).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush(mockData);
    });

    it('should not modify successful response', (done) => {
      const mockData = [1, 2, 3, 4, 5];

      httpClient.get(testUrl).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          expect(console.error).not.toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush(mockData);
    });
  });

  describe('client-side errors', () => {
    it('should handle network errors', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unable to connect to the server. Please check your internet connection.');
          expect(console.error).toHaveBeenCalledWith('Client-side error:', jasmine.any(String));
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.error(new ProgressEvent('error'), { status: 0 });
    });

    it('should provide user-friendly message for connection errors', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unable to connect to the server. Please check your internet connection.');
          expect(error.status).toBe(0);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.error(new ProgressEvent('error'), { status: 0 });
    });
  });

  describe('HTTP status code errors', () => {
    it('should handle 400 Bad Request', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Bad request. Please check your input.');
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 Unauthorized', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unauthorized. Please log in again.');
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 403 Forbidden', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Access forbidden. You do not have permission to access this resource.');
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 404 Not Found', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Resource not found.');
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 Internal Server Error', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Internal server error. Please try again later.');
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle 503 Service Unavailable', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBe('Service unavailable. Please try again later.');
          expect(error.status).toBe(503);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Service unavailable', { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle unknown status codes', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toContain('Error 418');
          expect(error.status).toBe(418);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('I am a teapot', { status: 418, statusText: 'I am a teapot' });
    });
  });

  describe('error logging', () => {
    it('should log HTTP errors to console', (done) => {
      httpClient.get(testUrl).subscribe({
        error: () => {
          expect(console.error).toHaveBeenCalledWith(
            jasmine.stringContaining('HTTP Error 404'),
            jasmine.any(String)
          );
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should log status code in error message', (done) => {
      httpClient.get(testUrl).subscribe({
        error: () => {
          expect(console.error).toHaveBeenCalledWith(
            jasmine.stringContaining('500'),
            jasmine.any(String)
          );
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('error object structure', () => {
    it('should include original error in response', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.originalError).toBeDefined();
          expect(error.originalError instanceof HttpErrorResponse).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should include status code in error object', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should include user-friendly message', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBeDefined();
          expect(typeof error.message).toBe('string');
          expect(error.message.length).toBeGreaterThan(0);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('different HTTP methods', () => {
    it('should handle POST errors', (done) => {
      httpClient.post(testUrl, { data: 'test' }).subscribe({
        error: (error) => {
          expect(error.message).toBe('Bad request. Please check your input.');
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('POST');
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle PUT errors', (done) => {
      httpClient.put(testUrl, { data: 'test' }).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PUT');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle DELETE errors', (done) => {
      httpClient.delete(testUrl).subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('edge cases', () => {
    it('should handle errors with no status code', (done) => {
      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(error.message).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.error(new ProgressEvent('error'));
    });

    it('should handle multiple consecutive errors', (done) => {
      let errorCount = 0;

      httpClient.get(testUrl + '/1').subscribe({
        error: () => {
          errorCount++;
          if (errorCount === 2) {
            expect(errorCount).toBe(2);
            done();
          }
        }
      });

      httpClient.get(testUrl + '/2').subscribe({
        error: () => {
          errorCount++;
        }
      });

      const req1 = httpMock.expectOne(testUrl + '/1');
      const req2 = httpMock.expectOne(testUrl + '/2');
      
      req1.flush('Error', { status: 500, statusText: 'Error' });
      req2.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });
});
