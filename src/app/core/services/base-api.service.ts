import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

/**
 * Generic base service for API operations
 * Implements DRY principle by extracting common CRUD operations
 * 
 * Features:
 * - Automatic error handling with fallback data
 * - Type-safe API calls
 * - Consistent error logging
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

  /**
   * Get all items
   * Returns empty array on error to prevent app crashes
   */
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl).pipe(
      catchError(() => {
        return of([] as T[]); // Return empty array as fallback
      })
    );
  }

  /**
   * Get item by ID
   * Returns null on error
   */
  getById(id: number): Observable<T | null> {
    return this.http.get<T>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        return of(null); // Return null as fallback
      })
    );
  }

  /**
   * Get items by query parameters
   * Returns empty array on error
   */
  getByQuery(params: Record<string, any>): Observable<T[]> {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return this.http.get<T[]>(`${this.apiUrl}?${queryString}`).pipe(
      catchError(error => {
        console.error(`Error fetching with query from ${this.apiUrl}:`, error);
        return of([] as T[]); // Return empty array as fallback
      })
    );
  }
}
