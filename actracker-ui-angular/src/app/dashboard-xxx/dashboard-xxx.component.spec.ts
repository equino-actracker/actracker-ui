import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardXXXComponent } from './dashboard-xxx.component';

describe('DashboardXXXComponent', () => {
  let component: DashboardXXXComponent;
  let fixture: ComponentFixture<DashboardXXXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardXXXComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardXXXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
