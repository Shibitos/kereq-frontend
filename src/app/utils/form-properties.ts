import {FormGroup} from "@angular/forms";
import {HttpStatusCode} from "@angular/common/http";
import {ApiError} from "../models/api-error";
import {v4 as uuidv4} from 'uuid';

export class FormProperties {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  success: boolean = false;
  errors: ApiError[] = [];

  onSubmit() : boolean {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return false;
    }
    this.loading = true;
    return true;
  }

  onFinish() {
    this.success = true;
    this.loading = false;
    this.reset();
  }

  onError(errorData: any) {
    this.loading = false;
    this.handleError(errorData);
  }

  reset() {
    this.form.reset();
    this.submitted = false;
  }

  closeError(id: string) {
    this.errors.splice(this.errors.findIndex((value: ApiError) => value.id == id), 1);
  }

  handleError(errorData: any) : void {
    if (errorData.status == HttpStatusCode.BadRequest) {
      if (errorData.error['data']) {
        for (let entry in errorData.error['data']) {
          let field = errorData.error['data'][entry]['field'];
          let control = this.form.controls[field];
          if (control) {
            let customError = { customError: errorData.error['data'][entry]['messages'][0] };
            control.setErrors(customError); //TODO: refactor
          }
        }
      }
    } else {
      this.errors.push(new ApiError(uuidv4(), $localize`:@@common.unknown-error:Unknown error`));
    }
  }
}
