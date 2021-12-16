import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-range-placeholder',
  templateUrl: './range-placeholder.component.html',
  styleUrls: ['./range-placeholder.component.scss']
})
export class RangePlaceholderComponent implements OnInit {

  @Input()
  placeholder: string;

  @Input()
  minValue: number;

  @Input()
  maxValue: number;

  constructor() { }

  ngOnInit(): void {
  }
}
