import { Component, Input, Output, EventEmitter, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable pagination component with smart page number display
 * 
 * @example
 * <app-pagination 
 *   [currentPage]="1" 
 *   [totalPages]="10" 
 *   (pageChange)="onPageChange($event)">
 * </app-pagination>
 * 
 * Features:
 * - Smart ellipsis for large page counts (1 ... 4 5 6 ... 10)
 * - Keyboard accessible
 * - Responsive design
 * - Disabled state for first/last pages
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  /** Current active page number */
  @Input() set currentPage(value: number) {
    this._currentPage.set(value);
  }
  
  /** Total number of pages */
  @Input() set totalPages(value: number) {
    this._totalPages.set(value);
  }
  
  /** Emits when user navigates to a different page */
  @Output() pageChange = new EventEmitter<number>();

  private _currentPage = signal(1);
  private _totalPages = signal(1);

  currentPage$ = computed(() => this._currentPage());
  totalPages$ = computed(() => this._totalPages());

  /**
   * Calculates visible page numbers with smart ellipsis
   * Shows: 1 ... current-1 current current+1 ... total
   */
  visiblePages = computed(() => {
    const current = this._currentPage();
    const total = this._totalPages();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }

    return pages;
  });

  /**
   * Navigate to specific page
   * @param page - Page number to navigate to
   */
  goToPage(page: number | string) {
    if (typeof page === 'number' && page !== this._currentPage()) {
      this.pageChange.emit(page);
    }
  }

  /** Navigate to previous page */
  previousPage() {
    const current = this._currentPage();
    if (current > 1) {
      this.pageChange.emit(current - 1);
    }
  }

  /** Navigate to next page */
  nextPage() {
    const current = this._currentPage();
    const total = this._totalPages();
    if (current < total) {
      this.pageChange.emit(current + 1);
    }
  }
}
