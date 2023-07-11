import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricValueListComponent } from './metric-value-list.component';

describe('MetricValueListComponent', () => {
  let component: MetricValueListComponent;
  let fixture: ComponentFixture<MetricValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricValueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
