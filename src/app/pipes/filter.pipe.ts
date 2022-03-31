import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  public transform(value: any, filterFunc: any, term: string) {
    if (typeof filterFunc === 'function' && term) {
      return filterFunc(value, term);
    }
    return value;
  }
}
