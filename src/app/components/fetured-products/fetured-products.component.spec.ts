import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeturedProductsComponent } from './fetured-products.component';

describe('FeturedProductsComponent', () => {
  let component: FeturedProductsComponent;
  let fixture: ComponentFixture<FeturedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeturedProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeturedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
