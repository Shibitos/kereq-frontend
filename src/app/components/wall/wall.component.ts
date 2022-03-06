import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {PageUtil} from "../../utils/page.util";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {first, takeUntil} from "rxjs/operators";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/post.model";
import {Subject} from "rxjs";
import {FormProperties} from "../../utils/form-properties";

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})
export class WallComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  loggedUser: User;

  browsePostsList: Post[] = [];
  browsePostsPageTool: PageUtil<Post>;

  postForm: FormProperties = new FormProperties();

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private postService: PostService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
    this.postForm.form = this.formBuilder.group({
        content: ['', [
          Validators.minLength(15),
          Validators.maxLength(1000)
        ]]
      });
    this.browsePostsPageTool = new PageUtil<Post>(this.postService.browsePosts.bind(this.postService), this.browsePostsList, 6);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.browsePostsPageTool) this.browsePostsPageTool.destroy();
  }

  hide(index: number): void {
    this.browsePostsList.splice(index, 1); //TODO: hide on backend?
  }

  get f() {
    return this.postForm.form.controls;
  }

  onSubmit() {
    if (this.postForm.onSubmit()) {
      this.addPost();
    }
  }

  addPost() {
    this.postService.addPost(this.postForm.form.value).pipe(takeUntil(this.unsubscribe$), first())
      .subscribe(
        (post: Post) => {
          this.postForm.onFinish();
          this.browsePostsList.unshift(post);
        },
        errorData => {
          this.postForm.handleError(errorData);
        });
  }
}
