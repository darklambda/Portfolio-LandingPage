import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPCameraComponent } from './rp-camera.component';

describe('RPCameraComponent', () => {
  let component: RPCameraComponent;
  let fixture: ComponentFixture<RPCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RPCameraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RPCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
