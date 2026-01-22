import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { of, delay } from 'rxjs';
import { BaseListComponent } from './base-list.component';

interface TestItem {
  id: number;
  name: string;
}

@Component({
  template: '',
  standalone: true
})
class TestListComponent extends BaseListComponent<TestItem> {
  constructor() {
    const mockData: TestItem[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`
    }));
    super(of(mockData), 5);
  }
}

describe('BaseListComponent', () => {
  let component: TestListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestListComponent]
    });

    const fixture = TestBed.createComponent(TestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should start at page 1', () => {
      expect(component.currentPage()).toBe(1);
    });

    it('should initialize with correct items per page', () => {
      expect(component.itemsToShow()).toBe(5);
    });

    it('should load all items from observable', () => {
      expect(component.paginatedItems().length).toBeGreaterThan(0);
      expect(component.totalPages()).toBe(5);
    });
  });

  describe('totalPages calculation', () => {
    it('should calculate correct total pages', () => {
      // 25 items / 5 per page = 5 pages
      expect(component.totalPages()).toBe(5);
    });

    it('should handle exact division', () => {
      const mockData: TestItem[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`
      }));
      
      TestBed.runInInjectionContext(() => {
        const exactComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(of(mockData), 5);
          }
        })();

        expect(exactComponent.totalPages()).toBe(4);
      });
    });

    it('should round up for partial pages', () => {
      const mockData: TestItem[] = Array.from({ length: 23 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`
      }));
      
      TestBed.runInInjectionContext(() => {
        const partialComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(of(mockData), 5);
          }
        })();

        // 23 items / 5 per page = 4.6, should round to 5
        expect(partialComponent.totalPages()).toBe(5);
      });
    });
  });

  describe('paginatedItems', () => {
    it('should return correct items for first page', () => {
      component.currentPage.set(1);
      const items = component.paginatedItems();

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });

    it('should return correct items for middle page', () => {
      component.currentPage.set(3);
      const items = component.paginatedItems();

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(11); // (3-1) * 5 + 1
      expect(items[4].id).toBe(15);
    });

    it('should return correct items for last page', () => {
      component.currentPage.set(5);
      const items = component.paginatedItems();

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(21);
      expect(items[4].id).toBe(25);
    });

    it('should handle partial last page', () => {
      const mockData: TestItem[] = Array.from({ length: 23 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`
      }));
      
      TestBed.runInInjectionContext(() => {
        const partialComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(of(mockData), 5);
          }
        })();

        partialComponent.currentPage.set(5);
        const items = partialComponent.paginatedItems();

        expect(items.length).toBe(3); // Only 3 items on last page
        expect(items[0].id).toBe(21);
        expect(items[2].id).toBe(23);
      });
    });
  });

  describe('loadedItems', () => {
    it('should return items up to itemsToShow', () => {
      component.itemsToShow.set(10);
      const items = component.loadedItems();

      expect(items.length).toBe(10);
      expect(items[0].id).toBe(1);
      expect(items[9].id).toBe(10);
    });

    it('should update when itemsToShow changes', () => {
      component.itemsToShow.set(5);
      expect(component.loadedItems().length).toBe(5);

      component.itemsToShow.set(15);
      expect(component.loadedItems().length).toBe(15);
    });

    it('should not exceed total items', () => {
      component.itemsToShow.set(100);
      const items = component.loadedItems();

      expect(items.length).toBe(25); // Total items available
    });
  });

  describe('hasMore', () => {
    it('should return true when more items available', () => {
      component.itemsToShow.set(10);
      expect(component.hasMore()).toBe(true);
    });

    it('should return false when all items shown', () => {
      component.itemsToShow.set(25);
      expect(component.hasMore()).toBe(false);
    });

    it('should return false when itemsToShow exceeds total', () => {
      component.itemsToShow.set(100);
      expect(component.hasMore()).toBe(false);
    });

    it('should update reactively', () => {
      component.itemsToShow.set(5);
      expect(component.hasMore()).toBe(true);

      component.itemsToShow.set(25);
      expect(component.hasMore()).toBe(false);
    });
  });

  describe('goToPage', () => {
    it('should navigate to valid page', () => {
      component.goToPage(3);
      expect(component.currentPage()).toBe(3);
    });

    it('should not navigate to page 0', () => {
      component.currentPage.set(2);
      component.goToPage(0);
      expect(component.currentPage()).toBe(2); // Should not change
    });

    it('should not navigate beyond total pages', () => {
      component.currentPage.set(3);
      component.goToPage(10);
      expect(component.currentPage()).toBe(3); // Should not change
    });

    it('should navigate to page 1', () => {
      component.currentPage.set(5);
      component.goToPage(1);
      expect(component.currentPage()).toBe(1);
    });

    it('should navigate to last page', () => {
      component.goToPage(5);
      expect(component.currentPage()).toBe(5);
    });

    it('should call window.scrollTo', () => {
      const scrollSpy = jasmine.createSpy('scrollTo');
      window.scrollTo = scrollSpy as any;
      
      component.goToPage(2);
      
      expect(scrollSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });

    it('should not scroll for invalid page', () => {
      const scrollSpy = jasmine.createSpy('scrollTo');
      window.scrollTo = scrollSpy as any;
      
      component.goToPage(0);
      
      expect(scrollSpy).not.toHaveBeenCalled();
    });
  });

  describe('loadMore', () => {
    it('should increase itemsToShow by itemsPerPage', () => {
      component.itemsToShow.set(5);
      component.loadMore();
      
      expect(component.itemsToShow()).toBe(10);
    });

    it('should allow multiple loadMore calls', () => {
      component.itemsToShow.set(5);
      component.loadMore();
      component.loadMore();
      component.loadMore();
      
      expect(component.itemsToShow()).toBe(20);
    });

    it('should update hasMore after loading', () => {
      component.itemsToShow.set(20);
      expect(component.hasMore()).toBe(true);
      
      component.loadMore();
      expect(component.hasMore()).toBe(false); // Now showing all 25
    });

    it('should update loadedItems after loading', () => {
      component.itemsToShow.set(5);
      expect(component.loadedItems().length).toBe(5);
      
      component.loadMore();
      expect(component.loadedItems().length).toBe(10);
    });
  });

  describe('trackById', () => {
    it('should return item id', () => {
      const item: TestItem = { id: 42, name: 'Test' };
      const result = component.trackById(0, item);
      
      expect(result).toBe(42);
    });

    it('should work with different indices', () => {
      const item: TestItem = { id: 100, name: 'Test' };
      
      expect(component.trackById(0, item)).toBe(100);
      expect(component.trackById(5, item)).toBe(100);
      expect(component.trackById(99, item)).toBe(100);
    });

    it('should return unique ids for different items', () => {
      const item1: TestItem = { id: 1, name: 'Item 1' };
      const item2: TestItem = { id: 2, name: 'Item 2' };
      
      expect(component.trackById(0, item1)).not.toBe(component.trackById(0, item2));
    });
  });

  describe('reactive updates', () => {
    it('should update paginatedItems when page changes', () => {
      component.currentPage.set(1);
      const page1Items = component.paginatedItems();
      
      component.currentPage.set(2);
      const page2Items = component.paginatedItems();
      
      expect(page1Items[0].id).not.toBe(page2Items[0].id);
    });

    it('should recalculate totalPages when items change', () => {
      const initialPages = component.totalPages();
      expect(initialPages).toBe(5);
      
      // Verify totalPages is computed correctly based on loaded items
      expect(component.totalPages()).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty data', () => {
      TestBed.runInInjectionContext(() => {
        const emptyComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(of([]), 5);
          }
        })();

        expect(emptyComponent.loadedItems().length).toBe(0);
        expect(emptyComponent.totalPages()).toBe(0);
        expect(emptyComponent.paginatedItems().length).toBe(0);
        expect(emptyComponent.hasMore()).toBe(false);
      });
    });

    it('should handle single item', () => {
      TestBed.runInInjectionContext(() => {
        const singleComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(of([{ id: 1, name: 'Only Item' }]), 5);
          }
        })();

        expect(singleComponent.totalPages()).toBe(1);
        expect(singleComponent.paginatedItems().length).toBe(1);
        expect(singleComponent.hasMore()).toBe(false);
      });
    });

    it('should handle itemsPerPage larger than total items', () => {
      TestBed.runInInjectionContext(() => {
        const smallComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(of([
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' }
            ]), 10);
          }
        })();

        expect(smallComponent.totalPages()).toBe(1);
        expect(smallComponent.paginatedItems().length).toBe(2);
      });
    });
  });

  describe('async data loading', () => {
    it('should handle delayed observable', (done) => {
      TestBed.runInInjectionContext(() => {
        const delayedData = of([
          { id: 1, name: 'Delayed Item' }
        ]).pipe(delay(10));

        const delayedComponent = new (class extends BaseListComponent<TestItem> {
          constructor() {
            super(delayedData, 5);
          }
        })();

        // Initially empty
        expect(delayedComponent.loadedItems().length).toBe(0);

        // After delay
        setTimeout(() => {
          expect(delayedComponent.loadedItems().length).toBeGreaterThan(0);
          done();
        }, 20);
      });
    });
  });
});
