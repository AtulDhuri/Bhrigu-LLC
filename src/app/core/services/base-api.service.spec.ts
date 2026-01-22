import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

interface TestItem {
  id: number;
  name: string;
}

@Injectable()
class TestApiService extends BaseApiService<TestItem> {
  constructor() {
    super('https://api.test.com/items');
  }
}

describe('BaseApiService', () => {
  let service: TestApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://api.test.com/items';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestApiService]
    });

    service = TestBed.inject(TestApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  describe('getAll', () => {
    it('should fetch all items successfully', (done) => {
      const mockItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ];

      service.getAll().subscribe(items => {
        expect(items.length).toBe(3);
        expect(items).toEqual(mockItems);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should return empty array on error', (done) => {
      spyOn(console, 'error'); // Suppress error logging

      service.getAll().subscribe(items => {
        expect(items).toEqual([]);
        expect(console.error).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'), { status: 500 });
    });

    it('should handle 404 error gracefully', (done) => {
      spyOn(console, 'error');

      service.getAll().subscribe(items => {
        expect(items).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getById', () => {
    it('should fetch single item by ID', (done) => {
      const mockItem: TestItem = { id: 1, name: 'Item 1' };

      service.getById(1).subscribe(item => {
        expect(item).toEqual(mockItem);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });

    it('should return null on error', (done) => {
      spyOn(console, 'error');

      service.getById(999).subscribe(item => {
        expect(item).toBeNull();
        expect(console.error).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.error(new ProgressEvent('Not found'), { status: 404 });
    });

    it('should handle server error gracefully', (done) => {
      spyOn(console, 'error');

      service.getById(1).subscribe(item => {
        expect(item).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getByQuery', () => {
    it('should fetch items with query parameters', (done) => {
      const mockItems: TestItem[] = [
        { id: 1, name: 'Filtered Item' }
      ];
      const params = { userId: 1, status: 'active' };

      service.getByQuery(params).subscribe(items => {
        expect(items).toEqual(mockItems);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=1&status=active`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle single query parameter', (done) => {
      const mockItems: TestItem[] = [{ id: 1, name: 'Item' }];

      service.getByQuery({ id: 1 }).subscribe(items => {
        expect(items).toEqual(mockItems);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}?id=1`);
      req.flush(mockItems);
    });

    it('should return empty array on query error', (done) => {
      spyOn(console, 'error');

      service.getByQuery({ invalid: 'param' }).subscribe(items => {
        expect(items).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}?invalid=param`);
      req.error(new ProgressEvent('Bad request'), { status: 400 });
    });

    it('should handle empty query parameters', (done) => {
      const mockItems: TestItem[] = [];

      service.getByQuery({}).subscribe(items => {
        expect(items).toEqual(mockItems);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}?`);
      req.flush(mockItems);
    });
  });

  describe('error logging', () => {
    it('should log error with API URL on getAll failure', (done) => {
      spyOn(console, 'error');

      service.getAll().subscribe(() => {
        expect(console.error).toHaveBeenCalledWith(
          jasmine.stringContaining(apiUrl),
          jasmine.anything()
        );
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Error'));
    });

    it('should log error with item ID on getById failure', (done) => {
      spyOn(console, 'error');

      service.getById(42).subscribe(() => {
        expect(console.error).toHaveBeenCalledWith(
          jasmine.stringContaining('42'),
          jasmine.anything()
        );
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/42`);
      req.error(new ProgressEvent('Error'));
    });
  });
});
