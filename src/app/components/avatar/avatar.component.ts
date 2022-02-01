import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {PhotoService} from "../../services/photo.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input()
  user: User;

  @Input()
  size: string;

  constructor(public photoService: PhotoService) { }

  public static XL: string = 'xl';
  public static LARGE: string = 'lg';
  public static THUMBNAIL: string = 'tb';
  public static THUMBNAIL_MINI: string = 'tbm';

  ngOnInit(): void {
  }

  getAvatar(): string {
    if (!this.user || !this.user.profilePhotoId) {
      return this.photoService.getDefaultAvatar();
    }
    if (this.size == AvatarComponent.THUMBNAIL) {
      return this.photoService.getPhotoThumbnail(this.user.profilePhotoId);
    }
    if (this.size == AvatarComponent.THUMBNAIL_MINI) {
      return this.photoService.getPhotoThumbnailMini(this.user.profilePhotoId);
    }
    return this.photoService.getPhoto(this.user.profilePhotoId);
  }

  getSizeClass(): string {
    if (this.size == AvatarComponent.THUMBNAIL) {
      return 'avatar';
    }
    if (this.size == AvatarComponent.THUMBNAIL_MINI) {
      return 'avatar-sm';
    }
    if (this.size == AvatarComponent.LARGE) {
      return 'avatar-lg';
    }
    return 'avatar-xl';
  }
}
