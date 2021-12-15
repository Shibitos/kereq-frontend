import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {PageUtil} from "../../utils/page.util";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {first} from "rxjs/operators";
import {HttpStatusCode} from "@angular/common/http";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})
export class WallComponent implements OnInit {

  loggedUser: User;

  browsePostsList: Post[] = [];
  browsePostsPageTool: PageUtil<Post>;

  postForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  success: boolean = false;
  error: string; //TODO: ng bootstrap alerts?

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private postService: PostService,
              private userService: UserService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
        content: ['', [
          Validators.minLength(15),
          Validators.maxLength(1000)
        ]]
      });
    this.browsePostsPageTool = new PageUtil<Post>(this.postService.browsePosts.bind(this.postService), this.browsePostsList);
  }

  hide(index: number): void {
    this.browsePostsList.splice(index, 1); //TODO: hide on backend?
  }

  get f() {
    return this.postForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.postForm.markAllAsTouched();
    if (this.postForm.invalid) {
      return;
    }
    this.loading = true;
    this.addPost();
  }

  onReset(): void {
    this.submitted = false;
    this.postForm.reset();
  }

  addPost() {
    this.postService.addPost(this.postForm.value).pipe(first())
      .subscribe(
        (post: Post) => {
          this.success = true;
          this.loading = false;
          this.onReset();
          this.browsePostsList.unshift(post);
        },
        errorData => {
          this.loading = false;
          this.handleError(errorData);
        });
  }

  handleError(errorData: any) : void {
    if (errorData.status == HttpStatusCode.BadRequest) {
      if (errorData.error['data']) {
        for (let entry in errorData.error['data']) {
          let field = errorData.error['data'][entry]['field'];
          let control = this.postForm.controls[field];
          if (control) {
            let customError = { customError: errorData.error['data'][entry]['messages'][0] };
            control.setErrors(customError); //TODO: refactor
          }
        }
      }
    } else {
      this.error = $localize`:@@common.unknown-error:Unknown error`;
    }
  }
}
