import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AlbumService } from '../../../core/services/album.service';
import { Album } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import {
  HlmCardComponent,
  HlmCardHeaderComponent,
  HlmCardTitleComponent,
  HlmCardContentComponent,
} from '../../../shared/ui/card.component';
import { HlmButtonDirective } from '../../../shared/ui/button.directive';
import { BaseListComponent } from '../../../shared/base/base-list.component';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PaginationComponent,
    HlmCardComponent,
    HlmCardHeaderComponent,
    HlmCardTitleComponent,
    HlmCardContentComponent,
    HlmButtonDirective,
    LucideAngularModule,
  ],
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css',
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
