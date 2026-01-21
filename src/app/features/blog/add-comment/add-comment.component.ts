import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { HlmCardComponent, HlmCardHeaderComponent, HlmCardTitleComponent, HlmCardContentComponent } from '../../../shared/ui/card.component';
import { HlmButtonDirective } from '../../../shared/ui/button.directive';
import { HlmInputDirective } from '../../../shared/ui/input.directive';
import { HlmLabelDirective } from '../../../shared/ui/label.directive';

@Component({
  selector: 'app-add-comment',
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
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent implements OnInit {
  postId = signal<number>(0);
  name = signal('');
  email = signal('');
  body = signal('');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postId.set(id);

    const user = this.authService.currentUser();
    if (user) {
      this.name.set(`${user.firstName} ${user.lastName}`);
      this.email.set(user.username + '@example.com');
    }
  }

  onSubmit() {
    this.errorMessage.set('');

    if (!this.name() || !this.email() || !this.body()) {
      this.errorMessage.set('All fields are required');
      return;
    }

    if (!this.isValidEmail(this.email())) {
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    this.commentService.addComment({
      postId: this.postId(),
      name: this.name(),
      email: this.email(),
      body: this.body()
    });

    this.router.navigate(['/posts', this.postId()]);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
