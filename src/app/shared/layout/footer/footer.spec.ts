import { Location, ViewportScroller } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Footer } from './footer';

class MockActivatedRoute {
  snapshot = {
    params: {},
    queryParams: {},
    fragment: null,
  };
  queryParams = {};
  params = [];
}

class MockViewportScroller {
  scrollToAnchor = vi.fn();
}

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let location: Location;
  let router: Router;
  let mockViewportScroller: MockViewportScroller;

  beforeEach(async () => {
    mockViewportScroller = new MockViewportScroller();
    await TestBed.configureTestingModule({
      imports: [
        Footer,
        RouterTestingModule.withRoutes([
          { path: 'blog', component: Footer },
          { path: '', component: Footer },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new MockActivatedRoute(),
        },
        { provide: ViewportScroller, useValue: mockViewportScroller },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create footer', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.date).toBe(currentYear);
  });

  it('should change url on routerLink click', async () => {
    const link = fixture.nativeElement.querySelector(
      'a[routerLink="/blog"]'
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();

    // Симулируем клик
    link.click();

    // Ждем навигации
    await fixture.whenStable();

    expect(location.path()).toBe('/blog');
  });

  it('should navigate with fragment on click', async () => {
    const offersLink = fixture.nativeElement.querySelector(
      '#offers-link'
    ) as HTMLAnchorElement;
    expect(offersLink).toBeTruthy();

    offersLink.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/#offers');
  });
});
