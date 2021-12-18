import {User} from "./user.model";
import {Comment} from "./comment.model";

export class Post {
  id?: number;
  user: User;
  createdAt: Date;
  content: string;
  comments: Comment[] = [];
  commentsCount: number;
}
