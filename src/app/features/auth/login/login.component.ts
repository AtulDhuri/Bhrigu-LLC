import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { HlmCardComponent, HlmCardHeaderComponent, HlmCardTitleComponent, HlmCardContentComponent } from '../../../shared/ui/card.component';
import { HlmButtonDirective } from '../../../shared/ui/button.directive';
import { HlmInputDirective } from '../../../shared/ui/input.directive';
import { HlmLabelDirective } from '../../../shared/ui/label.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    HlmCardComponent,
    HlmCardHeaderComponent,
    HlmCardTitleComponent,
    HlmCardContentComponent,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  returnUrl = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const returnUrl = this.authService.getReturnUrl();
    this.returnUrl.set(returnUrl);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    const success = this.authService.login(this.username(), this.password());
    
    if (success) {
      const returnUrl = this.authService.getReturnUrl() || '/';
      this.authService.clearReturnUrl();
      this.router.navigate([returnUrl]);
    } else {
      this.errorMessage.set('Invalid username or password');
    }
  }
}
