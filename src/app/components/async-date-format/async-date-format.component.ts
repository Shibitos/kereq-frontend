import {Component, Input, OnInit} from '@angular/core';
import {takeUntil, Observable, Subject} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-async-date-format',
  templateUrl: './async-date-format.component.html',
  styleUrls: ['./async-date-format.component.scss']
})
export class AsyncDateFormatComponent implements OnInit {
  dateObservable$: Observable<string>;
  unsubscribe$: Subject<void> = new Subject<void>();
  dateFormatted: string;

  @Input()
  date: Date;

  ngOnInit() {
    this.dateObservable$ = Observable.create((observer: any) => {
      const JUST_NOW_TIME = 5 * 60 * 1000; //TODO: move
      const formattedDate = formatDate(this.date, 'dd/MM/yyyy HH:mm:ss', 'en_US');
      const now = new Date();
      const wrappedDate = new Date(this.date);
      console.log(+now - +wrappedDate);
      if ((+now - +wrappedDate) > JUST_NOW_TIME) {
        observer.next(formattedDate);
        return;
      }
      observer.next($localize`:@@common.just-now:just now`);
      const interval = setInterval(() => {
        observer.next(formattedDate);
      }, JUST_NOW_TIME);

      return () => clearInterval(interval);
    });

    this.dateObservable$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: string) => this.dateFormatted = value);
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
