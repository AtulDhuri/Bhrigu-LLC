import { Injectable } from '@angular/core';
import { Album } from '../models';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService extends BaseApiService<Album> {
  constructor() {
    super(getApiUrl(API_CONFIG.ENDPOINTS.ALBUMS));
  }

  // Inherited methods from BaseApiService:
  // - getAll(): Observable<Album[]>
  // - getById(id: number): Observable<Album>
  
  // Alias methods for backward compatibility
  getAlbums() {
    return this.getAll();
  }

  getAlbumById(id: number) {
    return this.getById(id);
  }
}
