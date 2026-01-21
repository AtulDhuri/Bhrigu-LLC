import { Injectable } from '@angular/core';
import { Photo } from '../models';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseApiService<Photo> {
  constructor() {
    super(getApiUrl(API_CONFIG.ENDPOINTS.PHOTOS));
  }

  // Inherited methods from BaseApiService:
  // - getAll(): Observable<Photo[]>
  // - getById(id: number): Observable<Photo>
  // - getByQuery(params): Observable<Photo[]>
  
  getPhotosByAlbumId(albumId: number) {
    return this.getByQuery({ albumId });
  }
}
