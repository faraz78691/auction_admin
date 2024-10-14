import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSupportComponent } from './custom-support.component';

describe('CustomSupportComponent', () => {
  let component: CustomSupportComponent;
  let fixture: ComponentFixture<CustomSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
