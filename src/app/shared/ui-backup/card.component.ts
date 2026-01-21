import { Component } from '@angular/core';

@Component({
  selector: 'hlm-card',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    class: 'block rounded-xl border bg-card text-card-foreground shadow',
  },
})
export class HlmCardComponent {}

@Component({
  selector: 'hlm-card-header',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    class: 'flex flex-col space-y-1.5 p-6',
  },
})
export class HlmCardHeaderComponent {}

@Component({
  selector: 'hlm-card-title',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    class: 'font-semibold leading-none tracking-tight',
  },
})
export class HlmCardTitleComponent {}

@Component({
  selector: 'hlm-card-description',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    class: 'text-sm text-muted-foreground',
  },
})
export class HlmCardDescriptionComponent {}

@Component({
  selector: 'hlm-card-content',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    class: 'p-6 pt-0',
  },
})
export class HlmCardContentComponent {}

@Component({
  selector: 'hlm-card-footer',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    class: 'flex items-center p-6 pt-0',
  },
})
export class HlmCardFooterComponent {}
