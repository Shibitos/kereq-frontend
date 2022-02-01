import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {CropperPosition, ImageCroppedEvent} from "ngx-image-cropper";
import {UserService} from "../../services/user.service";
import {catchError, first, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {throwError} from "rxjs";

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
  loading: boolean = false;
  minSize: number = 200;
  changedSinceLastFail: boolean = false;
  error?: string;

  constructor(private modalService: NgbModal, private userService: UserService, private authService: AuthService) { }

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
    this.loading = true;
    this.userService.uploadProfileImage(this.selectedFile, this.size, this.croppedPosition.x1, this.croppedPosition.y1).pipe(takeUntil(this.unsubscribe$), catchError((errorData) => {
      this.error = errorData['error']['message'] ? errorData['error']['message'] : $localize`:@@common.unknown-error:Unknown error`;
      this.changedSinceLastFail = false;
      this.loading = false;
      return throwError(errorData);
    })).subscribe((ev: any) => {
      this.authService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
        this.authService.refreshUser(user);
        this.loading = false;
        this.close();
      });
    })
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.changedSinceLastFail = true;
    this.selectedFile = event.target.files[0];
    this.closeError();
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
    this.error = $localize`:@@common.invalid-image:Not valid image file`;
    this.changedSinceLastFail = false;
  }

  closeError() {
    this.error = undefined;
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
