import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Page} from "../../utils/page";
import {Friendship} from "../../models/friendship.model";
import {Perspective} from "../../enums/perspective.enum";
import {Post} from "../../models/post.model";
import {PageUtil} from "../../utils/page.util";
import {PostService} from "../../services/post.service";
import {BehaviorSubject, Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {PhotoService} from "../../services/photo.service";
import {Photo} from "../../models/photo.model";
import {UserCacheService} from "../../services/user-cache.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  unsubscribe$: Subject<void> = new Subject<void>();

  user: User;
  userLoaded: boolean = false;
  friendsList: Friendship[] = [];
  friendsLoaded: boolean = false;
  perspective: Perspective;

  browsePostsList: Post[] = [];
  browsePostsPageTool: PageUtil<Post>;

  photosList: Photo[] = [];
  photosLoaded: boolean = false;

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private postService: PostService,
              private activatedRoute: ActivatedRoute,
              public photoService: PhotoService,
              private userCacheService: UserCacheService) {
  }

  ngOnInit(): void {
    this.currentUserSubject.pipe(
      filter((user: any) => user.id),
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User) => {
      this.user = user;
      this.authService.currentUser.pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
        if (this.user.id == user.id) this.perspective = Perspective.OWNER;
          this.loadFull();
          this.userLoaded = true;
      });
    });
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.clear();
      if (params['id']) {
        this.userService.getUser(params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
          this.currentUserSubject.next(user);
          this.userCacheService.addUser(user);
        });
      } else {
        this.authService.currentUser.pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
          this.router.navigate(['/profile/' + user.id]);
        });
      }
    });
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.destroyPageTool();
  }

  destroyPageTool() {
    if (this.browsePostsPageTool) {
      this.browsePostsPageTool.destroy();
    }
  }

  loadFull(): void {
    this.userService.getFriends(new Page(8), this.user.id).pipe(takeUntil(this.unsubscribe$)).subscribe(a => {
        this.friendsList = [];
        this.friendsList.push(...a.content);
        this.friendsLoaded = true;
      },
      () => {
        this.friendsLoaded = true;
      });
    this.userService.getPhotos(new Page(8), this.user.id).pipe(takeUntil(this.unsubscribe$)).subscribe(a => {
        this.photosList = [];
        this.photosList.push(...a.content);
        this.photosLoaded = true;
      },
      () => {
        this.photosLoaded = true;
      });
    this.destroyPageTool();
    this.browsePostsPageTool = new PageUtil<Post>(this.postService.getUserPosts.bind(this.postService), this.browsePostsList, 6, this.user.id);
  }

  clear(): void {
    this.perspective = Perspective.OTHER_USER;
    this.userLoaded = false;
    this.friendsList = [];
    this.friendsLoaded = false;
    if (this.browsePostsPageTool) {
      this.browsePostsPageTool.reset();
    }
  }

  isOwner(): boolean {
    return this.perspective == Perspective.OWNER;
  }
}
