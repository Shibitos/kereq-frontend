import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Page} from "../utils/page";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  postsUrl: string = 'posts/';
  commentsUrl: string = '/comments';

  constructor(private http: HttpClient, private router: Router) {
  }

  addComment(postId: number, comment: Comment): Observable<any> {
    return this.http.post(environment.baseUrl + this.postsUrl + postId + this.commentsUrl, comment);
  }

  modifyPost(postId: number, comment: Comment): Observable<any> {
    return this.http.put(environment.baseUrl + this.postsUrl + postId + this.commentsUrl, comment);
  }

  removePost(postId: number, commentId: number): Observable<any> {
    return this.http.delete(environment.baseUrl + this.postsUrl + postId + this.commentsUrl);
  }

  getPostComments(page: Page, postId?: number): Observable<any> {
    return this.http.get<Post>(environment.baseUrl + this.postsUrl + postId + this.commentsUrl + '?' + page.generateQueryParams());
  }
}