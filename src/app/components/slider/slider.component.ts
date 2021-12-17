import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input()
  control: AbstractControl;

  @Input()
  min: number;

  @Input()
  max: number;

  @Input()
  switchable: boolean = true;

  any: boolean = false;
  lastValue: number;

  constructor() { }

  ngOnInit(): void {
  }

  switch(): void {
    this.any = !this.any;
    if (this.any) {
      this.control.setValue(null);
    } else {
      this.control.setValue(this.lastValue);
    }
  }

  onChange(selectedValues: number[]): void {
    this.lastValue = selectedValues[0];
    if (!this.any) {
      this.control.setValue(this.lastValue);
    }
  }
}
