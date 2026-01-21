import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Generic base service for API operations
 * Implements DRY principle by extracting common CRUD operations
 * 
 * @example
 * @Injectable({ providedIn: 'root' })
 * export class PostService extends BaseApiService<Post> {
 *   constructor() {
 *     super(API_CONFIG.ENDPOINTS.POSTS);
 *   }
 * }
 */
@Injectable()
export abstract class BaseApiService<T> {
  protected http = inject(HttpClient);

  constructor(protected apiUrl: string) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  getByQuery(params: Record<string, any>): Observable<T[]> {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return this.http.get<T[]>(`${this.apiUrl}?${queryString}`);
  }
}
