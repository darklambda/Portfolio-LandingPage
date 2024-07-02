import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCVComponent } from './open-cv.component';

describe('OpenCVComponent', () => {
  let component: OpenCVComponent;
  let fixture: ComponentFixture<OpenCVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenCVComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
