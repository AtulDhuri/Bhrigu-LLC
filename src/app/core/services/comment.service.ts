import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Comment } from '../models';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseApiService<Comment> {
  private readonly LOCAL_COMMENTS_KEY = 'blog_local_comments';

  constructor() {
    super(getApiUrl(API_CONFIG.ENDPOINTS.COMMENTS));
  }

  // Inherited methods from BaseApiService:
  // - getAll(): Observable<Comment[]>
  // - getById(id: number): Observable<Comment>
  // - getByQuery(params): Observable<Comment[]>

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.getByQuery({ postId }).pipe(
      map(apiComments => {
        const localComments = this.getLocalComments(postId);
        return [...localComments, ...apiComments];
      })
    );
  }

  addComment(comment: Omit<Comment, 'id'>): Comment {
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
      isLocal: true,
      timestamp: Date.now()
    };

    const allLocalComments = this.getAllLocalComments();
    allLocalComments.push(newComment);
    localStorage.setItem(this.LOCAL_COMMENTS_KEY, JSON.stringify(allLocalComments));

    return newComment;
  }

  clearLocalComments(): void {
    localStorage.removeItem(this.LOCAL_COMMENTS_KEY);
  }

  private getLocalComments(postId: number): Comment[] {
    const allComments = this.getAllLocalComments();
    return allComments.filter(c => c.postId === postId);
  }

  private getAllLocalComments(): Comment[] {
    const commentsJson = localStorage.getItem(this.LOCAL_COMMENTS_KEY);
    return commentsJson ? JSON.parse(commentsJson) : [];
  }
}
