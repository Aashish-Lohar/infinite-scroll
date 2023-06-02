import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageList2Component } from './image-list2.component';

describe('ImageList2Component', () => {
  let component: ImageList2Component;
  let fixture: ComponentFixture<ImageList2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageList2Component]
    });
    fixture = TestBed.createComponent(ImageList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
