import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RangePlaceholderComponent} from './range-placeholder.component';

describe('RangePlaceholderComponent', () => {
  let component: RangePlaceholderComponent;
  let fixture: ComponentFixture<RangePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangePlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
