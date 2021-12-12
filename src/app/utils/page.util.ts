import {Observable} from "rxjs";
import {Page} from "./page";

export class PageUtil<T> {
  loaded = false;
  throttle = 0;
  distance = 2;
  page: Page;
  param?: number;
  stopLoading = false;

  constructor(private loadFunc: (p: Page, param?: number) => Observable<any>, private container: T[], param?: number, pageSize?: number) { //TODO: hide func there? load more button not hiding after hiding all
    this.page = new Page();
    if (pageSize) {
      this.page.pageSize = pageSize;
    }
    if (param) {
      this.param = param;
    }
    this.init();
  }

  init() {
    this.loadFunc(this.page, this.param).subscribe(a => {
      if (!a.empty) {
        this.container.push(...a.content);
        if (a.totalPages <= (this.page.pageNumber + 1)) {
          this.stopLoading = true;
        }
      } else {
        this.stopLoading = true;
      }
      this.loaded = true;
    });
  }

  loadMore(): void {
    if (!this.stopLoading) {
      this.page.pageNumber += 1;
      this.loadFunc(this.page, this.param).subscribe(a => {
        if (a.empty) {
          this.stopLoading = true;
        } else {
          this.container.push(...a.content);
          if (a.totalPages <= (this.page.pageNumber + 1)) {
            this.stopLoading = true;
          }
        }
      });
    }
  }
}
