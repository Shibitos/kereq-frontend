import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PageUtil} from "../../utils/page.util";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input()
  post: Post;

  commentsList: Comment[] = [];
  commentsPageTool: PageUtil<Comment>;

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.commentsPageTool = new PageUtil<Comment>(this.commentService.getPostComments.bind(this.commentService), this.commentsList, 8, this.post.id, 3);
  }

  ngOnDestroy(): void {
    this.commentsPageTool.destroy();
  }
}
