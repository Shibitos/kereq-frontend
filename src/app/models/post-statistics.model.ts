import {LikeType} from "../enums/like-type.enum";

export class PostStatistics {
  postId: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  userLikeType?: LikeType;
}
