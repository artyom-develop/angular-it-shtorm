import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCategoryItem } from './filter-category-item';

describe('FilterCategoryItem', () => {
  let component: FilterCategoryItem;
  let fixture: ComponentFixture<FilterCategoryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterCategoryItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterCategoryItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
