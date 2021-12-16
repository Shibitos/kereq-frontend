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

  any: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  switch(): void {
    this.any = !this.any;
    if (this.any) {
      this.control.setValue(null);
    } else {
      //TODO: ?
    }
  }

  onChange(selectedValues: number[]): void {
    if (!this.any) {
      this.control.setValue(selectedValues[0]);
    }
  }
}
