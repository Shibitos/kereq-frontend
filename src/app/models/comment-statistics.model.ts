import {LikeType} from "../enums/like-type.enum";

export class CommentStatistics {
  commentId?: number;
  likesCount: number;
  dislikesCount: number;
  userLikeType?: LikeType;
}
