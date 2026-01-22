import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('service initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should extend BaseApiService', () => {
      expect(service.getAll).toBeDefined();
      expect(service.getById).toBeDefined();
    });
  });

  describe('getPosts', () => {
    it('should fetch all posts', (done) => {
      const mockPosts: Post[] = [
        { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
        { userId: 1, id: 2, title: 'Post 2', body: 'Body 2' },
        { userId: 2, id: 3, title: 'Post 3', body: 'Body 3' }
      ];

      service.getPosts().subscribe(posts => {
        expect(posts.length).toBe(3);
        expect(posts).toEqual(mockPosts);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should return empty array on error', (done) => {
      spyOn(console, 'error');

      service.getPosts().subscribe(posts => {
        expect(posts).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'));
    });

    it('should call getAll method', (done) => {
      spyOn(service, 'getAll').and.callThrough();

      service.getPosts().subscribe(() => {
        expect(service.getAll).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });
  });

  describe('getPostById', () => {
    it('should fetch single post by id', (done) => {
      const mockPost: Post = {
        userId: 1,
        id: 5,
        title: 'Test Post',
        body: 'Test Body'
      };

      service.getPostById(5).subscribe(post => {
        expect(post).toEqual(mockPost);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });

    it('should return null on error', (done) => {
      spyOn(console, 'error');

      service.getPostById(999).subscribe(post => {
        expect(post).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.error(new ProgressEvent('Not found'));
    });

    it('should call getById method', (done) => {
      spyOn(service, 'getById').and.callThrough();

      service.getPostById(1).subscribe(() => {
        expect(service.getById).toHaveBeenCalledWith(1);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush({ userId: 1, id: 1, title: 'Post', body: 'Body' });
    });

    it('should handle different post ids', (done) => {
      const ids = [1, 10, 100];
      let completed = 0;

      ids.forEach(id => {
        service.getPostById(id).subscribe(() => {
          completed++;
          if (completed === ids.length) {
            done();
          }
        });

        const req = httpMock.expectOne(`${apiUrl}/${id}`);
        req.flush({ userId: 1, id, title: `Post ${id}`, body: `Body ${id}` });
      });
    });
  });

  describe('data structure validation', () => {
    it('should return posts with correct structure', (done) => {
      const mockPost: Post = {
        userId: 1,
        id: 1,
        title: 'Test',
        body: 'Test body'
      };

      service.getPostById(1).subscribe(post => {
        expect(post).toBeDefined();
        expect(post?.userId).toBeDefined();
        expect(post?.id).toBeDefined();
        expect(post?.title).toBeDefined();
        expect(post?.body).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(mockPost);
    });

    it('should handle posts with all required fields', (done) => {
      const mockPosts: Post[] = [
        { userId: 1, id: 1, title: 'Title 1', body: 'Body 1' },
        { userId: 2, id: 2, title: 'Title 2', body: 'Body 2' }
      ];

      service.getPosts().subscribe(posts => {
        posts.forEach(post => {
          expect(post.userId).toBeDefined();
          expect(post.id).toBeDefined();
          expect(post.title).toBeDefined();
          expect(post.body).toBeDefined();
        });
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockPosts);
    });
  });

  describe('backward compatibility', () => {
    it('should maintain getPosts alias', () => {
      expect(service.getPosts).toBeDefined();
      expect(typeof service.getPosts).toBe('function');
    });

    it('should maintain getPostById alias', () => {
      expect(service.getPostById).toBeDefined();
      expect(typeof service.getPostById).toBe('function');
    });

    it('getPosts should return same result as getAll', (done) => {
      const mockPosts: Post[] = [
        { userId: 1, id: 1, title: 'Post', body: 'Body' }
      ];

      let getPostsResult: Post[] = [];
      let getAllResult: Post[] = [];

      service.getPosts().subscribe(posts => {
        getPostsResult = posts;
        if (getAllResult.length > 0) {
          expect(getPostsResult).toEqual(getAllResult);
          done();
        }
      });

      service.getAll().subscribe(posts => {
        getAllResult = posts;
        if (getPostsResult.length > 0) {
          expect(getPostsResult).toEqual(getAllResult);
          done();
        }
      });

      const requests = httpMock.match(apiUrl);
      requests.forEach(req => req.flush(mockPosts));
    });
  });

  describe('error handling', () => {
    it('should handle 404 errors gracefully', (done) => {
      spyOn(console, 'error');

      service.getPostById(999).subscribe(post => {
        expect(post).toBeNull();
        expect(console.error).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 errors gracefully', (done) => {
      spyOn(console, 'error');

      service.getPosts().subscribe(posts => {
        expect(posts).toEqual([]);
        expect(console.error).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors', (done) => {
      spyOn(console, 'error');

      service.getPosts().subscribe(posts => {
        expect(posts).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'), { status: 0 });
    });
  });

  describe('multiple requests', () => {
    it('should handle concurrent requests', (done) => {
      let completed = 0;

      service.getPostById(1).subscribe(() => {
        completed++;
        if (completed === 2) done();
      });

      service.getPostById(2).subscribe(() => {
        completed++;
        if (completed === 2) done();
      });

      const req1 = httpMock.expectOne(`${apiUrl}/1`);
      const req2 = httpMock.expectOne(`${apiUrl}/2`);

      req1.flush({ userId: 1, id: 1, title: 'Post 1', body: 'Body 1' });
      req2.flush({ userId: 1, id: 2, title: 'Post 2', body: 'Body 2' });
    });

    it('should handle sequential requests', (done) => {
      service.getPostById(1).subscribe(() => {
        service.getPostById(2).subscribe(() => {
          done();
        });

        const req2 = httpMock.expectOne(`${apiUrl}/2`);
        req2.flush({ userId: 1, id: 2, title: 'Post 2', body: 'Body 2' });
      });

      const req1 = httpMock.expectOne(`${apiUrl}/1`);
      req1.flush({ userId: 1, id: 1, title: 'Post 1', body: 'Body 1' });
    });
  });
});
