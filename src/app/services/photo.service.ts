import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  imagesUrl: string = 'image/';

  getDefaultAvatar() {
    return 'assets/img/default-avatar.png';
  }

  getPhoto(photoId: string) {
    return environment.backendUrl + this.imagesUrl + 'og/' + photoId;
  }

  getPhotoThumbnail(photoId: string) {
    return environment.backendUrl + this.imagesUrl + 'tb/' + photoId;
  }

  getPhotoThumbnailMini(photoId: string) {
    return environment.backendUrl + this.imagesUrl + 'tbm/' + photoId;
  }
}
