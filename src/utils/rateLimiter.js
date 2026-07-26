import conf from '../conf/conf';

/**
 * Rate Limiter Engine with Configurable Thresholds, Per-IP/Per-Account tracking,
 * and Exponential Backoff for Auth Routes.
 */
class RateLimiter {
  constructor() {
    this.storageKey = 'storynest_ratelimit_store_v1';
    this.clientId = this._getOrCreateClientId();
  }

  /**
   * Generates or retrieves a persistent client device/browser identifier (IP/Device proxy).
   */
  _getOrCreateClientId() {
    try {
      let id = localStorage.getItem('storynest_client_id');
      if (!id) {
        id = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        localStorage.setItem('storynest_client_id', id);
      }
      return id;
    } catch {
      return 'client_session_' + Date.now();
    }
  }

  /**
   * Internal store loader.
   */
  _getStore() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * Internal store saver.
   */
  _saveStore(store) {
    try {
      const now = Date.now();
      const cleaned = {};
      for (const [key, data] of Object.entries(store)) {
        if (data.resetTime && data.resetTime > now) {
          cleaned[key] = data;
        }
      }
      localStorage.setItem(this.storageKey, JSON.stringify(cleaned));
    } catch (e) {
      console.warn('Failed to save rate limit store:', e);
    }
  }

  /**
   * Check Auth Route Rate Limit (Login, Signup, Password Reset)
   * Combines Per-IP (Client ID) and Per-Account (Email/Username).
   * Implements Exponential Backoff rather than hard permanent lockout.
   *
   * @param {string} routeName - e.g. 'login', 'signup', 'password_reset'
   * @param {string} accountIdentifier - user email or username (optional)
   * @returns {{ allowed: boolean, remainingMs: number, retryAfterSec: number, errorMessage?: string }}
   */
  checkAuthLimit(routeName, accountIdentifier = '') {
    const config = conf.rateLimit.auth;
    const now = Date.now();
    const cleanAccount = accountIdentifier ? String(accountIdentifier).trim().toLowerCase() : 'anon';
    const key = `auth:${routeName}:${this.clientId}:${cleanAccount}`;

    const store = this._getStore();
    const entry = store[key] || { attempts: 0, resetTime: now + config.windowMs, lastBackoffUntil: 0 };

    // Check if user is currently in exponential backoff delay window
    if (entry.lastBackoffUntil && entry.lastBackoffUntil > now) {
      const remainingMs = entry.lastBackoffUntil - now;
      const retryAfterSec = Math.ceil(remainingMs / 1000);
      return {
        allowed: false,
        remainingMs,
        retryAfterSec,
        errorMessage: `Too many ${routeName} attempts. Please wait ${retryAfterSec} second${retryAfterSec === 1 ? '' : 's'} before trying again.`
      };
    }

    // Reset attempts if window expired
    if (now > entry.resetTime) {
      entry.attempts = 0;
      entry.resetTime = now + config.windowMs;
      entry.lastBackoffUntil = 0;
    }

    if (entry.attempts >= config.maxAttempts) {
      const excess = entry.attempts - config.maxAttempts + 1;
      const backoffMs = Math.min(
        config.baseBackoffMs * Math.pow(2, excess - 1),
        config.maxBackoffMs
      );
      entry.lastBackoffUntil = now + backoffMs;
      this._saveStore(store);

      const retryAfterSec = Math.ceil(backoffMs / 1000);
      return {
        allowed: false,
        remainingMs: backoffMs,
        retryAfterSec,
        errorMessage: `Security limit reached. Please wait ${retryAfterSec} second${retryAfterSec === 1 ? '' : 's'} before retrying.`
      };
    }

    return { allowed: true, remainingMs: 0, retryAfterSec: 0 };
  }

  /**
   * Record a failed Auth attempt (increments attempt counter and sets exponential backoff if needed).
   */
  recordAuthFailure(routeName, accountIdentifier = '') {
    const config = conf.rateLimit.auth;
    const now = Date.now();
    const cleanAccount = accountIdentifier ? String(accountIdentifier).trim().toLowerCase() : 'anon';
    const key = `auth:${routeName}:${this.clientId}:${cleanAccount}`;

    const store = this._getStore();
    const entry = store[key] || { attempts: 0, resetTime: now + config.windowMs, lastBackoffUntil: 0 };

    if (now > entry.resetTime) {
      entry.attempts = 0;
      entry.resetTime = now + config.windowMs;
    }

    entry.attempts += 1;

    if (entry.attempts >= config.maxAttempts) {
      const excess = entry.attempts - config.maxAttempts + 1;
      const backoffMs = Math.min(
        config.baseBackoffMs * Math.pow(2, excess - 1),
        config.maxBackoffMs
      );
      entry.lastBackoffUntil = now + backoffMs;
    }

    store[key] = entry;
    this._saveStore(store);
  }

  /**
   * Reset Auth attempts on successful login/signup.
   */
  recordAuthSuccess(routeName, accountIdentifier = '') {
    const cleanAccount = accountIdentifier ? String(accountIdentifier).trim().toLowerCase() : 'anon';
    const key = `auth:${routeName}:${this.clientId}:${cleanAccount}`;
    const store = this._getStore();
    delete store[key];
    this._saveStore(store);
  }

  /**
   * Check Public Route Rate Limit (Moderate limit).
   * e.g. newsletter subscribe, public search.
   *
   * @param {string} routeName
   * @returns {{ allowed: boolean, retryAfterSec: number, errorMessage?: string }}
   */
  checkPublicLimit(routeName) {
    const config = conf.rateLimit.public;
    const now = Date.now();
    const key = `public:${routeName}:${this.clientId}`;

    const store = this._getStore();
    const entry = store[key] || { count: 0, resetTime: now + config.windowMs };

    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
    }

    if (entry.count >= config.maxRequests) {
      const remainingMs = entry.resetTime - now;
      const retryAfterSec = Math.ceil(remainingMs / 1000);
      return {
        allowed: false,
        retryAfterSec,
        errorMessage: `Rate limit exceeded for public action (${routeName}). Please wait ${retryAfterSec}s.`
      };
    }

    entry.count += 1;
    store[key] = entry;
    this._saveStore(store);

    return { allowed: true, retryAfterSec: 0 };
  }

  /**
   * Check Authenticated User Action Rate Limit (Looser limit).
   * e.g. creating posts, commenting, liking, updating profile.
   *
   * @param {string} actionName
   * @param {string} userId
   * @returns {{ allowed: boolean, retryAfterSec: number, errorMessage?: string }}
   */
  checkAuthenticatedLimit(actionName, userId = '') {
    const config = conf.rateLimit.authenticated;
    const now = Date.now();
    const userKey = userId || this.clientId;
    const key = `auth_action:${actionName}:${userKey}`;

    const store = this._getStore();
    const entry = store[key] || { count: 0, resetTime: now + config.windowMs };

    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
    }

    if (entry.count >= config.maxRequests) {
      const remainingMs = entry.resetTime - now;
      const retryAfterSec = Math.ceil(remainingMs / 1000);
      return {
        allowed: false,
        retryAfterSec,
        errorMessage: `You are performing actions too quickly. Please slow down and try again in ${retryAfterSec}s.`
      };
    }

    entry.count += 1;
    store[key] = entry;
    this._saveStore(store);

    return { allowed: true, retryAfterSec: 0 };
  }
}

export const rateLimiter = new RateLimiter();
