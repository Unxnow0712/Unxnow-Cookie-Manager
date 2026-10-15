/**
 * Unxnow Preset & Profile Manager
 * Persists and organizes cookie collections per website/domain using chrome.storage.local
 */

import { CookieManager } from './cookie-manager.js';

export class PresetManager {
  static STORAGE_KEY = 'unxnow_saved_presets_v1';

  /**
   * Retrieves all presets from chrome.storage.local
   * @returns {Promise<Array<object>>}
   */
  static async getAllPresets() {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || [];
  }

  static NAMES_STORAGE_KEY = 'unxnow_website_names_v1';

  /**
   * Retrieves custom display names for website domains
   * @returns {Promise<Record<string, string>>}
   */
  static async getWebsiteNames() {
    const result = await chrome.storage.local.get(this.NAMES_STORAGE_KEY);
    return result[this.NAMES_STORAGE_KEY] || {};
  }

  /**
   * Sets or resets a custom display name for a website domain
   * @param {string} domain
   * @param {string} [displayName]
   * @returns {Promise<Record<string, string>>}
   */
  static async setWebsiteName(domain, displayName) {
    const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();
    if (!cleanTarget) return {};
    const names = await this.getWebsiteNames();
    if (displayName && displayName.trim()) {
      names[cleanTarget] = displayName.trim();
    } else {
      delete names[cleanTarget];
    }
    await chrome.storage.local.set({ [this.NAMES_STORAGE_KEY]: names });
    return names;
  }

  static CATEGORIES_STORAGE_KEY = 'unxnow_categories_v1';
  static WEBSITE_CATEGORIES_KEY = 'unxnow_website_categories_v1';
  static DEFAULT_CATEGORIES = [];

  /**
   * Retrieves list of all website categories
   * @returns {Promise<Array<string>>}
   */
  static async getCategories() {
    const result = await chrome.storage.local.get([this.CATEGORIES_STORAGE_KEY, 'unxnow_default_cats_removed_v1']);
    let cats = result[this.CATEGORIES_STORAGE_KEY];

    // One-time cleanup: remove legacy default categories ('Umum', 'Sosial', 'Kerja', 'Pribadi')
    if (!result['unxnow_default_cats_removed_v1']) {
      const oldDefaults = ['Umum', 'Sosial', 'Kerja', 'Pribadi'];
      if (Array.isArray(cats)) {
        cats = cats.filter((c) => !oldDefaults.includes(c));
        const siteCats = await this.getWebsiteCategories();
        let changed = false;
        for (const domain of Object.keys(siteCats)) {
          if (oldDefaults.includes(siteCats[domain])) {
            delete siteCats[domain];
            changed = true;
          }
        }
        if (changed) {
          await chrome.storage.local.set({ [this.WEBSITE_CATEGORIES_KEY]: siteCats });
        }
      } else {
        cats = [];
      }
      await chrome.storage.local.set({
        [this.CATEGORIES_STORAGE_KEY]: cats,
        unxnow_default_cats_removed_v1: true
      });
      return cats;
    }

    if (!Array.isArray(cats)) {
      cats = [];
      await chrome.storage.local.set({ [this.CATEGORIES_STORAGE_KEY]: cats });
    }
    return cats;
  }

  /**
   * Adds a new category
   * @param {string} categoryName
   * @returns {Promise<Array<string>>}
   */
  static async addCategory(categoryName) {
    const clean = (categoryName || '').trim();
    if (!clean) return await this.getCategories();
    const cats = await this.getCategories();
    const exists = cats.some((c) => c.toLowerCase() === clean.toLowerCase());
    if (!exists) {
      cats.push(clean);
      await chrome.storage.local.set({ [this.CATEGORIES_STORAGE_KEY]: cats });
    }
    return cats;
  }

  /**
   * Sets/reorders categories array
   * @param {Array<string>} cats
   * @returns {Promise<Array<string>>}
   */
  static async setCategories(cats) {
    if (!Array.isArray(cats)) return [];
    await chrome.storage.local.set({ [this.CATEGORIES_STORAGE_KEY]: cats });
    return cats;
  }

