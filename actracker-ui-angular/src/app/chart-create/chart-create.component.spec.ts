import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCreateComponent } from './chart-create.component';

describe('ChartCreateComponent', () => {
  let component: ChartCreateComponent;
  let fixture: ComponentFixture<ChartCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
