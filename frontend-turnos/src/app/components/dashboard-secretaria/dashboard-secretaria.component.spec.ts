import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSecretariaComponent } from './dashboard-secretaria.component';

describe('DashboardSecretariaComponent', () => {
  let component: DashboardSecretariaComponent;
  let fixture: ComponentFixture<DashboardSecretariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSecretariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSecretariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
