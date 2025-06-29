import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarIframeComponent } from './calendar-iframe.component';

describe('CalendarIframeComponent', () => {
  let component: CalendarIframeComponent;
  let fixture: ComponentFixture<CalendarIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarIframeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
