import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PageUtil} from "../../utils/page.util";
import {CommentService} from "../../services/comment.service";
import {FormProperties} from "../../utils/form-properties";
import {FormBuilder, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {first, takeUntil} from "rxjs/operators";
import {Comment} from "../../models/comment.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  post: Post;

  commentsList: Comment[] = [];
  commentsPageTool: PageUtil<Comment>;

  commentForm: FormProperties = new FormProperties();

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService) { }

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
}
