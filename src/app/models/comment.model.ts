import {User} from "./user.model";
import {CommentStatistics} from "./comment-statistics.model";

export class Comment {
  id?: number;
  user: User;
  createdAt: Date;
  content: string;
  statistics: CommentStatistics;
}
