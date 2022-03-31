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
    return this.http.post(environment.backendUrl + this.postsUrl, post);
  }

  modifyPost(post: Post): Observable<any> {
    return this.http.put(environment.backendUrl + this.postsUrl + post.id, post);
  }

  removePost(postId: number): Observable<any> {
    return this.http.delete(environment.backendUrl + this.postsUrl + postId);
  }

  browsePosts(page: Page): Observable<any> {
    return this.http.get<Post>(environment.backendUrl + this.postsUrl + 'browse?' + page.generateQueryParams());
  }

  getUserPosts(page: Page, userId?: number): Observable<any> {
    return this.http.get<Post>(environment.backendUrl + this.postsUrl + 'user/' + userId + '?' + page.generateQueryParams());
  }

  like(postId: number): Observable<any> {
    return this.http.post(environment.backendUrl + this.postsUrl + postId + '/like', null);
  }

  removeLike(postId: number): Observable<any> {
    return this.http.delete(environment.backendUrl + this.postsUrl + postId + '/like');
  }

  dislike(postId: number): Observable<any> {
    return this.http.post(environment.backendUrl + this.postsUrl + postId + '/dislike', null);
  }

  removeDislike(postId: number): Observable<any> {
    return this.http.delete(environment.backendUrl + this.postsUrl + postId + '/dislike');
  }
}
