import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../../models/comment.model";
import {LikeType} from "../../enums/like-type.enum";
import {CommentService} from "../../services/comment.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CommentStatistics} from "../../models/comment-statistics.model";
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  post: Post;

  @Input()
  comment: Comment;

  likeInProgress: boolean = false;
  likeTypes = LikeType;

  constructor(
    private commentService: CommentService) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  like() {
    if (this.likeInProgress) {
      return;
    }
    this.likeInProgress = true;
    if (this.comment.statistics.userLikeType == <number>LikeType.LIKE) {
      this.commentService.removeLike(<number>this.post.id, <number>this.comment.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (commentStatistics: CommentStatistics) => {
            this.comment.statistics = commentStatistics;
            this.comment.statistics.userLikeType = undefined;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    } else {
      this.commentService.like(<number>this.post.id, <number>this.comment.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (commentStatistics: CommentStatistics) => {
            this.comment.statistics = commentStatistics;
            this.comment.statistics.userLikeType = LikeType.LIKE;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    }
  }

  dislike() {
    if (this.likeInProgress) {
      return;
    }
    this.likeInProgress = true;
    if (this.comment.statistics.userLikeType == <number>LikeType.DISLIKE) {
      this.commentService.removeDislike(<number>this.post.id, <number>this.comment.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (commentStatistics: CommentStatistics) => {
            this.comment.statistics = commentStatistics;
            this.comment.statistics.userLikeType = undefined;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    } else {
      this.commentService.dislike(<number>this.post.id, <number>this.comment.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (commentStatistics: CommentStatistics) => {
            this.comment.statistics = commentStatistics;
            this.comment.statistics.userLikeType = LikeType.DISLIKE;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    }
  }
}
