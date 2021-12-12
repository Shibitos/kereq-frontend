import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {DictionaryItem} from "../models/dictionary-item.model";

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  dictUrl: string = 'dictionaries/';

  constructor(private http: HttpClient) {}

  getDictionaryValues(code: string): Observable<DictionaryItem[]> {
    return this.http.get<DictionaryItem[]>(environment.baseUrl + this.dictUrl + code);
  }
}
