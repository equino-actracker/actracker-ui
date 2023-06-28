import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCreateComponent } from './share-create.component';

describe('ShareCreateComponent', () => {
  let component: ShareCreateComponent;
  let fixture: ComponentFixture<ShareCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
