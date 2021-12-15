import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncDateFormatComponent } from './async-date-format.component';

describe('AsyncDateFormatPipeComponent', () => {
  let component: AsyncDateFormatComponent;
  let fixture: ComponentFixture<AsyncDateFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsyncDateFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncDateFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
