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
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
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
