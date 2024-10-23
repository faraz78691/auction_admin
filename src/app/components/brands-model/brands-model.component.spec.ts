import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsModelComponent } from './brands-model.component';

describe('BrandsModelComponent', () => {
  let component: BrandsModelComponent;
  let fixture: ComponentFixture<BrandsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandsModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
