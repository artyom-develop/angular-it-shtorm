import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Populars } from './populars';

describe('Populars', () => {
  let component: Populars;
  let fixture: ComponentFixture<Populars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Populars]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Populars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