  /**
   * Renames an existing category and updates all associated websites
   * @param {string} oldName
   * @param {string} newName
   * @returns {Promise<Array<string>>}
   */
  static async renameCategory(oldName, newName) {
    const cleanOld = (oldName || '').trim();
    const cleanNew = (newName || '').trim();
    if (!cleanOld || !cleanNew) {
      throw new Error('Category name cannot be empty.');
    }

    let cats = await this.getCategories();
    const oldIdx = cats.findIndex((c) => c.toLowerCase() === cleanOld.toLowerCase());
    if (oldIdx === -1) {
      throw new Error('Category not found.');
    }

    const exists = cats.some((c, idx) => idx !== oldIdx && c.toLowerCase() === cleanNew.toLowerCase());
    if (exists) {
      throw new Error(`Category "${cleanNew}" already exists.`);
    }

    cats[oldIdx] = cleanNew;
    await chrome.storage.local.set({ [this.CATEGORIES_STORAGE_KEY]: cats });

    // Update website mappings
    try {
      const siteCats = await this.getWebsiteCategories();
      let changed = false;
      for (const [dom, cat] of Object.entries(siteCats)) {
        if (cat && cat.toLowerCase() === cleanOld.toLowerCase()) {
          siteCats[dom] = cleanNew;
          changed = true;
        }
      }
      if (changed) {
        await chrome.storage.local.set({ [this.WEBSITE_CATEGORIES_KEY]: siteCats });
      }
    } catch (_) {}

    return cats;
  }

  /**
   * Deletes a category and unassigns it from any websites
   * @param {string} categoryName
   * @returns {Promise<Array<string>>}
   */
  static async deleteCategory(categoryName) {
    const clean = (categoryName || '').trim();
    if (!clean) return await this.getCategories();
    let cats = await this.getCategories();
    cats = cats.filter((c) => c.toLowerCase() !== clean.toLowerCase());
    await chrome.storage.local.set({ [this.CATEGORIES_STORAGE_KEY]: cats });

    // Unassign from websites
    try {
      const siteCats = await this.getWebsiteCategories();
      let changed = false;
      for (const [dom, cat] of Object.entries(siteCats)) {
        if (cat && cat.toLowerCase() === clean.toLowerCase()) {
          delete siteCats[dom];
          changed = true;
        }
      }
      if (changed) {
        await chrome.storage.local.set({ [this.WEBSITE_CATEGORIES_KEY]: siteCats });
      }
    } catch (_) {}

    return cats;
  }

  /**
   * Retrieves domain -> category mapping
   * @returns {Promise<Record<string, string>>}
   */
  static async getWebsiteCategories() {
    const result = await chrome.storage.local.get(this.WEBSITE_CATEGORIES_KEY);
    return result[this.WEBSITE_CATEGORIES_KEY] || {};
  }

  /**
   * Gets category for a single website domain
   * @param {string} domain
   * @returns {Promise<string>}
   */
  static async getWebsiteCategory(domain) {
    const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();
    if (!cleanTarget) return '';
    const map = await this.getWebsiteCategories();
    return map[cleanTarget] || map[`.${cleanTarget}`] || '';
  }

  /**
   * Sets or clears category for a website domain
   * @param {string} domain
   * @param {string} [category]
   * @returns {Promise<Record<string, string>>}
   */
  static async setWebsiteCategory(domain, category) {
    const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();
    if (!cleanTarget) return {};
    const map = await this.getWebsiteCategories();
    if (category && category.trim()) {
      map[cleanTarget] = category.trim();
    } else {
      delete map[cleanTarget];
      delete map[`.${cleanTarget}`];
    }
    await chrome.storage.local.set({ [this.WEBSITE_CATEGORIES_KEY]: map });
    return map;
  }

  static ORDER_STORAGE_KEY = 'unxnow_websites_custom_order_v1';

