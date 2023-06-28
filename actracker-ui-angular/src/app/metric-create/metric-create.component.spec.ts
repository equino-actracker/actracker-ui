import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricCreateComponent } from './metric-create.component';

describe('MetricCreateComponent', () => {
  let component: MetricCreateComponent;
  let fixture: ComponentFixture<MetricCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
