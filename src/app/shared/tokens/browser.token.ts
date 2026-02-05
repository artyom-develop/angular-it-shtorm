import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const IS_BROWSER = new InjectionToken<boolean>('PLATFORM_ID', {
  providedIn: 'root',
  factory: () => isPlatformBrowser(inject(PLATFORM_ID)),
});
