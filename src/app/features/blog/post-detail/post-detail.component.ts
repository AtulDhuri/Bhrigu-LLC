import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { PostService } from '../../../core/services/post.service';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Comment } from '../../../core/models';
import { HlmCardComponent, HlmCardContentComponent } from '../../../shared/ui/card.component';
import { HlmButtonDirective } from '../../../shared/ui/button.directive';

@Component({
    selector: 'app-post-detail',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink,
        HlmCardComponent,
        HlmCardContentComponent,
        HlmButtonDirective
    ],
    templateUrl: './post-detail.component.html',
    styleUrl: './post-detail.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDetailComponent {
    private route = inject(ActivatedRoute);
    private postService = inject(PostService);
    private commentService = inject(CommentService);
    authService = inject(AuthService);

    post = toSignal(
        this.route.params.pipe(
            switchMap(params => this.postService.getPostById(Number(params['id'])))
        )
    );

    comments = toSignal(
        this.route.params.pipe(
            switchMap(params => this.commentService.getCommentsByPostId(Number(params['id'])))
        ),
        { initialValue: [] as Comment[] }
    );

    trackByCommentId(_index: number, comment: Comment): number {
        return comment.id;
    }
}
