import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalConfig} from "./modal.config";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void { }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    })
  }

  async close(): Promise<void> {
    if (this.modalConfig.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig.onClose === undefined || (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
  }

  async confirm(): Promise<void> {
    if (this.modalConfig.shouldConfirm === undefined || (await this.modalConfig.shouldConfirm())) {
      const result = this.modalConfig.onConfirm === undefined || (await this.modalConfig.onConfirm());
      this.modalRef.dismiss(result);
    }
  }
}
