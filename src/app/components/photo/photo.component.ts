import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {PhotoService} from "../../services/photo.service";
import {AvatarComponent} from "../avatar/avatar.component";
import {Photo} from "../../models/photo.model";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input()
  photo: Photo;

  @Input()
  size: string;

  constructor(public photoService: PhotoService) { }

  public static XL: string = 'xl';
  public static LARGE: string = 'lg';
  public static THUMBNAIL: string = 'tb';

  ngOnInit(): void {
  }

  getPhoto(): string {
    if (this.size == PhotoComponent.THUMBNAIL) {
      return this.photoService.getPhotoThumbnail(this.photo.photoId);
    }
    return this.photoService.getPhoto(this.photo.photoId);
  }

  getSizeClass(): string {
    if (this.size == PhotoComponent.THUMBNAIL) {
      return 'photo-sm';
    }
    if (this.size == PhotoComponent.LARGE) {
      return 'photo-lg';
    }
    return 'photo';
  }
}