  /**
   * Retrieves custom ordered domain list
   * @returns {Promise<Array<string>>}
   */
  static async getWebsitesCustomOrder() {
    const result = await chrome.storage.local.get(this.ORDER_STORAGE_KEY);
    return result[this.ORDER_STORAGE_KEY] || [];
  }

  /**
   * Saves custom ordered domain list
   * @param {Array<string>} orderArray
   * @returns {Promise<Array<string>>}
   */
  static async setWebsitesCustomOrder(orderArray) {
    if (!Array.isArray(orderArray)) return [];
    await chrome.storage.local.set({ [this.ORDER_STORAGE_KEY]: orderArray });
    return orderArray;
  }

  static PROFILES_ORDER_KEY = 'unxnow_profiles_custom_order_v1';

  /**
   * Retrieves custom ordered profile ID map per website domain
   * @returns {Promise<Record<string, Array<string>>>}
   */
  static async getProfilesCustomOrder() {
    const result = await chrome.storage.local.get(this.PROFILES_ORDER_KEY);
    return result[this.PROFILES_ORDER_KEY] || {};
  }

  /**
   * Saves custom ordered profile ID list for a domain
   * @param {string} domain
   * @param {Array<string>} orderArray
   * @returns {Promise<Record<string, Array<string>>>}
   */
  static async setProfilesCustomOrder(domain, orderArray) {
    const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();
    if (!cleanTarget || !Array.isArray(orderArray)) return {};
    const map = await this.getProfilesCustomOrder();
    const existingOrder = map[cleanTarget] || [];
    const combined = [...orderArray];
    for (const id of existingOrder) {
      if (!combined.includes(id)) {
        combined.push(id);
      }
    }
    map[cleanTarget] = combined;
    await chrome.storage.local.set({ [this.PROFILES_ORDER_KEY]: map });
    return map;
  }

  /**
   * Retrieves grouped summary of all saved websites
   * @param {string} [searchQuery]
   * @param {string} [sortMode] 'custom' | 'name-asc' | 'name-desc' | 'count' | 'recent'
   * @returns {Promise<Array<{domain: string, displayName: string, count: number, latestUpdate: number, profiles: Array<object>}>>}
   */
  static async getWebsitesSummary(searchQuery = null, sortMode = 'custom') {
    const presets = await this.getAllPresets();
    const names = await this.getWebsiteNames();
    const siteCategories = await this.getWebsiteCategories();
    const customOrder = await this.getWebsitesCustomOrder();
    const map = new Map();

    presets.forEach((p) => {
      const domain = (p.domain || '').toLowerCase().replace(/^\./, '').trim();
      if (!domain) return;

      if (!map.has(domain)) {
        map.set(domain, {
          domain,
          displayName: names[domain] || names[`.${domain}`] || domain,
          category: siteCategories[domain] || siteCategories[`.${domain}`] || '',
          count: 0,
          latestUpdate: 0,
          profiles: []
        });
      }

      const site = map.get(domain);
      site.count++;
      site.profiles.push(p);

      const ts = p.updatedAt || p.createdAt || 0;
      if (ts > site.latestUpdate) {
        site.latestUpdate = ts;
      }
    });

    let sites = Array.from(map.values());

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      sites = sites.filter((s) => {
        const domainMatches = s.domain.includes(q);
        const nameMatches = (s.displayName || '').toLowerCase().includes(q);
        const profileMatches = s.profiles.some((p) => (p.title || '').toLowerCase().includes(q));
        return domainMatches || nameMatches || profileMatches;
      });
    }

    if (sortMode === 'name-asc') {
      return sites.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else if (sortMode === 'name-desc') {
      return sites.sort((a, b) => b.displayName.localeCompare(a.displayName));
    } else if (sortMode === 'count') {
      return sites.sort((a, b) => b.count - a.count);
    } else if (sortMode === 'recent') {
      return sites.sort((a, b) => b.latestUpdate - a.latestUpdate);
    }

    // Default 'custom' sort (order as dragged/arranged by user, falling back to recent)
    if (customOrder.length > 0) {
      return sites.sort((a, b) => {
        const idxA = customOrder.indexOf(a.domain);
        const idxB = customOrder.indexOf(b.domain);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return b.latestUpdate - a.latestUpdate;
      });
    }

    return sites.sort((a, b) => b.latestUpdate - a.latestUpdate);
  }

