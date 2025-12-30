import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 минут
const MAX_CACHE_SIZE = 50;

// Пути, которые не должны кешироваться
const EXCLUDED_PATHS = ['/comments', '/comment', '/actions'];

export const cacheInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Проверяем, не входит ли URL в исключенные пути (для любых методов)
  const url = req.url.toLowerCase();
  const shouldExclude = EXCLUDED_PATHS.some(path => url.includes(path));

  // Для запросов комментариев (кроме GET) очищаем кеш
  if (shouldExclude && req.method !== 'GET') {
    console.log(
      `[Cache] Очищаем кеш комментариев из-за действия: ${req.method} ${req.url}`
    );
    clearCommentsCache();
  }

  // Кешируем только GET-запросы, кроме исключенных путей
  if (req.method !== 'GET' || shouldExclude) {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cachedEntry = cache.get(cacheKey);

  // Проверяем, есть ли актуальный кеш
  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
    console.log(`[Cache] Возвращаем закешированный ответ для: ${cacheKey}`);
    return of(cachedEntry.response.clone());
  }

  // Если кеша нет или он устарел, выполняем запрос
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Очищаем старые записи, если превышен лимит
        if (cache.size >= MAX_CACHE_SIZE) {
          clearOldCacheEntries();
        }

        // Сохраняем ответ в кеш
        cache.set(cacheKey, {
          response: event.clone(),
          timestamp: Date.now(),
        });

        console.log(`[Cache] Сохранили в кеш: ${cacheKey}`);
      }
    })
  );
};

// Функция для очистки старых записей кеша
function clearOldCacheEntries() {
  const now = Date.now();
  const entries = Array.from(cache.entries());

  // Сортируем по времени (старые сначала)
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

  // Удаляем самые старые записи, пока не останется 80% от максимального размера
  const targetSize = Math.floor(MAX_CACHE_SIZE * 0.8);
  let removedCount = 0;

  for (const [key, entry] of entries) {
    if (cache.size <= targetSize) break;

    // Удаляем только если запись действительно старая (> CACHE_DURATION)
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    console.log(`[Cache] Очистили ${removedCount} старых записей`);
  }
}

// Функция для очистки кеша комментариев
function clearCommentsCache() {
  const keysToDelete: string[] = [];

  for (const [key] of cache) {
    if (EXCLUDED_PATHS.some(path => key.toLowerCase().includes(path))) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => {
    cache.delete(key);
    console.log(`[Cache] Удалили из кеша: ${key}`);
  });

  if (keysToDelete.length > 0) {
    console.log(
      `[Cache] Очистили ${keysToDelete.length} записей кеша комментариев`
    );
  }
}
