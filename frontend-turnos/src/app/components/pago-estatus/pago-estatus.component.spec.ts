import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoEstatusComponent } from './pago-estatus.component';

describe('PagoEstatusComponent', () => {
  let component: PagoEstatusComponent;
  let fixture: ComponentFixture<PagoEstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoEstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
