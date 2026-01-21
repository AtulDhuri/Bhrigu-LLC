# Blog and Photo Archive Web Application

## Overview
A full-featured Angular web application with authentication, blog viewing/commenting, and photo archive functionality using JSONPlaceholder API.

## Requirements

### Authentication System
- Signup page with fields: First name, Last name, Username, Password, Password confirmation
- Login page with username/password validation
- Local storage for credential persistence
- Navbar showing user initials when logged in
- Logout functionality with local storage cleanup
- Route guards for protected pages

### Blog Features
- Home page displaying 5 posts per page with pagination
- Post details page showing full post content
- Comments display on post details page
- Add comment functionality (protected by auth guard)
- Newly added comments appear first and persist during session
- Redirect to login if unauthenticated, then back to add-comment page
- Services for /posts and /comments API endpoints

### Photo Archive
- Album grid view showing all albums
- Album details page with photo grid
- Pagination for photos
- Services for /albums and /photos API endpoints

### UI/UX & Accessibility
- Responsive design (mobile-first, min 320px width)
- CSS Grid for photo layouts
- Dark mode toggle with local storage persistence
- Full keyboard navigation support
- Proper ARIA labels and semantic HTML
- WCAG 2.1 Level AA color contrast (4.5:1 normal, 3:1 large text)
- Loading states and skeleton screens

### Performance
- Initial load under 3 seconds
- Pagination/infinite scroll for posts
- TrackBy functions in all *ngFor loops
- OnPush change detection strategy where applicable
- Lazy loading for images
- Optimized bundle size

## Technical Design

### Architecture
```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── post.model.ts
│   │   │   ├── comment.model.ts
│   │   │   ├── album.model.ts
│   │   │   └── photo.model.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── post.service.ts
│   │       ├── comment.service.ts
│   │       ├── album.service.ts
│   │       ├── photo.service.ts
│   │       └── theme.service.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── blog/
│   │   │   ├── post-list/
│   │   │   ├── post-detail/
│   │   │   └── add-comment/
│   │   └── photos/
│   │       ├── album-list/
│   │       └── album-detail/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── pagination/
│   │   │   └── loading-skeleton/
│   │   └── pipes/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
```

### Services
1. **AuthService**: Handle signup, login, logout, user state
2. **PostService**: Fetch posts from API
3. **CommentService**: Fetch and manage comments (API + local)
4. **AlbumService**: Fetch albums
5. **PhotoService**: Fetch photos
6. **ThemeService**: Manage dark/light mode

### Routes
- `/` - Home (post list)
- `/login` - Login page
- `/signup` - Signup page
- `/posts/:id` - Post details
- `/posts/:id/add-comment` - Add comment (protected)
- `/albums` - Album list
- `/albums/:id` - Album photos

### State Management
- Local storage for: auth credentials, user session, new comments, theme preference
- Session-based comment persistence

## Implementation Tasks

### Phase 1: Core Setup
- [ ] Set up project structure (core, features, shared folders)
- [ ] Create models (User, Post, Comment, Album, Photo)
- [ ] Configure routing
- [ ] Set up base styles and CSS variables for theming

### Phase 2: Authentication
- [ ] Create AuthService with local storage integration
- [ ] Build signup component with validation
- [ ] Build login component
- [ ] Create auth guard
- [ ] Build navbar with user initials display
- [ ] Implement logout functionality

### Phase 3: Blog Features
- [ ] Create PostService and CommentService
- [ ] Build post-list component with pagination
- [ ] Build post-detail component
- [ ] Build add-comment component
- [ ] Implement comment persistence logic
- [ ] Add route guard to add-comment

### Phase 4: Photo Archive
- [ ] Create AlbumService and PhotoService
- [ ] Build album-list component with CSS Grid
- [ ] Build album-detail component with pagination
- [ ] Implement lazy loading for images

### Phase 5: UI/UX & Accessibility
- [ ] Implement responsive design (320px+)
- [ ] Create ThemeService and dark mode toggle
- [ ] Add keyboard navigation support
- [ ] Implement ARIA labels and semantic HTML
- [ ] Ensure color contrast compliance
- [ ] Create loading skeleton components

### Phase 6: Performance Optimization
- [ ] Add TrackBy functions to all *ngFor
- [ ] Implement OnPush change detection
- [ ] Optimize image loading
- [ ] Review and optimize bundle size
- [ ] Test performance metrics

## API Endpoints
- Posts: https://jsonplaceholder.typicode.com/posts
- Comments: https://jsonplaceholder.typicode.com/comments
- Albums: https://jsonplaceholder.typicode.com/albums
- Photos: https://jsonplaceholder.typicode.com/photos

## Notes
- JSONPlaceholder API doesn't actually save data, so POST requests return mock responses
- New comments will be stored locally and merged with API comments
- Theme preference persists across sessions via local storage
