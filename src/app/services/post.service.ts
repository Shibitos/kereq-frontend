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
export class PostService {

  postsUrl: string = 'posts/';

  constructor(private http: HttpClient, private router: Router) {
  }

  addPost(post: Post): Observable<any> {
    return this.http.post(environment.baseUrl + this.postsUrl + 'post', post);
  }

  modifyPost(post: Post): Observable<any> {
    return this.http.put(environment.baseUrl + this.postsUrl + 'post/' + post.id, post);
  }

  removePost(postId: number): Observable<any> {
    return this.http.delete(environment.baseUrl + this.postsUrl + 'post/' + postId);
  }

  browsePosts(page: Page): Observable<any> {
    return this.http.get<Post>(environment.baseUrl + this.postsUrl + 'browse?p=' + page.pageNumber);
  }

  getUserPosts(page: Page, userId?: number): Observable<any> {
    return this.http.get<Post>(environment.baseUrl + this.postsUrl + 'posts/' + userId + '?p=' + page.pageNumber);
  }
}
