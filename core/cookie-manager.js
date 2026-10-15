/**
 * Unxnow Cookie Manager - Core API Adapter
 * Directly interfaces with chrome.cookies and chrome.tabs API
 */

export class CookieManager {
  /**
   * Queries the currently active tab in the focused window
   * @returns {Promise<{id: number, url: string, domain: string, cookieStoreId: string}>}
   */
  static async getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) {
      throw new Error('No active browser tab found.');
    }

    const tab = tabs[0];
    const url = tab.url || '';
    let domain = '';

    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        domain = new URL(url).hostname;
      }
    } catch {
      domain = '';
    }

    return {
      id: tab.id,
      url: url,
      domain: domain,
      cookieStoreId: tab.cookieStoreId || '0',
      isSupported: url.startsWith('http://') || url.startsWith('https://')
    };
  }

  /**
   * Retrieves all cookies for a given tab URL
   * @param {string} url
   * @param {string} storeId
   * @returns {Promise<Array<object>>}
   */
  static async getCookies(url, storeId) {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return [];
    }

    const params = { url };
    if (storeId && storeId !== '0') {
      params.storeId = storeId;
    }

    const cookies = await chrome.cookies.getAll(params);
    return cookies.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }

  /**
   * Prepares and normalizes cookie parameters for chrome.cookies.set
   * @param {object} cookie
   * @param {string} tabUrl
   * @returns {object}
   */
  static prepareCookieDetails(cookie, tabUrl) {
    const details = {
      url: tabUrl,
      name: (cookie.name || '').trim(),
      value: cookie.value || '',
      path: cookie.path || '/'
    };

    if (cookie.storeId) {
      details.storeId = cookie.storeId;
    }

    // Domain handling:
    // If hostOnly is false and domain is provided, set domain.
    // If hostOnly is true, domain MUST NOT be set so Chrome makes it host-only.
    if (!cookie.hostOnly && cookie.domain) {
      details.domain = cookie.domain.trim();
    }

    // SameSite handling
    if (cookie.sameSite && cookie.sameSite !== 'unspecified') {
      details.sameSite = cookie.sameSite;
      // If sameSite is 'no_restriction', secure must be true
      if (details.sameSite === 'no_restriction') {
        details.secure = true;
      } else {
        details.secure = Boolean(cookie.secure);
      }
    } else {
      details.secure = Boolean(cookie.secure);
    }

    details.httpOnly = Boolean(cookie.httpOnly);

    // Session vs Expiration Date
    if (cookie.session) {
      // Session cookies do not have expirationDate
      delete details.expirationDate;
    } else if (cookie.expirationDate) {
      details.expirationDate = Math.round(Number(cookie.expirationDate));
    }

    return details;
  }

  /**
   * Saves or creates a cookie
   * @param {object} cookieData
   * @param {string} tabUrl
   * @param {string} [oldName] If updating and the name was changed
   * @param {boolean} [oldHostOnly]
   * @returns {Promise<object>}
   */
  static async saveCookie(cookieData, tabUrl, oldName = null, oldHostOnly = null) {
    if (!cookieData.name || cookieData.name.trim() === '') {
      throw new Error('Cookie name cannot be empty.');
    }

    // If cookie name or hostOnly changed, delete the old cookie first
    if (oldName && (oldName !== cookieData.name || oldHostOnly !== cookieData.hostOnly)) {
      await this.deleteCookie(oldName, tabUrl, cookieData.storeId);
    }

    const details = this.prepareCookieDetails(cookieData, tabUrl);
    const result = await chrome.cookies.set(details);

    if (!result) {
      const lastError = chrome.runtime.lastError?.message || 'Failed to save cookie. Verify domain and secure flags.';
      throw new Error(lastError);
    }

    return result;
  }

  /**
   * Deletes a specific cookie
   * @param {string} name
   * @param {string} url
   * @param {string} [storeId]
   * @returns {Promise<object>}
   */
  static async deleteCookie(nameOrCookie, url, storeId = null) {
    let name = typeof nameOrCookie === 'string' ? nameOrCookie : nameOrCookie.name;
    let targetUrl = url;
    if (typeof nameOrCookie === 'object' && nameOrCookie.domain) {
      const proto = nameOrCookie.secure ? 'https:' : 'http:';
      const cleanHost = nameOrCookie.domain.replace(/^\./, '');
      targetUrl = `${proto}//${cleanHost}${nameOrCookie.path || '/'}`;
    }
    const details = { name, url: targetUrl };
    if (storeId && storeId !== '0') {
      details.storeId = storeId;
    }
    try {
      const res = await chrome.cookies.remove(details);
      if (!res && url && url !== targetUrl) {
        return await chrome.cookies.remove({ name, url, storeId: (storeId && storeId !== '0') ? storeId : undefined });
      }
      return res;
    } catch (err) {
      if (url && url !== targetUrl) {
        return await chrome.cookies.remove({ name, url, storeId: (storeId && storeId !== '0') ? storeId : undefined });
      }
      throw err;
    }
  }

  /**
   * Deletes all specified cookies
   * @param {Array<object>} cookies
   * @param {string} url
   * @param {string} [storeId]
   * @returns {Promise<{deletedCount: number, errors: Array<string>}>}
   */
  static async deleteAllCookies(cookies, url, storeId = null) {
    let deletedCount = 0;
    const errors = [];

    for (const cookie of cookies) {
      try {
        await this.deleteCookie(cookie.name, url, storeId);
        deletedCount++;
      } catch (err) {
        errors.push(`${cookie.name}: ${err.message || String(err)}`);
      }
    }

    return { deletedCount, errors };
  }
}
