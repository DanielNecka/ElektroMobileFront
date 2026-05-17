import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOrder } from './active-order';

describe('ActiveOrder', () => {
  let component: ActiveOrder;
  let fixture: ComponentFixture<ActiveOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
