import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PageUtil} from "../../utils/page.util";
import {CommentService} from "../../services/comment.service";
import {FormProperties} from "../../utils/form-properties";
import {FormBuilder, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {first, takeUntil} from "rxjs/operators";
import {Comment} from "../../models/comment.model";
import {LikeType} from "../../enums/like-type.enum";
import {PostService} from "../../services/post.service";
import {PostStatistics} from "../../models/post-statistics.model";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {PhotoService} from "../../services/photo.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();
  loggedUser: User;

  @Input()
  post: Post;

  commentsList: Comment[] = [];
  commentsPageTool: PageUtil<Comment>;

  commentForm: FormProperties = new FormProperties();

  likeInProgress: boolean = false;
  likeTypes = LikeType;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private commentService: CommentService, private authService: AuthService, public photoService: PhotoService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
    this.commentForm.form = this.formBuilder.group({
      content: ['', [
        Validators.minLength(1),
        Validators.maxLength(1000)
      ]]
    });
    this.commentsList = this.post.comments;
    this.commentsPageTool = new PageUtil<Comment>(this.commentService.getPostComments.bind(this.commentService), this.commentsList, 8, this.post.id, true);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commentsPageTool.destroy();
  }

  get f() {
    return this.commentForm.form.controls;
  }

  onSubmit() {
    if (this.commentForm.onSubmit()) {
      this.addComment();
    }
  }

  scrollFocus(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus();
  }

  addComment() {
    this.commentService.addComment(<number>this.post.id, this.commentForm.form.value).pipe(takeUntil(this.unsubscribe$), first())
      .subscribe(
        (comment: Comment) => {
          this.commentForm.onFinish();
          this.commentsList.push(comment);
        },
        errorData => {
          this.commentForm.handleError(errorData);
        });
  }

  like() {
    if (this.likeInProgress) {
      return;
    }
    this.likeInProgress = true;
    if (this.post.statistics.userLikeType == <number>LikeType.LIKE) {
      this.postService.removeLike(<number>this.post.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (postStatistics: PostStatistics) => {
            this.post.statistics = postStatistics;
            this.post.statistics.userLikeType = undefined;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    } else {
      this.postService.like(<number>this.post.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (postStatistics: PostStatistics) => {
            this.post.statistics = postStatistics;
            this.post.statistics.userLikeType = LikeType.LIKE;
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
    if (this.post.statistics.userLikeType == <number>LikeType.DISLIKE) {
      this.postService.removeDislike(<number>this.post.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (postStatistics: PostStatistics) => {
            this.post.statistics = postStatistics;
            this.post.statistics.userLikeType = undefined;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    } else {
      this.postService.dislike(<number>this.post.id).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (postStatistics: PostStatistics) => {
            this.post.statistics = postStatistics;
            this.post.statistics.userLikeType = LikeType.DISLIKE;
            this.likeInProgress = false;
          },
          () => {
            this.likeInProgress = false;
          });
    }
  }
}
