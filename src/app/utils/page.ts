export class Page {
  pageNumber: number = 0;
  pageSize: number = 0;

  constructor(pageSize?: number) {
    if (pageSize) {
      this.pageSize = pageSize;
    }
  }

  generateQueryParams(): string {
    let params = 'p=' + this.pageNumber + '&l=' +  this.pageSize;
    return params;
  }
}
