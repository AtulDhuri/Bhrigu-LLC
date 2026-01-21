import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { AlbumService } from '../../../core/services/album.service';
import { PhotoService } from '../../../core/services/photo.service';
import { Photo } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { HlmButton } from '@spartan-ng/spar/button';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, HlmButton],
  templateUrl: './album-detail.component.html',
  styleUrl: './album-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailComponent {
  private route = inject(ActivatedRoute);
  private albumService = inject(AlbumService);
  private photoService = inject(PhotoService);
  
  currentPage = signal(1);
  photosPerPage = 16; // 4x4 grid = 16 photos
  itemsToShow = signal(16); // For mobile load more
  selectedPhoto = signal<Photo | null>(null);
  modalImageLoading = signal(true);
  modalImageError = signal(false);
  imageTimestamp = signal(Date.now());
  
  placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23999"%3ELoading...%3C/text%3E%3C/svg%3E';
  thumbnailPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%23999"%3E📷%3C/text%3E%3C/svg%3E';

  // Generate placeholder URL for photos
  getPhotoPlaceholder(photoId: number): string {
    return `https://via.placeholder.com/600x600/3b82f6/ffffff?text=Photo+${photoId}`;
  }

  getThumbnailPlaceholder(photoId: number): string {
    return `https://via.placeholder.com/150x150/3b82f6/ffffff?text=${photoId}`;
  }

  album = toSignal(
    this.route.params.pipe(
      switchMap(params => this.albumService.getAlbumById(Number(params['id'])))
    )
  );

  photos = toSignal(
    this.route.params.pipe(
      switchMap(params => this.photoService.getPhotosByAlbumId(Number(params['id'])))
    ),
    { initialValue: [] as Photo[] }
  );

  totalPages = computed(() => Math.ceil(this.photos().length / this.photosPerPage));
  
  hasMore = computed(() => this.itemsToShow() < this.photos().length);
  
  // Desktop: paginated view
  paginatedPhotos = computed(() => {
    const start = (this.currentPage() - 1) * this.photosPerPage;
    const end = start + this.photosPerPage;
    return this.photos().slice(start, end);
  });

  // Mobile: load more view
  loadedPhotos = computed(() => {
    return this.photos().slice(0, this.itemsToShow());
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadMore() {
    this.itemsToShow.set(this.itemsToShow() + this.photosPerPage);
  }

  openPhoto(photo: Photo) {
    this.modalImageLoading.set(true);
    this.modalImageError.set(false);
    this.imageTimestamp.set(Date.now());
    this.selectedPhoto.set(photo);
  }

  closePhoto() {
    this.selectedPhoto.set(null);
    this.modalImageLoading.set(true);
    this.modalImageError.set(false);
  }

  trackByPhotoId(_index: number, photo: Photo): number {
    return photo.id;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc && img.src !== dataSrc) {
      img.src = dataSrc;
      return;
    }
    img.classList.add('loaded');
    const parent = img.parentElement;
    if (parent) {
      parent.classList.add('loaded');
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.classList.add('error');
    }
  }

  onModalImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
    this.modalImageLoading.set(false);
    this.modalImageError.set(false);
  }

  onModalImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    this.modalImageLoading.set(false);
    this.modalImageError.set(true);
  }
}
