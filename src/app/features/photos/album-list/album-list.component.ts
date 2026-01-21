import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AlbumService } from '../../../core/services/album.service';
import { Album } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardContent } from '@spartan-ng/spar/card';
import { HlmButton } from '@spartan-ng/spar/button';
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
    HlmButton,
    LucideAngularModule,
  ],
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumListComponent extends BaseListComponent<Album> {
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
}