  /**
   * Retrieves presets for a specific website domain
   * @param {string} domain
   * @param {string} [searchQuery]
   * @returns {Promise<Array<object>>}
   */
  static async getProfilesForWebsite(domain, searchQuery = null) {
    const all = await this.getAllPresets();
    const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();

    let profiles = all.filter((p) => {
      const pDomain = (p.domain || '').toLowerCase().replace(/^\./, '').trim();
      const domainMatches = pDomain === cleanTarget || pDomain.endsWith(`.${cleanTarget}`) || cleanTarget.endsWith(`.${pDomain}`);

      if (!domainMatches) return false;

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const titleMatches = (p.title || '').toLowerCase().includes(q);
        const cookieMatches = Array.isArray(p.cookies) && p.cookies.some((c) =>
          (c.name || '').toLowerCase().includes(q) || (c.value || '').toLowerCase().includes(q)
        );
        return titleMatches || cookieMatches;
      }

      return true;
    });

    // Apply custom order if saved
    try {
      const orderMap = await this.getProfilesCustomOrder();
      const customOrder = orderMap[cleanTarget] || [];
      if (customOrder.length > 0) {
        profiles.sort((a, b) => {
          const idxA = customOrder.indexOf(a.id);
          const idxB = customOrder.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return (b.createdAt || 0) - (a.createdAt || 0);
        });
      }
    } catch (_) {}

