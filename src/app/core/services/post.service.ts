import { Injectable } from '@angular/core';
import { Post } from '../models';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseApiService<Post> {
  constructor() {
    super(getApiUrl(API_CONFIG.ENDPOINTS.POSTS));
  }

  // Inherited methods from BaseApiService:
  // - getAll(): Observable<Post[]>
  // - getById(id: number): Observable<Post>
  
  // Alias methods for backward compatibility
  getPosts() {
    return this.getAll();
  }

  getPostById(id: number) {
    return this.getById(id);
  }
}
