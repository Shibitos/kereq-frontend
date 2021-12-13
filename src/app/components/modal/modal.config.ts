export class ModalConfig {
  modalTitle: string;
  confirmButtonLabel?: string;
  closeButtonLabel?: string;
  shouldClose?(): Promise<boolean> | boolean;
  shouldConfirm?(): Promise<boolean> | boolean;
  onClose?(): Promise<boolean> | boolean;
  onConfirm?(): Promise<boolean> | boolean | void;
  disableCloseButton?(): boolean;
  disableConfirmButton?(): boolean;
  hideCloseButton?(): boolean;
  hideConfirmButton?(): boolean;
}
