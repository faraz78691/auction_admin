import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostedOffersComponent } from './boosted-offers.component';

describe('BoostedOffersComponent', () => {
  let component: BoostedOffersComponent;
  let fixture: ComponentFixture<BoostedOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostedOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoostedOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
