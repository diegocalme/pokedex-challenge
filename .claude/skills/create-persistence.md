# Skill: Create Persistence

## Purpose

Scaffold a Local Storage synchronization layer that handles bidirectional sync between a Zustand store and browser Local Storage. This includes initial hydration, write-on-change, cross-tab synchronization via the `storage` event, and graceful error handling for all failure modes.

> **Note:** If the Zustand store already uses the `persist` middleware (see `create-store.md`), this skill is only needed for the **cross-tab sync listener** and any custom hydration logic beyond what `persist` provides out of the box.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `module` | Yes | Target module: `pokemon` or `pokedex` |
| `storageKey` | Yes | Local Storage key (must match the store's `persist` config) |
| `storeHook` | Yes | The Zustand store hook this persistence layer syncs with |
| `syncFields` | Yes | Which state fields are synced to/from Local Storage |

---

## Procedure

### Step 1 — Determine File Paths

```
src/{module}/persistence/
├── {module}.persistence.ts          # Sync logic
└── {module}.persistence.test.ts     # Tests
```

**Example:**
- `pokedex` module →
  - `src/pokedex/persistence/pokedex.persistence.ts`
  - `src/pokedex/persistence/pokedex.persistence.test.ts`

### Step 2 — Generate Persistence File

```typescript
import { useEffect, useCallback } from 'react';
import { use{Store} } from '@{module}/store/{store-file}';

const STORAGE_KEY = '{storageKey}';

/**
 * Hook that sets up cross-tab synchronization for the {module} store.
 * 
 * Listens for `storage` events fired when another tab modifies
 * the same Local Storage key. Parses the new value and patches
 * the Zustand store to keep all tabs in sync.
 * 
 * Mount this hook once at the module's provider level.
 */
export function use{Module}Persistence(): void {
  const setCollection = use{Store}((state) => state.setCollection);

  const handleStorageEvent = useCallback(
    (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      // Key was deleted in another tab
      if (event.newValue === null) {
        setCollection(/* initial empty state */);
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        
        // Validate parsed shape before applying
        if (!isValid{Module}StorageData(parsed)) {
          console.warn(
            `Invalid data received from storage event for key "${STORAGE_KEY}". Ignoring.`
          );
          return;
        }

        // Extract the Zustand persist wrapper's state
        const syncedState = parsed?.state ?? parsed;
        setCollection(syncedState.{syncField});
      } catch (error: unknown) {
        console.warn(
          `Failed to parse storage event for key "${STORAGE_KEY}":`,
          error
        );
        // Do not crash. Current in-memory state remains valid.
      }
    },
    [setCollection]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [handleStorageEvent]);
}

/**
 * Validates that data from Local Storage matches the expected shape.
 * Prevents corrupted or tampered data from crashing the app.
 */
function isValid{Module}StorageData(data: unknown): boolean {
  if (data === null || typeof data !== 'object') return false;

  // Zustand persist wraps state in { state: {...}, version: number }
  const candidate = (data as Record<string, unknown>)?.state ?? data;

  // Validate required fields exist and have correct types
  // Customize this per module's storage shape
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    Array.isArray((candidate as Record<string, unknown>).{syncField})
  );
}

/**
 * Checks if Local Storage is available in the current browser context.
 * Returns false in private browsing modes that block storage or when
 * localStorage throws on access.
 */
export function isLocalStorageAvailable(): boolean {
  const testKey = '__storage_test__';
  try {
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
```

### Step 3 — Generate Test File

```typescript
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { use{Module}Persistence, isLocalStorageAvailable } from './{module}.persistence';

// Mock the store
vi.mock('@{module}/store/{store-file}', () => ({
  use{Store}: vi.fn(),
}));

describe('use{Module}Persistence', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  const mockSetCollection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Mock store hook return
    const { use{Store} } = await import('@{module}/store/{store-file}');
    vi.mocked(use{Store}).mockImplementation((selector: Function) =>
      selector({ setCollection: mockSetCollection })
    );
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should register storage event listener on mount', () => {
    renderHook(() => use{Module}Persistence());
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
  });

  it('should remove storage event listener on unmount', () => {
    const { unmount } = renderHook(() => use{Module}Persistence());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
  });

  it('should ignore storage events for unrelated keys', () => {
    renderHook(() => use{Module}Persistence());
    const handler = addEventListenerSpy.mock.calls[0][1] as EventListener;

    handler(new StorageEvent('storage', { key: 'unrelated-key' }));
    expect(mockSetCollection).not.toHaveBeenCalled();
  });

  it('should update store when valid data arrives from another tab', () => {
    renderHook(() => use{Module}Persistence());
    const handler = addEventListenerSpy.mock.calls[0][1] as EventListener;

    const validData = { state: { {syncField}: [/* test items */] }, version: 1 };
    handler(
      new StorageEvent('storage', {
        key: '{storageKey}',
        newValue: JSON.stringify(validData),
      })
    );

    expect(mockSetCollection).toHaveBeenCalledWith(/* expected items */);
  });

  it('should handle corrupted storage data gracefully', () => {
    renderHook(() => use{Module}Persistence());
    const handler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    handler(
      new StorageEvent('storage', {
        key: '{storageKey}',
        newValue: 'not-valid-json{{{',
      })
    );

    expect(mockSetCollection).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle key deletion from another tab', () => {
    renderHook(() => use{Module}Persistence());
    const handler = addEventListenerSpy.mock.calls[0][1] as EventListener;

    handler(
      new StorageEvent('storage', {
        key: '{storageKey}',
        newValue: null,
      })
    );

    expect(mockSetCollection).toHaveBeenCalledWith(/* empty state */);
  });
});

describe('isLocalStorageAvailable', () => {
  it('should return true when localStorage works', () => {
    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('should return false when localStorage throws', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(isLocalStorageAvailable()).toBe(false);
    setItemSpy.mockRestore();
  });
});
```

**Test coverage requirements:**
- Listener registration and cleanup on mount/unmount.
- Correct key filtering (ignores unrelated keys).
- Valid data sync from another tab.
- Corrupted data handling (malformed JSON, invalid shape).
- Key deletion handling.
- Local Storage availability detection.

---

## Checklist

- [ ] File name follows `{module}.persistence.ts` convention.
- [ ] Storage event listener registered in `useEffect` with cleanup.
- [ ] Event handler memoized with `useCallback`.
- [ ] All `JSON.parse` calls wrapped in try/catch.
- [ ] Parsed data validated before applying to store.
- [ ] Key deletion handled (null `newValue`).
- [ ] `isLocalStorageAvailable` utility exported for use by other modules.
- [ ] No `any` type used. `unknown` used for parsed data before validation.
- [ ] Console warnings for error paths (never silent failures, never crashes).
- [ ] Test file covers all error paths.
