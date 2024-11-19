import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComisssionComponent } from './set-comisssion.component';

describe('SetComisssionComponent', () => {
  let component: SetComisssionComponent;
  let fixture: ComponentFixture<SetComisssionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetComisssionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetComisssionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
