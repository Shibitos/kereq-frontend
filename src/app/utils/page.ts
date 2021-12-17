export class Page {
  pageNumber: number = 0;
  pageSize: number = 0;
  initialSize: number = 0;
  initialized: boolean = false;

  constructor(pageSize?: number) {
    if (pageSize) {
      this.pageSize = pageSize;
    }
  }

  generateQueryParams(): string {
    let params = 'p=' + this.pageNumber;
    params += '&l=' + (!this.initialized && this.initialSize > 0 ? this.initialSize : this.pageSize);
    return params;
  }
}
