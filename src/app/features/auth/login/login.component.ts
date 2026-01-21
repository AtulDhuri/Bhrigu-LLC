import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardContent } from '@spartan-ng/spar/card';
import { HlmButton } from '@spartan-ng/spar/button';
import { HlmInput } from '@spartan-ng/spar/input';
import { HlmLabel } from '@spartan-ng/spar/label';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardContent,
    HlmButton,
    HlmInput,
    HlmLabel,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
