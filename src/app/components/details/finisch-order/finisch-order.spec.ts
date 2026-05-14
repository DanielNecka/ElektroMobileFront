import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinischOrder } from './finisch-order';

describe('FinischOrder', () => {
  let component: FinischOrder;
  let fixture: ComponentFixture<FinischOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinischOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinischOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
