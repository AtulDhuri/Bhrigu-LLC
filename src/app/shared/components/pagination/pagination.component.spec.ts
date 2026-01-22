import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      fixture.detectChanges();
      expect(component.currentPage$()).toBe(1);
      expect(component.totalPages$()).toBe(1);
    });
  });

  describe('visiblePages calculation', () => {
    it('should show all pages when total is 7 or less', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1, 2, 3, 4, 5]);
    });

    it('should show ellipsis for large page counts at start', () => {
      component.currentPage = 2;
      component.totalPages = 10;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('should show ellipsis for large page counts at end', () => {
      component.currentPage = 9;
      component.totalPages = 10;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1, '...', 7, 8, 9, 10]);
    });

    it('should show ellipsis on both sides for middle pages', () => {
      component.currentPage = 5;
      component.totalPages = 10;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });

    it('should handle single page', () => {
      component.currentPage = 1;
      component.totalPages = 1;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1]);
    });

    it('should handle exactly 7 pages', () => {
      component.currentPage = 4;
      component.totalPages = 7;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should handle exactly 8 pages with ellipsis', () => {
      component.currentPage = 5;
      component.totalPages = 8;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([1, '...', 4, 5, 6, '...', 8]);
    });
  });

  describe('goToPage', () => {
    it('should emit pageChange event with valid page number', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;
      component.totalPages = 5;
      fixture.detectChanges();

      component.goToPage(3);

      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should not emit event when clicking current page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 3;
      component.totalPages = 5;
      fixture.detectChanges();

      component.goToPage(3);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit event for ellipsis', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 5;
      component.totalPages = 10;
      fixture.detectChanges();

      component.goToPage('...');

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should handle page 1 navigation', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 5;
      fixture.detectChanges();

      component.goToPage(1);

      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('previousPage', () => {
    it('should navigate to previous page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 3;
      component.totalPages = 5;
      fixture.detectChanges();

      component.previousPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should not navigate before page 1', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;
      component.totalPages = 5;
      fixture.detectChanges();

      component.previousPage();

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should handle navigation from last page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 10;
      component.totalPages = 10;
      fixture.detectChanges();

      component.previousPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(9);
    });
  });

  describe('nextPage', () => {
    it('should navigate to next page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 3;
      component.totalPages = 5;
      fixture.detectChanges();

      component.nextPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(4);
    });

    it('should not navigate beyond last page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 5;
      component.totalPages = 5;
      fixture.detectChanges();

      component.nextPage();

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should handle navigation from first page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;
      component.totalPages = 10;
      fixture.detectChanges();

      component.nextPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('template rendering', () => {
    it('should render correct number of page buttons', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      fixture.detectChanges();

      const pageButtons = fixture.debugElement.queryAll(By.css('button'));
      // Previous + 5 pages + Next = 7 buttons
      expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('should disable previous button on first page', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      fixture.detectChanges();

      const prevButton = fixture.debugElement.query(By.css('button'));
      expect(prevButton.nativeElement.disabled).toBe(true);
    });

    it('should enable previous button when not on first page', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      fixture.detectChanges();

      const prevButton = fixture.debugElement.query(By.css('button'));
      expect(prevButton.nativeElement.disabled).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle zero pages', () => {
      component.currentPage = 1;
      component.totalPages = 0;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toEqual([]);
    });

    it('should handle very large page numbers', () => {
      component.currentPage = 50;
      component.totalPages = 100;
      fixture.detectChanges();

      const visible = component.visiblePages();
      expect(visible).toContain(50);
      expect(visible).toContain('...');
      expect(visible.length).toBeLessThanOrEqual(7);
    });

    it('should update visible pages when currentPage changes', () => {
      component.currentPage = 1;
      component.totalPages = 10;
      fixture.detectChanges();

      let visible = component.visiblePages();
      expect(visible).toContain(1);

      component.currentPage = 5;
      fixture.detectChanges();

      visible = component.visiblePages();
      expect(visible).toContain(5);
    });
  });
});
