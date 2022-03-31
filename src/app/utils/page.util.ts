import {Observable, Subject} from "rxjs";
import {Page} from "./page";
import {takeUntil} from "rxjs/operators";

export class PageUtil<T> {

  unsubscribe$: Subject<void> = new Subject<void>();

  loaded = false;
  throttle = 0;
  distance = 2;
  page: Page;
  param?: number;
  stopLoading = false;
  loading = false;

  constructor(private loadFunc: (p: Page, param?: number) => Observable<any>, private container: T[], pageSize: number, param?: number, lazyInit?: boolean, private onLoadEventCallback?: (arg0?: any) => void) { //TODO: hide func there? load more button not hiding after hiding all
    this.page = new Page();
    this.page.pageSize = pageSize;
    if (param) {
      this.param = param;
    }
    if (!lazyInit) {
      this.init();
    }
  }

  init() {
    this.container.length = 0;
    this.loading = true;
    this.loadFunc(this.page, this.param).pipe(takeUntil(this.unsubscribe$)).subscribe(a => {
      if (!a.empty) {
        this.container.push(...a.content);
        if (a.totalPages <= (this.page.pageNumber + 1)) {
          this.stopLoading = true;
        }
      } else {
        this.stopLoading = true;
      }
      this.loaded = true;
      this.loading = false;
      if (this.onLoadEventCallback) {
        this.onLoadEventCallback(!a.empty ? a.content : undefined);
      }
    }, (err: any) => {
      this.loading = false;
    });
  }

  destroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  reset() {
    this.loaded = false;
    this.loading = false;
    this.container.length = 0;
    this.page.pageNumber = 0;
    this.stopLoading = false;
  }

  loadMore(): void { //TODO: think about duplicates
    if (!this.loaded) {
      this.init();
      return;
    }
    if (!this.stopLoading) {
      this.page.pageNumber += 1;
      this.loading = true;
      this.loadFunc(this.page, this.param).pipe(takeUntil(this.unsubscribe$)).subscribe(a => {
        if (a.empty) {
          this.stopLoading = true;
        } else {
          this.container.push(...a.content);
          if (a.totalPages <= (this.page.pageNumber + 1)) {
            this.stopLoading = true;
          }
        }
        this.loading = false;
        if (this.onLoadEventCallback) {
          this.onLoadEventCallback(!a.empty ? a.content : undefined);
        }
      }, (err: any) => {
        this.loading = false;
      });
    }
  }
}
