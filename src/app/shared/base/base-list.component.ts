import { signal, computed, Directive } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/**
 * Base class for list components with pagination and load-more functionality
 * Implements DRY principle by extracting common list logic
 * 
 * @example
 * export class PostListComponent extends BaseListComponent<Post> {
 *   constructor() {
 *     super(postService.getPosts(), 6);
 *   }
 * }
 */
@Directive()
export abstract class BaseListComponent<T extends { id: number }> {
  currentPage = signal(1);
  itemsToShow = signal(0);
  
  protected items!: ReturnType<typeof toSignal<T[], T[]>>;

  totalPages = computed(() => 
    Math.ceil(this.items().length / this.itemsPerPage)
  );
  
  hasMore = computed(() => 
    this.itemsToShow() < this.items().length
  );
  
  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.items().slice(start, end);
  });

  loadedItems = computed(() => 
    this.items().slice(0, this.itemsToShow())
  );

  constructor(
    dataSource$: Observable<T[]>,
    protected itemsPerPage: number
  ) {
    this.items = toSignal(dataSource$, { initialValue: [] as T[] });
    this.itemsToShow.set(itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadMore(): void {
    this.itemsToShow.set(this.itemsToShow() + this.itemsPerPage);
  }

  trackById(_index: number, item: T): number {
    return item.id;
  }
}
