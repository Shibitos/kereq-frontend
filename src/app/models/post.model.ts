import {User} from "./user.model";
import {Comment} from "./comment.model";
import {PostStatistics} from "./post-statistics.model";

export class Post {
  id?: number;
  user: User;
  createdAt: Date;
  content: string;
  comments: Comment[] = [];
  statistics: PostStatistics;
}
