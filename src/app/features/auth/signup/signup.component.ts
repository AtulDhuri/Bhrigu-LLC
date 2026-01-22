import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HlmButton } from '@spartan-ng/spar/button';
import { HlmInput } from '@spartan-ng/spar/input';
import { HlmLabel } from '@spartan-ng/spar/label';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  firstName = signal('');
  lastName = signal('');
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.firstName() || !this.lastName() || !this.username() || !this.password() || !this.confirmPassword()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    const success = this.authService.signup({
      firstName: this.firstName(),
      lastName: this.lastName(),
      username: this.username(),
      password: this.password()
    });

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('Username already exists');
    }
  }
}
