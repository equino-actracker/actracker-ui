import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSetComponent } from './tag-set.component';

describe('TagSetComponent', () => {
  let component: TagSetComponent;
  let fixture: ComponentFixture<TagSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
