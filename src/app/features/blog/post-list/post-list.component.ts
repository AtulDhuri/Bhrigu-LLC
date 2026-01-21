import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models';
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
  selector: 'app-post-list',
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
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent extends BaseListComponent<Post> {
  constructor() {
    const postService = inject(PostService);
    super(postService.getPosts(), 5); // 5 posts per page
  }

  // All common list logic inherited from BaseListComponent:
  // - currentPage, itemsToShow, totalPages, hasMore
  // - paginatedItems, loadedItems
  // - goToPage(), loadMore(), trackById()

  // Computed aliases for template compatibility
  paginatedPosts = computed(() => this.paginatedItems());
  loadedPosts = computed(() => this.loadedItems());

  trackByPostId = this.trackById;
}
