import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSetCreateComponent } from './tag-set-create.component';

describe('TagSetCreateComponent', () => {
  let component: TagSetCreateComponent;
  let fixture: ComponentFixture<TagSetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagSetCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
