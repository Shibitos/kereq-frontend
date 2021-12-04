import {Observable} from "rxjs";
import {Page} from "./page";

export class PageTool<T> {
  loaded = false;
  throttle = 0;
  distance = 2;
  page: Page;
  stopLoading = false;

  constructor(private loadFunc: (p: Page) => Observable<any>, private container: T[], pageSize?: number) {
    this.page = new Page();
    if (pageSize !== undefined) {
      this.page.pageSize = pageSize;
    }
    this.init();
  }

  init() {
    this.loadFunc(this.page).subscribe(a => {
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
      this.loadFunc(this.page).subscribe(a => {
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
