import { Component, inject, computed, ChangeDetectionStrategy, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AlbumService } from '../../../core/services/album.service';
import { Album } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardContent } from '@spartan-ng/spar/card';
import { BaseListComponent } from '../../../shared/base/base-list.component';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    RouterLink,
    PaginationComponent,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardContent,
    LucideAngularModule,
  ],
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumListComponent extends BaseListComponent<Album> {
  isLoading = signal(false);

  constructor() {
    const albumService = inject(AlbumService);
    super(albumService.getAlbums(), 12);
  }

  // All common list logic inherited from BaseListComponent:
  // - currentPage, itemsToShow, totalPages, hasMore
  // - paginatedItems, loadedItems
  // - goToPage(), loadMore(), trackById()

  // Computed aliases for template compatibility
  paginatedAlbums = computed(() => this.paginatedItems());
  loadedAlbums = computed(() => this.loadedItems());

  trackByAlbumId = this.trackById;

  // Infinite scroll implementation
  @HostListener('window:scroll')
  onScroll() {
    // Only trigger on mobile view
    if (window.innerWidth > 768) return;
    
    // Check if user scrolled near bottom (within 200px)
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.scrollHeight - 200;
    
    if (scrollPosition >= bottomPosition && this.hasMore() && !this.isLoading()) {
      this.isLoading.set(true);
      
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        this.loadMore();
        this.isLoading.set(false);
      }, 300);
    }
  }
}
