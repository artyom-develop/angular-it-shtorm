import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth';
import { ToastService } from '../../services/toast';
import { UserService } from '../../services/user';
import { Header } from './header';

// Создаем тестовый компонент без routerLinkActive для упрощения тестов
@Component({
  selector: 'app-header',
  template: `
    <div>
      <button (click)="toggleMenu()">Menu</button>
      <button (click)="clickHide(true)">Hide</button>
      <button (click)="navigateWithFragment('/', 'test')">Navigate</button>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  standalone: true,
})
class TestHeader extends Header {}

// Моки для сервисов
class MockRouter {
  navigate = vi.fn().mockResolvedValue(true);
}

class MockActivatedRoute {
  snapshot = {
    params: {},
    queryParams: {},
    fragment: null,
  };
}

class MockViewportScroller {
  scrollToAnchor = vi.fn();
}

class MockAuthService {
  isLogged$ = new BehaviorSubject<boolean>(false);
  getTokens = vi.fn().mockReturnValue({ accessToken: null });
  removeTokens = vi.fn();
  logout = vi.fn().mockReturnValue(of({}));
  userId: string | null = null;
}

class MockUserService {
  userInfo$ = new BehaviorSubject<any>(null);
  getUserInfo = vi.fn().mockReturnValue(of({}));
  setUserInfo = vi.fn();
}

class MockToastService {
  showToast = vi.fn();
}

// ====== ТЕСТЫ ======

describe('Header', () => {
  let component: TestHeader;
  let fixture: ComponentFixture<TestHeader>;
  let mockRouter: MockRouter;
  let mockAuth: MockAuthService;
  let mockUser: MockUserService;
  let mockToast: MockToastService;
  let mockScroller: MockViewportScroller;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockAuth = new MockAuthService();
    mockUser = new MockUserService();
    mockToast = new MockToastService();
    mockScroller = new MockViewportScroller();

    // Гарантируем, что эффект в конструкторе не дернет loadUser
    mockAuth.isLogged$.next(false);
    mockAuth.getTokens = vi.fn().mockReturnValue({ accessToken: null });

    await TestBed.configureTestingModule({
      imports: [TestHeader],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ViewportScroller, useValue: mockScroller },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: AuthService, useValue: mockAuth },
        { provide: UserService, useValue: mockUser },
        { provide: ToastService, useValue: mockToast },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleMenu should toggle isShowMenu', () => {
    expect(component.isShowMenu()).toBe(false);
    component.toggleMenu();
    expect(component.isShowMenu()).toBe(true);
    component.toggleMenu();
    expect(component.isShowMenu()).toBe(false);
  });

  it('clickHide(true) should close menu', () => {
    component.isShowMenu.set(true);
    component.clickHide(true);
    expect(component.isShowMenu()).toBe(false);
  });

  it('clickHide(false) should keep menu state', () => {
    component.isShowMenu.set(true);
    component.clickHide(false);
    expect(component.isShowMenu()).toBe(true);
  });

  it('navigateWithFragment should navigate and scroll', async () => {
    const fragment = 'anchor';
    const route = '/test';

    component.navigateWithFragment(route, fragment);

    // Ждем выполнения navigate и setTimeout
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(mockRouter.navigate).toHaveBeenCalledWith([route], { fragment });
    expect(mockScroller.scrollToAnchor).toHaveBeenCalledWith(fragment);
  });

  it('logout should clear data and navigate to root', async () => {
    component.logout();

    // Ждем выполнения observable
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockAuth.removeTokens).toHaveBeenCalled();
    expect(mockUser.setUserInfo).toHaveBeenCalledWith(null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockToast.showToast).toHaveBeenCalled();
  });
});
