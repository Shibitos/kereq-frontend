export class Page {
  pageNumber = 0;
  pageSize = 0;

  constructor(pageSize?: number) {
    if (pageSize) {
      this.pageSize = pageSize;
    }
  }
}
