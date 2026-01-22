import { Component, inject, ChangeDetectionStrategy, computed, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { HlmCard, HlmCardHeader, HlmCardTitle } from '@spartan-ng/spar/card';
import { BaseListComponent } from '../../../shared/base/base-list.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    RouterLink,
    PaginationComponent,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    LucideAngularModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent extends BaseListComponent<Post> {
  isLoading = signal(false);

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
