import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {formatDate} from "@angular/common";
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-async-date-format',
  templateUrl: './async-date-format.component.html',
  styleUrls: ['./async-date-format.component.scss']
})
export class AsyncDateFormatComponent implements OnInit {
  dateObservable$: Observable<string>;
  unsubscribe$: Subject<void> = new Subject<void>();
  dateFormatted: string;
  interval: Timeout;

  @Input()
  date: Date;

  @Input()
  justNowTime: number = 5 * 60 * 1000;

  @Input()
  dateFormat: string = 'dd/MM/yyyy HH:mm:ss';

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  ngOnDestroy(){
    this.destroy();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  init() {
    this.dateObservable$ = Observable.create((observer: any) => {
      const formattedDate = formatDate(this.date, this.dateFormat, this.locale);
      const now = new Date();
      const wrappedDate = new Date(this.date);
      if ((+now - +wrappedDate) > this.justNowTime) {
        observer.next(formattedDate);
        return;
      }
      observer.next($localize`:@@common.just-now:just now`);
      this.interval = setInterval(() => {
        observer.next(formattedDate);
      }, this.justNowTime);

      return () => clearInterval(this.interval);
    });

    this.dateObservable$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: string) => this.dateFormatted = value);
  }

  destroy() {
    clearInterval(this.interval);
    this.unsubscribe$.next();
  }
}
