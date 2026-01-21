import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/spar/utils';

@Directive({
	selector: '[hlmCardContent]',
})
export class HlmCardContent {
	constructor() {
		classes(() => 'px-6');
	}
}
