/**
 * ─── Store Launch Mode Configuration ──────────────────────────────────────────
 *
 * Single source of truth for the store's operating mode.
 *
 * To switch modes, set STORE_MODE in your .env file:
 *
 *   STORE_MODE=coming-soon   ← Browse only, no orders
 *   STORE_MODE=live          ← Full ecommerce functionality
 *   STORE_MODE=maintenance   ← Public blocked, admin works
 *
 * NO code changes needed to launch. Only change the env variable.
 */

export type StoreMode = 'coming-soon' | 'live' | 'maintenance';

const VALID_MODES: StoreMode[] = ['coming-soon', 'live', 'maintenance'];

function resolveStoreMode(): StoreMode {
  // NEXT_PUBLIC_STORE_MODE is available in both server and client bundles.
  // STORE_MODE is server-only (API routes, RSC). We prefer NEXT_PUBLIC_ so
  // client components (ProductInfo, OrderSummary, etc.) get the correct value.
  const raw = (
    process.env.NEXT_PUBLIC_STORE_MODE ??
    process.env.STORE_MODE
  )?.trim().toLowerCase();

  if (raw && VALID_MODES.includes(raw as StoreMode)) {
    return raw as StoreMode;
  }
  // Default safely to coming-soon
  return 'coming-soon';
}

/** The current operating mode of the store. */
export const currentStoreMode: StoreMode = resolveStoreMode();

/** True when the store is fully live and accepting orders. */
export const isStoreLive = currentStoreMode === 'live';

/** True when the store is in coming-soon mode (browse only, no orders). */
export const isComingSoon = currentStoreMode === 'coming-soon';

/** True when the store is under maintenance (public blocked). */
export const isMaintenanceMode = currentStoreMode === 'maintenance';

/**
 * Returns a standardized "Store not accepting orders" API response payload.
 * Use this in any order/payment API route that must be blocked.
 */
export function getStoreBlockedResponse(): { error: string; code: string; mode: StoreMode } {
  if (isMaintenanceMode) {
    return {
      error: 'The store is currently under maintenance. Please check back soon.',
      code: 'STORE_MAINTENANCE',
      mode: currentStoreMode,
    };
  }
  return {
    error: 'Orders are not yet open. PROTIBAE is launching soon — stay tuned!',
    code: 'STORE_NOT_LIVE',
    mode: currentStoreMode,
  };
}
