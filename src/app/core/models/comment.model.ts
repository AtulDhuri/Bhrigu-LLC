export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
  isLocal?: boolean;
  timestamp?: number;
}