    return profiles;
  }

  /**
   * Saves or updates a cookie profile preset
   * @param {object} preset - { id, domain, title, cookies, createdAt }
   * @returns {Promise<object>}
   */
    /**
   * Updates only the note for a specific profile preset
   * @param {string} id
   * @param {string} note
   * @returns {Promise<object>}
   */
  static async updatePresetNote(id, note) {
    const presets = await this.getAllPresets();
    const idx = presets.findIndex((p) => p.id === id);
    if (idx < 0) {
      throw new Error('Profile not found.');
    }
    presets[idx].note = (note || '').trim();
    presets[idx].updatedAt = Date.now();
    await chrome.storage.local.set({ [this.STORAGE_KEY]: presets });
    return presets[idx];
  }

  static async savePreset(preset) {
    if (!preset.title || !preset.title.trim()) {
      throw new Error('Profile title cannot be empty.');
    }
    if (!preset.domain || !preset.domain.trim()) {
      throw new Error('Domain name cannot be empty.');
    }
    if (!Array.isArray(preset.cookies) || preset.cookies.length === 0) {
      throw new Error('Profile must contain at least 1 cookie.');
    }

    const presets = await this.getAllPresets();
    const id = preset.id || `preset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = Date.now();

    const normalizedDomain = preset.domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/^\./, '');

    const existingIndex = presets.findIndex((p) => p.id === id);
    const existingPreset = existingIndex >= 0 ? presets[existingIndex] : null;

    const normalizedPreset = {
      id,
      domain: normalizedDomain,
      title: preset.title.trim(),
      cookies: preset.cookies,
      note: preset.note !== undefined ? (typeof preset.note === 'string' ? preset.note.trim() : '') : (existingPreset && existingPreset.note ? existingPreset.note : ''),
      createdAt: preset.createdAt || (existingPreset && existingPreset.createdAt) || now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      presets[existingIndex] = normalizedPreset;
    } else {
      presets.unshift(normalizedPreset);
    }

    await chrome.storage.local.set({ [this.STORAGE_KEY]: presets });
    return normalizedPreset;
  }

  /**
   * Deletes a preset by its unique ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  static async deletePreset(id) {
    const presets = await this.getAllPresets();
    const filtered = presets.filter((p) => p.id !== id);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: filtered });

    try {
      const orderMap = await this.getProfilesCustomOrder();
      let changed = false;
      for (const dom of Object.keys(orderMap)) {
        if (orderMap[dom].includes(id)) {
          orderMap[dom] = orderMap[dom].filter((pId) => pId !== id);
          changed = true;
        }
      }
      if (changed) {
        await chrome.storage.local.set({ [this.PROFILES_ORDER_KEY]: orderMap });
      }
    } catch (_) {}

    return true;
  }

  /**
   * Deletes all presets for a specific website domain
   * @param {string} domain
   * @returns {Promise<number>}
   */
  static async deleteWebsite(domain) {
    const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();
    const presets = await this.getAllPresets();
    const remaining = presets.filter((p) => {
      const pDomain = (p.domain || '').toLowerCase().replace(/^\./, '').trim();
      return pDomain !== cleanTarget && !pDomain.endsWith(`.${cleanTarget}`);
    });
    const deletedCount = presets.length - remaining.length;
    await chrome.storage.local.set({ [this.STORAGE_KEY]: remaining });

    // Remove custom display name
    await this.setWebsiteName(cleanTarget, null);

    // Remove category mapping
    try {
      await this.setWebsiteCategory(cleanTarget, null);
    } catch (_) {}

    // Remove from custom order
    try {
      const customOrder = await this.getWebsitesCustomOrder();
      const updatedOrder = customOrder.filter((d) => d !== cleanTarget);
      if (updatedOrder.length !== customOrder.length) {
        await this.setWebsitesCustomOrder(updatedOrder);
      }
    } catch (_) {}

    // Remove from profiles custom order
    try {
      const orderMap = await this.getProfilesCustomOrder();
      if (orderMap[cleanTarget]) {
        delete orderMap[cleanTarget];
        await chrome.storage.local.set({ [this.PROFILES_ORDER_KEY]: orderMap });
      }
    } catch (_) {}

    return deletedCount;
  }

  /**
   * Injects preset cookies into target website and navigates user's browser directly to the site!
   * @param {object} preset
   * @param {object} [currentTab]
   * @returns {Promise<{successCount: number, errors: Array<string>, targetUrl: string}>}
   */
  static async applyAndLaunchWebsite(preset, currentTab = null) {
    let cleanDomain = (preset.domain || '').replace(/^\./, '').trim();
    if (!cleanDomain) {
      throw new Error('Invalid preset domain.');
    }

    const targetUrl = `https://${cleanDomain}`;

    // Clean existing cookies for this domain first to ensure clean session
    try {
      const existing = await chrome.cookies.getAll({ url: targetUrl });
      for (const c of existing) {
        await chrome.cookies.remove({ url: targetUrl, name: c.name, storeId: c.storeId });
      }
    } catch (e) {
      console.warn('Failed clearing cookies prior to launch:', e);
    }

    // Set all preset cookies
    let successCount = 0;
    const errors = [];

    for (const cookie of preset.cookies) {
      try {
        await CookieManager.saveCookie(cookie, targetUrl);
        successCount++;
      } catch (err) {
        errors.push(`${cookie.name}: ${err.message || String(err)}`);
      }
    }

    // Navigate or reload tab
    try {
      if (currentTab && currentTab.id) {
        let currentHost = '';
        try {
          if (currentTab.url.startsWith('http://') || currentTab.url.startsWith('https://')) {
            currentHost = new URL(currentTab.url).hostname.toLowerCase();
          }
        } catch {
          currentHost = '';
        }

        // If tab is already on that site, reload it
        if (currentHost === cleanDomain.toLowerCase() || currentHost.endsWith(`.${cleanDomain.toLowerCase()}`)) {
          chrome.tabs.reload(currentTab.id);
        } else {
          // Otherwise redirect the active tab to the site
          chrome.tabs.update(currentTab.id, { url: targetUrl });
        }
      } else {
        // Fallback open new tab
        chrome.tabs.create({ url: targetUrl });
      }
    } catch (tabErr) {
      console.warn('Tab navigation warning:', tabErr);
    }

    return {
      successCount,
      errors,
      targetUrl
    };
  }
}
