import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLabel } from './filter-label';

describe('FilterLabel', () => {
  let component: FilterLabel;
  let fixture: ComponentFixture<FilterLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterLabel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
