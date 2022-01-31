import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {CropperPosition, ImageCroppedEvent} from "ngx-image-cropper";
import {UserService} from "../../services/user.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-edit-profile-image',
  templateUrl: './edit-profile-image.component.html',
  styleUrls: ['./edit-profile-image.component.scss']
})
export class EditProfileImageComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild('modal')
  private modalContent: TemplateRef<EditProfileImageComponent>;

  private modalRef: NgbModalRef;

  private croppedPosition: CropperPosition;
  private size: number;
  selectedFile: File;
  minSize: number = 200;

  constructor(private modalService: NgbModal, private userService: UserService) { }

  ngOnInit(): void { }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent,  { size: 'xl', backdrop: 'static' });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    this.modalRef.close();
  }

  async confirm(): Promise<void> {
    this.modalRef.dismiss();
  }

  upload() {
    this.userService.uploadProfileImage(this.selectedFile, this.size, this.croppedPosition.x1, this.croppedPosition.y1).pipe(takeUntil(this.unsubscribe$)).subscribe((ev: any) => {
      this.close();
    })
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.selectedFile = event.target.files[0];
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedPosition = event.imagePosition;
    this.size = event.width;
  }
  imageLoaded() {
    /* show cropper */
  }
  cropperReady() {
    /* cropper ready */
  }
  loadImageFailed() {
    /* show message */
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
