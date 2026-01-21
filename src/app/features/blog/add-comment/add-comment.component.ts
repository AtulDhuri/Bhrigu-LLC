import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardContent } from '@spartan-ng/spar/card';
import { HlmButton } from '@spartan-ng/spar/button';
import { HlmInput } from '@spartan-ng/spar/input';
import { HlmLabel } from '@spartan-ng/spar/label';

@Component({
  selector: 'app-add-comment',
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
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent implements OnInit {
  postId = signal<number>(0);
  name = signal('');
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
    }
  }

  onSubmit() {
    this.errorMessage.set('');

    if (!this.name() || !this.body()) {
      this.errorMessage.set('Name and comment are required');
      return;
    }

    this.commentService.addComment({
      postId: this.postId(),
      name: this.name(),
      email: this.name().toLowerCase().replace(/\s+/g, '.') + '@example.com', // Generate email from name
      body: this.body()
    });

    this.router.navigate(['/posts', this.postId()]);
  }

}
