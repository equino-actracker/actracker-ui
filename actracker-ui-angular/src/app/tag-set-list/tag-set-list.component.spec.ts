import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSetListComponent } from './tag-set-list.component';

describe('TagSetListComponent', () => {
  let component: TagSetListComponent;
  let fixture: ComponentFixture<TagSetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagSetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
