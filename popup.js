/**
 * Unxnow Cookie Editor - Main UI Controller
 * Two-level Saved Profiles workflow: All Websites -> Website Cookie Profiles -> Launch & Navigate
 */

import { CookieManager } from './core/cookie-manager.js';
import {
  autoDetectAndParse,
  HeaderStringFormatter,
  JSONFormatter,
  NetscapeFormatter
} from './core/formatters.js';
import { PresetManager } from './core/preset-manager.js';
import { t, applyDOMTranslations, setLanguage } from './core/i18n.js';

let currentTab = null;
let allCookies = [];
let filteredCookies = [];
let allProfiles = [];
let activeNavTab = 'profiles'; // 'profiles' (default: Websites Directory) | 'cookies'
let selectedWebsiteDomain = null; // null for Level 1 (All Websites), or string 'netflix.com' for Level 2
let toastTimeout = null;
let currentExportFormat = 'json';
let currentViewProfile = null;
let currentViewProfileFormat = 'json';
let websiteSortMode = 'custom'; // 'custom' | 'name-asc' | 'name-desc' | 'count' | 'recent'
let cookieSortMode = 'custom';  // 'custom' | 'name-asc' | 'name-desc' | 'domain' | 'expiry'
let draggedWebsiteDomain = null;
let isDraggingWebsite = false;
let draggedProfileId = null;
let isDraggingProfile = false;
let draggedCookieName = null;
let isDraggingCookie = false;
let draggedCategoryName = null;
let isDraggingCategory = false;
let isCategoryBarDown = false;
let categoryBarStartX = 0;
let categoryBarScrollLeft = 0;
let categoryBarHasMoved = false;
let currentTheme = 'light';
let currentLang = 'id';

// DOM Element References: Header & Nav
const siteInfo = document.getElementById('site-info');
const domainBadge = document.getElementById('domain-badge');
const cookieCounter = document.getElementById('cookie-counter');
const profileCounter = document.getElementById('profile-counter');
const navBtnCookies = document.getElementById('nav-btn-cookies');
const navBtnProfiles = document.getElementById('nav-btn-profiles');
const searchInput = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear');
const toastElement = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const btnSortToggle = document.getElementById('btn-sort-toggle');
const sortDropdown = document.getElementById('sort-dropdown');
const sortOptionsList = document.getElementById('sort-options-list');

// Panes & Footers
const paneCookies = document.getElementById('pane-cookies');
const paneProfiles = document.getElementById('pane-profiles');
const footerCookies = document.getElementById('footer-cookies');

// Cookie Views
const cookieList = document.getElementById('cookie-list');
const viewUnsupported = document.getElementById('view-unsupported');
const viewEmpty = document.getElementById('view-empty');

// Profile Views: Level 1 (Websites Directory)
const profilesWebsitesView = document.getElementById('profiles-websites-view');
const viewWebsitesEmpty = document.getElementById('view-websites-empty');
const websitesList = document.getElementById('websites-list');
const btnEmptySaveSite = document.getElementById('btn-empty-save-site');
const btnEmptyCreateSite = document.getElementById('btn-empty-create-site');

// Profile Views: Level 2 (Website Cookie Profiles Drill-down)
const profilesDetailView = document.getElementById('profiles-detail-view');
const btnBackToWebsites = document.getElementById('btn-back-to-websites');
const detailWebsiteFavicon = document.getElementById('detail-website-favicon');
const detailWebsiteDomain = document.getElementById('detail-website-domain');
const btnAddProfileForSite = document.getElementById('btn-add-profile-for-site');
const viewSiteProfilesEmpty = document.getElementById('view-site-profiles-empty');
const siteProfilesList = document.getElementById('site-profiles-list');
const btnSiteAddFirstProfile = document.getElementById('btn-site-add-first-profile');

// Restore Profiles Action
const inputRestoreProfiles = document.getElementById('input-restore-profiles');

// Modals
const modalAdd = document.getElementById('modal-add');
const modalImport = document.getElementById('modal-import');
const modalExport = document.getElementById('modal-export');
const modalDeleteAll = document.getElementById('modal-delete-all');
const modalSaveProfile = document.getElementById('modal-save-profile');
const modalViewProfile = document.getElementById('modal-view-profile');

// Form Add Elements
const formAdd = document.getElementById('form-add');
const addName = document.getElementById('add-name');
const addValue = document.getElementById('add-value');
const addDomain = document.getElementById('add-domain');
const addPath = document.getElementById('add-path');
const addSameSite = document.getElementById('add-samesite');
const addExpiration = document.getElementById('add-expiration');
const addSession = document.getElementById('add-session');
const addHostOnly = document.getElementById('add-hostonly');
const addSecure = document.getElementById('add-secure');
const addHttpOnly = document.getElementById('add-httponly');

// Import / Export Elements
const importInput = document.getElementById('import-input');
const exportOutput = document.getElementById('export-output');
const btnSubmitImport = document.getElementById('btn-submit-import');
const btnCopyExport = document.getElementById('btn-copy-export');
const btnDownloadExport = document.getElementById('btn-download-export');
const btnConfirmDeleteAll = document.getElementById('btn-confirm-delete-all');
const deleteDomainName = document.getElementById('delete-domain-name');

// Modal Save Profile Elements
const formSaveProfile = document.getElementById('form-save-profile');
const modalSaveProfileTitle = document.getElementById('modal-save-profile-title');
const profileEditId = document.getElementById('profile-edit-id');
const profileNameInput = document.getElementById('profile-name-input');
const profileDomainInput = document.getElementById('profile-domain-input');
const sourceCurrentTab = document.getElementById('source-current-tab');
const sourceCustomPaste = document.getElementById('source-custom-paste');
const sourceCurrentCount = document.getElementById('source-current-count');
const profileCustomBox = document.getElementById('profile-custom-box');
const profileCustomCookies = document.getElementById('profile-custom-cookies');

// Modal View Profile Elements
const viewProfileTitle = document.getElementById('view-profile-title');
const viewProfileDomain = document.getElementById('view-profile-domain');
const viewProfileCount = document.getElementById('view-profile-count');
const viewProfileDate = document.getElementById('view-profile-date');
const viewProfileContent = document.getElementById('view-profile-content');
const btnCopyViewProfile = document.getElementById('btn-copy-view-profile');
const btnApplyFromModal = document.getElementById('btn-apply-from-modal');

/**
 * Initializes the application
 */

// Settings Dropdown Elements
const btnSettingsToggle = document.getElementById('btn-settings-toggle');
const settingsDropdown = document.getElementById('settings-dropdown');
const menuBtnSaveCurrent = document.getElementById('menu-btn-save-current');
const menuBtnNewProfile = document.getElementById('menu-btn-new-profile');
const menuBtnExport = document.getElementById('menu-btn-export');
const menuBtnImport = document.getElementById('menu-btn-import');
const menuBtnTheme = document.getElementById('menu-btn-theme');
const themeIconSun = document.getElementById('theme-icon-sun');
const themeIconMoon = document.getElementById('theme-icon-moon');
const labelMenuTheme = document.getElementById('label-menu-theme');
const menuBtnLanguage = document.getElementById('menu-btn-language');
const labelMenuLang = document.getElementById('label-menu-lang');
const menuBtnAbout = document.getElementById('menu-btn-about');
const modalAbout = document.getElementById('modal-about');
const btnAboutClose = document.getElementById('btn-about-close');

// Settings Menu Labels for i18n
const labelMenuSave = document.getElementById('label-menu-save');
const labelMenuAdd = document.getElementById('label-menu-add');
const labelMenuExport = document.getElementById('label-menu-export');
const labelMenuImport = document.getElementById('label-menu-import');
const labelMenuAbout = document.getElementById('label-menu-about');

// Sort & About i18n references
const sortMenuHeaderTitle = document.getElementById('sort-menu-header-title');
const aboutModalDesc = document.getElementById('about-modal-desc');
const aboutLabelDev = document.getElementById('about-label-dev');
const aboutLabelLicense = document.getElementById('about-label-license');
const aboutLabelStorage = document.getElementById('about-label-storage');

// Edit Website Display Name Elements
const modalEditWebsite = document.getElementById('modal-edit-website');
const formEditWebsite = document.getElementById('form-edit-website');
const editWebsiteDomain = document.getElementById('edit-website-domain');
const editWebsiteName = document.getElementById('edit-website-name');
const editWebsiteCategory = document.getElementById('edit-website-category');
const editWebsiteDomainHint = document.getElementById('edit-website-domain-hint');
const btnResetWebsiteName = document.getElementById('btn-reset-website-name');
const btnDeleteWebsiteModal = document.getElementById('btn-delete-website-modal');

// Website Category Elements & State
const websiteCategoryBar = document.getElementById('website-category-bar');
const menuBtnCategories = document.getElementById('menu-btn-categories');
const modalCategories = document.getElementById('modal-categories');
const formAddCategory = document.getElementById('form-add-category');
const inputNewCategory = document.getElementById('input-new-category');
const categoriesManageList = document.getElementById('categories-manage-list');
const categoriesCountBadge = document.getElementById('categories-count-badge');
let selectedWebsiteCategory = 'all';

// Delete Website Confirmation Modal Elements
const modalDeleteWebsite = document.getElementById('modal-delete-website');
const modalProfileNote = document.getElementById('modal-profile-note');
const formProfileNote = document.getElementById('form-profile-note');
const noteProfileId = document.getElementById('note-profile-id');
const noteProfileNameLabel = document.getElementById('note-profile-name-label');
const noteProfileDomainBadge = document.getElementById('note-profile-domain-badge');
const noteProfileContent = document.getElementById('note-profile-content');
const btnClearProfileNote = document.getElementById('btn-clear-profile-note');
const btnSaveProfileNote = document.getElementById('btn-save-profile-note');
const editProfileNote = document.getElementById('edit-profile-note');
const modalDeleteProfile = document.getElementById('modal-delete-profile');
const deleteProfileNameTarget = document.getElementById('delete-profile-name-target');
const btnConfirmDeleteProfile = document.getElementById('btn-confirm-delete-profile');
let pendingDeleteProfileId = null;
let pendingDeleteProfileTitle = '';
const deleteWebsiteNameTarget = document.getElementById('delete-website-name-target');
const deleteWebsiteCountHint = document.getElementById('delete-website-count-hint');
const btnConfirmDeleteWebsite = document.getElementById('btn-confirm-delete-website');
let pendingDeleteDomain = null;

// Edit Cookie Profile Elements
const modalEditProfile = document.getElementById('modal-edit-profile');
const formEditProfile = document.getElementById('form-edit-profile');
const editProfileId = document.getElementById('edit-profile-id');
const editProfileDomain = document.getElementById('edit-profile-domain');
const editProfileDomainBadge = document.getElementById('edit-profile-domain-badge');
const editProfileTitle = document.getElementById('edit-profile-title');
const editProfileCookies = document.getElementById('edit-profile-cookies');
const editProfileCookiesCount = document.getElementById('edit-profile-cookies-count');
const btnDeleteProfileFromEditModal = document.getElementById('btn-delete-profile-from-edit-modal');
const btnSaveEditProfile = document.getElementById('btn-save-edit-profile');

async function init() {
  setupEventListeners();

  // Load persistent theme & language preferences
  try {
    const prefs = await chrome.storage.local.get(['unxnow_theme_v1', 'unxnow_lang_v1']);
    if (prefs.unxnow_theme_v1) {
      currentTheme = prefs.unxnow_theme_v1;
    }
    if (prefs.unxnow_lang_v1) {
      currentLang = prefs.unxnow_lang_v1;
    }
  } catch (err) {
    console.warn('Could not read user preferences from storage:', err);
  }
  applyTheme(currentTheme);
  applyLanguage(currentLang);

  try {
    currentTab = await CookieManager.getActiveTab();
  } catch (err) {
    currentTab = { isSupported: false, url: '', domain: '' };
  }

  // Always load saved profiles so the list of websites appears everywhere (new tab, settings, etc.)
  await reloadProfiles();

  // If active tab is a normal supported website, load its live cookies
  if (currentTab && currentTab.isSupported) {
    if (domainBadge) {
      domainBadge.textContent = currentTab.domain || 'localhost';
      domainBadge.title = currentTab.url;
    }
    if (deleteDomainName) {
      deleteDomainName.textContent = currentTab.domain || currentTab.url;
    }

    if (currentTab.domain) {
      if (addDomain) addDomain.value = currentTab.domain;
      if (profileDomainInput) profileDomainInput.value = currentTab.domain;
    }

    await reloadCookies();
  } else {
    // Current tab is restricted or internal (e.g. chrome://newtab, chrome://settings)
    showUnsupportedState(currentTab ? currentTab.url : 'Restricted Page');
  }

  // Ensure navigation view is set correctly (Saved Profiles by default)
  switchNavTab(activeNavTab);

  // Listen for background cookie changes
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'COOKIE_CHANGED') {
      debounceReload();
    }
  });
}

let reloadTimer = null;
function debounceReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    reloadCookies(false);
  }, 250);
}

/**
 * Loads cookies from browser for current tab
 */
async function reloadCookies(showLoadingToast = false) {
  if (!currentTab || !currentTab.isSupported) return;

  try {
    allCookies = await CookieManager.getCookies(currentTab.url, currentTab.cookieStoreId);
    updateSourceCurrentLabel();
    if (activeNavTab === 'cookies') {
      filterAndRenderCookies();
    }
    if (showLoadingToast) {
      showToast(t('toast.cookies_refreshed'), 'info');
    }
  } catch (err) {
    console.error(err);
    showToast(t('toast.cookies_read_error', { err: err.message }), 'error');
  }
}

/**
 * Reloads and renders Saved Profiles (Level 1 websites or Level 2 profiles)
 */
async function reloadProfiles() {
  try {
    allProfiles = await PresetManager.getAllPresets();
    profileCounter.textContent = `${allProfiles.length}`;
    const statusProfilesCount = document.getElementById('status-profiles-count');
    if (statusProfilesCount) {
      statusProfilesCount.textContent = `${allProfiles.length} profiles active`;
    }

    const query = (searchInput.value || '').trim();

    if (selectedWebsiteDomain) {
      // LEVEL 2: Render cookie profiles for selected website
      await renderWebsiteDetailView(selectedWebsiteDomain, query);
    } else {
      // LEVEL 1: Render list of all saved websites
      await renderWebsitesDirectory(query);
    }
  } catch (err) {
    console.error('Failed to load presets:', err);
    showToast(t('toast.profiles_load_error', { err: err.message }), 'error');
  }
}


/**
 * Opens modal to edit the display name of a website
 * @param {string} domain
 * @param {string} currentName
 */
/**
 * Opens confirmation modal to delete a website
 * @param {string} domain
 * @param {string} name
 * @param {number} count
 */
function openDeleteWebsiteModal(domain, name = '', count = 0) {
  pendingDeleteDomain = domain;
  const targetName = name || domain;
  const isId = currentLang === 'id';
  const confirmP = document.getElementById('delete-website-confirm-text');
  if (confirmP) {
    confirmP.dataset.name = targetName;
    confirmP.innerHTML = isId
      ? `Yakin ingin menghapus website <span class="confirm-target-badge" id="delete-website-name-target">${escapeHtml(targetName)}</span> dari daftar?`
      : `Are you sure you want to delete website <span class="confirm-target-badge" id="delete-website-name-target">${escapeHtml(targetName)}</span> from the list?`;
  }
  if (deleteWebsiteCountHint) {
    deleteWebsiteCountHint.dataset.count = count;
    deleteWebsiteCountHint.textContent = count > 0
      ? (isId ? `Semua (${count}) profil cookie di website ini akan ikut terhapus permanen.` : `All (${count}) cookie profile${count > 1 ? 's' : ''} in this website will be permanently deleted.`)
      : (isId ? 'Website ini tidak memiliki profil cookie tersimpan.' : 'This website has no saved cookie profiles.');
  }
  openModal(modalDeleteWebsite);
}

/**
 * Opens modal to edit a cookie profile (name & cookies)
 * @param {object} profile
 */

/**
 * Opens note modal for adding or editing a profile's note
 * @param {object} profile
 */
function openProfileNoteModal(profile) {
  if (!modalProfileNote) return;
  noteProfileId.value = profile.id;
  noteProfileNameLabel.textContent = profile.title || 'Profil';
  noteProfileDomainBadge.textContent = profile.domain || selectedWebsiteDomain || '';
  noteProfileContent.value = profile.note || '';

  const hasNote = Boolean(profile.note && profile.note.trim());
  if (btnClearProfileNote) {
    btnClearProfileNote.style.display = hasNote ? 'inline-flex' : 'none';
  }

  openModal(modalProfileNote);
  setTimeout(() => {
    noteProfileContent.focus();
  }, 100);
}

function openEditProfileModal(profile) {
  if (!profile) return;
  editProfileId.value = profile.id;
  editProfileDomain.value = profile.domain;
  editProfileDomainBadge.textContent = profile.domain;
  editProfileTitle.value = profile.title || '';
  if (editProfileNote) editProfileNote.value = profile.note || '';

  const cookies = Array.isArray(profile.cookies) ? profile.cookies : [];
  editProfileCookies.value = JSON.stringify(cookies, null, 2);
  editProfileCookiesCount.textContent = `${cookies.length} ${currentLang === 'id' ? 'cookie' : (cookies.length === 1 ? 'cookie' : 'cookies')}`;
  editProfileCookiesCount.style.color = '';

  openModal(modalEditProfile);
  setTimeout(() => {
    editProfileTitle.focus();
    editProfileTitle.select();
  }, 100);
}

async function openEditWebsiteModal(domain, currentName, count = 0) {
  editWebsiteDomain.value = domain;
  editWebsiteName.value = currentName || domain;
  editWebsiteDomainHint.textContent = currentLang === 'id' ? `Domain asli: ${domain}` : `Original domain: ${domain}`;
  editWebsiteDomain.dataset.count = count;

  // Populate custom category options dropdown
  const categorySelectDropdown = document.getElementById('category-options-dropdown');
  const categorySelectLabel = document.getElementById('category-select-current-label');
  const categorySelectTrigger = document.getElementById('category-select-trigger');

  if (categorySelectDropdown) {
    categorySelectDropdown.classList.add('hidden');
  }
  if (categorySelectTrigger) {
    categorySelectTrigger.classList.remove('active');
    categorySelectTrigger.setAttribute('aria-expanded', 'false');
  }

  if (editWebsiteCategory && categorySelectDropdown) {
    try {
      const categories = await PresetManager.getCategories();
      const currentCat = await PresetManager.getWebsiteCategory(domain);
      editWebsiteCategory.value = currentCat || '';

      const noneLabel = t('modal.edit_website.category_none') || 'Tanpa Kategori';
      if (categorySelectLabel) {
        categorySelectLabel.textContent = currentCat ? `# ${currentCat}` : noneLabel;
      }

      let html = '';
      // 1. "Tanpa Kategori" option
      const isNoneSelected = !currentCat;
      html += `
        <div class="category-option-item ${isNoneSelected ? 'selected' : ''}" data-value="">
          <div class="category-option-left">
            <span class="category-option-none-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <line x1="5.7" y1="5.7" x2="18.3" y2="18.3"></line>
              </svg>
            </span>
            <span class="category-option-name">${escapeHtml(noneLabel)}</span>
          </div>
          ${isNoneSelected ? `
            <span class="category-option-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          ` : ''}
        </div>
      `;

      // 2. Each category option (redesigned with # badge and checkmark)
      categories.forEach((cat) => {
        const isSelected = (currentCat || '').toLowerCase() === cat.toLowerCase();
        html += `
          <div class="category-option-item ${isSelected ? 'selected' : ''}" data-value="${escapeHtml(cat)}">
            <div class="category-option-left">
              <span class="category-option-hash">#</span>
              <span class="category-option-name">${escapeHtml(cat)}</span>
            </div>
            ${isSelected ? `
              <span class="category-option-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            ` : ''}
          </div>
        `;
      });

      // 3. Divider & Manage Categories action button
      html += `
        <div class="category-dropdown-divider"></div>
        <button type="button" class="category-dropdown-manage-btn" id="btn-open-categories-from-edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
          </svg>
          <span>${escapeHtml(t('menu.categories'))}</span>
        </button>
      `;

      categorySelectDropdown.innerHTML = html;

      // Click listener for each option
      categorySelectDropdown.querySelectorAll('.category-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.dataset.value || '';
          editWebsiteCategory.value = val;
          if (categorySelectLabel) {
            categorySelectLabel.textContent = val ? `# ${val}` : noneLabel;
          }

          categorySelectDropdown.querySelectorAll('.category-option-item').forEach((opt) => opt.classList.remove('selected'));
          categorySelectDropdown.querySelectorAll('.category-option-check').forEach((ch) => ch.remove());
          item.classList.add('selected');

          const checkSpan = document.createElement('span');
          checkSpan.className = 'category-option-check';
          checkSpan.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          item.appendChild(checkSpan);

          categorySelectDropdown.classList.add('hidden');
          if (categorySelectTrigger) {
            categorySelectTrigger.classList.remove('active');
            categorySelectTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Manage categories button
      const btnManage = categorySelectDropdown.querySelector('#btn-open-categories-from-edit');
      if (btnManage) {
        btnManage.addEventListener('click', (e) => {
          e.stopPropagation();
          categorySelectDropdown.classList.add('hidden');
          if (categorySelectTrigger) {
            categorySelectTrigger.classList.remove('active');
          }
          closeModal(modalEditWebsite);
          openCategoriesModal();
        });
      }
    } catch (err) {
      console.warn('Could not populate categories dropdown:', err);
    }
  }

  openModal(modalEditWebsite);
  setTimeout(() => {
    editWebsiteName.focus();
    editWebsiteName.select();
  }, 100);
}

/**
 * LEVEL 1: Renders the list of all saved websites (Square Cards)
 * @param {string} query
 */
/**
 * Generates an ambient brand glow color for the website card icon
 * @param {string} domain
 * @returns {string} rgba color string
 */
function getDomainGlowColor(domain = '') {
  const clean = domain.toLowerCase().replace(/^(www\.|m\.)/, '');
  if (clean.includes('gemini')) return 'rgba(168, 85, 247, 0.38)';
  if (clean.includes('youtube') || clean.includes('youtu.be')) return 'rgba(239, 68, 68, 0.38)';
  if (clean.includes('netflix')) return 'rgba(229, 9, 20, 0.38)';
  if (clean.includes('google')) return 'rgba(66, 133, 244, 0.35)';
  if (clean.includes('openai') || clean.includes('chatgpt')) return 'rgba(16, 185, 129, 0.38)';
  if (clean.includes('spotify')) return 'rgba(34, 197, 94, 0.38)';
  if (clean.includes('facebook') || clean.includes('meta')) return 'rgba(24, 119, 242, 0.35)';
  if (clean.includes('twitter') || clean.includes('x.com')) return 'rgba(14, 165, 233, 0.38)';

  const glows = [
    'rgba(59, 130, 246, 0.35)',  // blue
    'rgba(168, 85, 247, 0.35)', // purple
    'rgba(239, 68, 68, 0.35)',  // red
    'rgba(16, 185, 129, 0.35)', // emerald
    'rgba(245, 158, 11, 0.35)', // amber
    'rgba(236, 72, 153, 0.35)', // pink
    'rgba(14, 165, 233, 0.35)'  // cyan
  ];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  return glows[Math.abs(hash) % glows.length];
}

/**
 * Renders the horizontal Category Filter Bar directly below the searchbar
 * @param {Array<object>} allWebsites
 */
async function renderWebsiteCategoryBar(allWebsites = []) {
  if (!websiteCategoryBar) return;
  const categories = await PresetManager.getCategories();
  websiteCategoryBar.innerHTML = '';

  // 1. "Semua" / "All" chip
  const allChip = document.createElement('button');
  allChip.type = 'button';
  const isAllActive = selectedWebsiteCategory === 'all';
  allChip.className = `category-chip ${isAllActive ? 'active' : ''}`;
  allChip.innerHTML = `${t('category.all')} <span class="chip-count">${allWebsites.length}</span>`;
  allChip.addEventListener('click', async () => {
    if (categoryBarHasMoved) return;
    if (selectedWebsiteCategory === 'all') return;
    selectedWebsiteCategory = 'all';
    await reloadProfiles();
  });
  websiteCategoryBar.appendChild(allChip);

  // 2. Individual Category chips
  categories.forEach((cat) => {
    const count = allWebsites.filter((s) => (s.category || '').toLowerCase() === cat.toLowerCase()).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    const isActive = selectedWebsiteCategory.toLowerCase() === cat.toLowerCase();
    chip.className = `category-chip ${isActive ? 'active' : ''}`;
    chip.innerHTML = `${escapeHtml(cat)} <span class="chip-count">${count}</span>`;
    chip.addEventListener('click', async () => {
      if (categoryBarHasMoved) return;
      if (selectedWebsiteCategory.toLowerCase() === cat.toLowerCase()) {
        selectedWebsiteCategory = 'all';
      } else {
        selectedWebsiteCategory = cat;
      }
      await reloadProfiles();
    });
    websiteCategoryBar.appendChild(chip);
  });

  // 3. "Tanpa Kategori" / "No Category" chip if any uncategorized websites exist
  const noneCount = allWebsites.filter((s) => !s.category).length;
  if (noneCount > 0 && categories.length > 0) {
    const noneChip = document.createElement('button');
    noneChip.type = 'button';
    const isNoneActive = selectedWebsiteCategory === '__none__';
    noneChip.className = `category-chip ${isNoneActive ? 'active' : ''}`;
    noneChip.innerHTML = `${t('category.none')} <span class="chip-count">${noneCount}</span>`;
    noneChip.addEventListener('click', async () => {
      if (categoryBarHasMoved) return;
      selectedWebsiteCategory = isNoneActive ? 'all' : '__none__';
      await reloadProfiles();
    });
    websiteCategoryBar.appendChild(noneChip);
  }

  // 4. Quick Action Button to open Category Management Modal
  const actionBtn = document.createElement('button');
  actionBtn.type = 'button';
  actionBtn.className = 'category-chip-action';
  actionBtn.title = t('category.manage_title');
  actionBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `;
  actionBtn.addEventListener('click', () => {
    if (categoryBarHasMoved) return;
    openCategoriesModal();
  });
  websiteCategoryBar.appendChild(actionBtn);
}

/**
 * Opens modal for managing website categories
 */
async function openCategoriesModal() {
  if (!modalCategories) return;
  closeSettingsDropdown();
  await renderCategoriesManageList();
  openModal(modalCategories);
  setTimeout(() => {
    if (inputNewCategory) inputNewCategory.focus();
  }, 100);
}

/**
 * Renders the categories list inside the Category Management Modal
 */
async function renderCategoriesManageList() {
  if (!categoriesManageList) return;
  const categories = await PresetManager.getCategories();
  const allWebsites = await PresetManager.getWebsitesSummary();
  categoriesManageList.innerHTML = '';

  if (categoriesCountBadge) {
    categoriesCountBadge.textContent = `${categories.length}`;
  }

  if (categories.length === 0) {
    categoriesManageList.innerHTML = `
      <li class="category-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
        </svg>
        <span>${t('modal.categories.empty')}</span>
      </li>
    `;
    return;
  }

  categories.forEach((cat) => {
    const count = allWebsites.filter((s) => (s.category || '').toLowerCase() === cat.toLowerCase()).length;
    const countLabel = count === 1
      ? (currentLang === 'id' ? '1 website' : '1 website')
      : (currentLang === 'id' ? `${count} website` : `${count} websites`);

    const li = document.createElement('li');
    li.className = 'category-manage-item';
    li.draggable = true;
    li.dataset.category = cat;
    li.innerHTML = `
      <div class="category-manage-left">
        <span class="category-drag-handle" title="${currentLang === 'id' ? 'Geser untuk mengubah urutan' : 'Drag to reorder'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="6" r="1"></circle>
            <circle cx="15" cy="6" r="1"></circle>
            <circle cx="9" cy="12" r="1"></circle>
            <circle cx="15" cy="12" r="1"></circle>
            <circle cx="9" cy="18" r="1"></circle>
            <circle cx="15" cy="18" r="1"></circle>
          </svg>
        </span>
        <span class="category-manage-badge">#</span>
        <span class="category-manage-name" title="${escapeHtml(cat)}">${escapeHtml(cat)}</span>
        <span class="category-manage-count">${countLabel}</span>
      </div>
      <div class="category-manage-actions">
        <button type="button" class="btn-edit-category" title="${t('modal.categories.edit_title')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button type="button" class="btn-delete-category" title="${t('modal.categories.delete_title')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;

    // Category drag-and-drop reordering
    li.addEventListener('dragstart', (e) => {
      draggedCategoryName = cat;
      isDraggingCategory = true;
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', cat);
    });

    li.addEventListener('dragend', () => {
      isDraggingCategory = false;
      draggedCategoryName = null;
      li.classList.remove('dragging');
      categoriesManageList.querySelectorAll('.category-manage-item').forEach((item) => {
        item.classList.remove('drag-over');
      });
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedCategoryName && draggedCategoryName !== cat) {
        li.classList.add('drag-over');
      }
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over');
    });

    li.addEventListener('drop', async (e) => {
      e.preventDefault();
      li.classList.remove('drag-over');
      if (!draggedCategoryName || draggedCategoryName === cat) return;

      const currentCats = await PresetManager.getCategories();
      const fromIdx = currentCats.indexOf(draggedCategoryName);
      const toIdx = currentCats.indexOf(cat);
      if (fromIdx !== -1 && toIdx !== -1) {
        currentCats.splice(fromIdx, 1);
        currentCats.splice(toIdx, 0, draggedCategoryName);
        await PresetManager.setCategories(currentCats);
        await renderCategoriesManageList();
        await reloadProfiles();
        showToast(currentLang === 'id' ? 'Urutan kategori diperbarui' : 'Category order updated', 'info');
      }
    });

    // Edit Category Name button
    const editBtn = li.querySelector('.btn-edit-category');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        li.draggable = false;
        li.classList.add('editing');
        li.innerHTML = `
          <form class="category-inline-edit-form">
            <span class="category-manage-badge">#</span>
            <input type="text" class="category-inline-edit-input" value="${escapeHtml(cat)}" maxlength="20" required autocomplete="off" />
            <div class="category-inline-edit-btns">
              <button type="submit" class="btn-inline-save" title="${t('modal.categories.save_title')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button type="button" class="btn-inline-cancel" title="${t('modal.categories.cancel_title')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </form>
        `;

        const editInput = li.querySelector('.category-inline-edit-input');
        const editForm = li.querySelector('.category-inline-edit-form');
        const cancelBtn = li.querySelector('.btn-inline-cancel');

        if (editInput) {
          editInput.focus();
          editInput.select();
          editInput.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
              evt.preventDefault();
              renderCategoriesManageList();
            }
          });
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            renderCategoriesManageList();
          });
        }

        if (editForm) {
          editForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            const newName = editInput.value.trim();
            if (!newName) {
              showToast(t('toast.category_name_empty'), 'error');
              return;
            }
            if (newName.toLowerCase() === cat.toLowerCase() && newName === cat) {
              renderCategoriesManageList();
              return;
            }

            try {
              await PresetManager.renameCategory(cat, newName);
              showToast(t('toast.category_updated', { name: newName }), 'success');
              if (selectedWebsiteCategory.toLowerCase() === cat.toLowerCase()) {
                selectedWebsiteCategory = newName;
              }
              await renderCategoriesManageList();
              await reloadProfiles();
            } catch (err) {
              showToast(err.message, 'warning');
            }
          });
        }
      });
    }

    const delBtn = li.querySelector('.btn-delete-category');
    if (delBtn) {
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await PresetManager.deleteCategory(cat);
        showToast(t('toast.category_deleted', { name: cat }), 'info');
        if (selectedWebsiteCategory.toLowerCase() === cat.toLowerCase()) {
          selectedWebsiteCategory = 'all';
        }
        await renderCategoriesManageList();
        await reloadProfiles();
      });
    }

    categoriesManageList.appendChild(li);
  });
}

async function renderWebsitesDirectory(query = '') {
  profilesWebsitesView.classList.remove('hidden');
  profilesDetailView.classList.add('hidden');

  const allWebsites = await PresetManager.getWebsitesSummary(query, websiteSortMode);
  await renderWebsiteCategoryBar(allWebsites);

  if (query) {
    searchClearBtn.classList.remove('hidden');
  } else {
    searchClearBtn.classList.add('hidden');
  }

  let websites = allWebsites;
  if (selectedWebsiteCategory && selectedWebsiteCategory !== 'all') {
    if (selectedWebsiteCategory === '__none__') {
      websites = websites.filter((s) => !s.category);
    } else {
      websites = websites.filter((s) => (s.category || '').toLowerCase() === selectedWebsiteCategory.toLowerCase());
    }
  }

  if (websites.length === 0) {
    websitesList.innerHTML = '';
    viewWebsitesEmpty.classList.remove('hidden');
    return;
  }

  viewWebsitesEmpty.classList.add('hidden');
  websitesList.innerHTML = '';

  websites.forEach((site) => {
    const li = document.createElement('li');
    li.className = 'website-card';
    li.dataset.domain = site.domain;

    const titleToShow = site.displayName || site.domain;
    li.setAttribute('title', t('card.website.launch.title', { domain: titleToShow }));

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.domain)}&sz=32`;
    const hasCustomName = site.displayName && site.displayName.toLowerCase() !== site.domain.toLowerCase();

    li.innerHTML = `
      <span class="website-count-badge" title="${t('card.website.badge', { count: site.count })}">${site.count}</span>
      <div class="website-card-actions">
        <button class="btn-card-action btn-edit-website" title="${t('card.website.edit.title')}" data-domain="${escapeHtml(site.domain)}" data-name="${escapeHtml(titleToShow)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </div>
      <div class="website-icon-wrapper">
        <img class="website-favicon" src="${faviconUrl}" alt="${escapeHtml(site.domain)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="website-fallback-icon" style="display:none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
      </div>
      <span class="website-domain" title="${escapeHtml(titleToShow)}">${escapeHtml(titleToShow)}</span>
    `;

    // Edit button click
    const editBtn = li.querySelector('.btn-edit-website');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditWebsiteModal(site.domain, titleToShow, site.count);
      });
    }

    // Drag and drop reordering
    li.setAttribute('draggable', 'true');

    li.addEventListener('dragstart', (e) => {
      if (e.target.closest('button, input, textarea, select')) {
        e.preventDefault();
        return;
      }
      draggedWebsiteDomain = site.domain;
      isDraggingWebsite = true;
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', site.domain);
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      document.querySelectorAll('.website-card').forEach((c) => c.classList.remove('drag-over'));
      draggedWebsiteDomain = null;
      setTimeout(() => {
        isDraggingWebsite = false;
      }, 100);
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedWebsiteDomain && draggedWebsiteDomain !== site.domain) {
        li.classList.add('drag-over');
      }
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over');
    });

    li.addEventListener('drop', async (e) => {
      e.preventDefault();
      li.classList.remove('drag-over');
      if (!draggedWebsiteDomain || draggedWebsiteDomain === site.domain) return;

      const currentCards = Array.from(websitesList.querySelectorAll('.website-card'));
      const domains = currentCards.map((c) => c.dataset.domain);
      const fromIdx = domains.indexOf(draggedWebsiteDomain);
      const toIdx = domains.indexOf(site.domain);
      if (fromIdx !== -1 && toIdx !== -1) {
        domains.splice(fromIdx, 1);
        domains.splice(toIdx, 0, draggedWebsiteDomain);

        // Instant visual DOM update
        const draggedCard = websitesList.querySelector(`.website-card[data-domain="${draggedWebsiteDomain}"]`);
        if (draggedCard) {
          if (fromIdx < toIdx) {
            li.after(draggedCard);
          } else {
            li.before(draggedCard);
          }
        }

        await PresetManager.setWebsitesCustomOrder(domains);
        websiteSortMode = 'custom';
        await reloadProfiles();
        showToast(t('toast.website_order_saved'), 'info');
      }
    });

    // Click anywhere on website card to drill down to its cookie profiles
    li.addEventListener('click', () => {
      if (isDraggingWebsite) return;
      openWebsiteDetailView(site.domain, titleToShow);
    });

    websitesList.appendChild(li);
  });
}

/**
 * Transitions from Level 1 to Level 2 (Selected Website)
 * @param {string} domain
 * @param {string} [displayName]
 */
function openWebsiteDetailView(domain, displayName = null) {
  selectedWebsiteDomain = domain;
  searchInput.value = '';
  searchClearBtn.classList.add('hidden');
  updateSearchPlaceholder(displayName || domain);
  renderWebsiteDetailView(domain, '', displayName);
}

/**
 * Transitions from Level 2 back to Level 1 (All Websites)
 */
function backToWebsitesDirectory() {
  selectedWebsiteDomain = null;
  searchInput.value = '';
  searchClearBtn.classList.add('hidden');
  updateSearchPlaceholder();
  reloadProfiles();
}

/**
 * LEVEL 2: Renders the cookie profiles for the selected website
 * @param {string} domain
 * @param {string} query
 * @param {string} [displayName]
 */
async function renderWebsiteDetailView(domain, query = '', displayName = null) {
  profilesWebsitesView.classList.add('hidden');
  profilesDetailView.classList.remove('hidden');

  const names = await PresetManager.getWebsiteNames();
  const cleanTarget = (domain || '').toLowerCase().replace(/^\./, '').trim();
  const titleToShow = names[cleanTarget] || displayName || domain;

  if (detailWebsiteDomain) {
    detailWebsiteDomain.textContent = titleToShow;
  }
  if (detailWebsiteFavicon) {
    detailWebsiteFavicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
    detailWebsiteFavicon.onerror = () => {
      detailWebsiteFavicon.style.display = 'none';
    };
  }

  const profiles = await PresetManager.getProfilesForWebsite(domain, query);

  if (query) {
    searchClearBtn.classList.remove('hidden');
  } else {
    searchClearBtn.classList.add('hidden');
  }

  if (profiles.length === 0) {
    siteProfilesList.innerHTML = '';
    viewSiteProfilesEmpty.classList.remove('hidden');
    return;
  }

  viewSiteProfilesEmpty.classList.add('hidden');
  siteProfilesList.innerHTML = '';

  profiles.forEach((profile) => {
    const card = document.createElement('li');
    card.className = 'profile-card';
    card.dataset.id = profile.id;

    const cookieCount = Array.isArray(profile.cookies) ? profile.cookies.length : 0;
    const formattedDate = new Date(profile.createdAt || Date.now()).toLocaleDateString();
    const siteDomain = (profile.domain || selectedWebsiteDomain || '').replace(/^\./, '').trim();
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(siteDomain)}&sz=32`;

    card.setAttribute('title', t('card.profile.launch.title', { domain: siteDomain }));

    const hasNote = Boolean(profile.note && profile.note.trim());
    const noteTooltip = hasNote
      ? t('card.profile.note.has_title', { note: escapeHtml(profile.note.trim()) })
      : t('card.profile.note.title');

    card.innerHTML = `
      <div class="profile-card-left">
        <div class="profile-card-icon-wrap">
          <img class="profile-card-favicon" src="${faviconUrl}" alt="${escapeHtml(siteDomain)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="profile-card-fallback-icon" style="display:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
        </div>
        <div class="profile-card-info">
          <div class="profile-title-row">
            <span class="profile-title" title="${escapeHtml(profile.title)}">${escapeHtml(profile.title)}</span>
          </div>
          <div class="profile-meta">
            <span class="profile-meta-item">${t('card.profile.saved_at', { date: formattedDate })}</span>
          </div>
        </div>
      </div>
      <div class="profile-card-right">
        <button class="btn-profile-note ${hasNote ? 'has-note' : ''}" title="${noteTooltip}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          ${hasNote ? '<span class="note-indicator-dot"></span>' : ''}
        </button>
        <button class="btn-edit-profile" title="${t('card.profile.edit.title')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </div>
    `;

    // Drag and drop reordering for cookie profiles
    card.setAttribute('draggable', 'true');

    card.addEventListener('dragstart', (e) => {
      if (e.target.closest('button, input, textarea, select')) {
        e.preventDefault();
        return;
      }
      draggedProfileId = profile.id;
      isDraggingProfile = true;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', profile.id);
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.profile-card').forEach((c) => c.classList.remove('drag-over'));
      draggedProfileId = null;
      setTimeout(() => {
        isDraggingProfile = false;
      }, 100);
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedProfileId && draggedProfileId !== profile.id) {
        card.classList.add('drag-over');
      }
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', async (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      if (!draggedProfileId || draggedProfileId === profile.id) return;

      const currentCards = Array.from(siteProfilesList.querySelectorAll('.profile-card'));
      const profileIds = currentCards.map((c) => c.dataset.id).filter(Boolean);
      const fromIdx = profileIds.indexOf(draggedProfileId);
      const toIdx = profileIds.indexOf(profile.id);

      if (fromIdx !== -1 && toIdx !== -1) {
        profileIds.splice(fromIdx, 1);
        profileIds.splice(toIdx, 0, draggedProfileId);

        // Instant visual DOM update
        const draggedCard = siteProfilesList.querySelector(`.profile-card[data-id="${draggedProfileId}"]`);
        if (draggedCard) {
          if (fromIdx < toIdx) {
            card.after(draggedCard);
          } else {
            card.before(draggedCard);
          }
        }

        await PresetManager.setProfilesCustomOrder(selectedWebsiteDomain, profileIds);
        await reloadProfiles();
        showToast(t('toast.cookie_order_saved'), 'info');
      }
    });

    // Direct Launch & Apply: clicking the card itself applies cookies and opens the site!
    card.addEventListener('click', async (e) => {
      if (isDraggingProfile) return;
      if (e.target.closest('.btn-edit-profile')) return;
      await launchWebsiteWithProfile(profile);
    });

    // Edit Profile Button (Pencil Icon): Opens modal to edit name, cookies, and delete
        const noteBtn = card.querySelector('.btn-profile-note');
    if (noteBtn) {
      noteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProfileNoteModal(profile);
      });
    }

    const editBtn = card.querySelector('.btn-edit-profile');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditProfileModal(profile);
      });
    }

    siteProfilesList.appendChild(card);
  });
}

/**
 * KEY ACTION: Applies cookie and directs user to the website!
 * @param {object} profile
 */
async function launchWebsiteWithProfile(profile) {
  try {
    showToast(t('toast.activating_cookies', { domain: profile.domain }), 'info');

    const result = await PresetManager.applyAndLaunchWebsite(profile, currentTab);

    if (result.errors.length === 0) {
      showToast(t('toast.login_success', { domain: profile.domain, count: result.successCount }), 'success');
    } else {
      showToast(t('toast.cookies_applied', { success: result.successCount, failed: result.errors.length }), 'error');
    }

    // Refresh cookies list in background
    setTimeout(async () => {
      try {
        currentTab = await CookieManager.getActiveTab();
        await reloadCookies();
      } catch {
        // Tab might be navigating
      }
    }, 500);
  } catch (err) {
    console.error('Launch failed:', err);
    showToast(t('toast.open_site_error', { err: err.message }), 'error');
  }
}

/**
 * Toggles the floating settings dropdown
 */
function toggleSettingsDropdown() {
  if (!settingsDropdown) return;
  const isHidden = settingsDropdown.classList.contains('hidden');
  if (isHidden) {
    settingsDropdown.classList.remove('hidden');
  } else {
    closeSettingsDropdown();
  }
}

/**
 * Closes the floating settings dropdown
 */
function closeSettingsDropdown() {
  if (settingsDropdown && !settingsDropdown.classList.contains('hidden')) {
    settingsDropdown.classList.add('hidden');
  }
}

/**
 * Applies light or dark theme across the document
 */
function applyTheme(theme) {
  currentTheme = theme === 'dark' ? 'dark' : 'light';
  const isDark = currentTheme === 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.body.setAttribute('data-theme', currentTheme);
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);

  themeIconSun?.classList.toggle('hidden', isDark);
  themeIconMoon?.classList.toggle('hidden', !isDark);

  if (labelMenuTheme) {
    labelMenuTheme.textContent = isDark
      ? (currentLang === 'id' ? 'Mode Terang' : 'Light Mode')
      : (currentLang === 'id' ? 'Mode Gelap' : 'Dark Mode');
  }
  if (menuBtnTheme) {
    menuBtnTheme.title = isDark
      ? (currentLang === 'id' ? 'Beralih ke Mode Terang' : 'Switch to Light Mode')
      : (currentLang === 'id' ? 'Beralih ke Mode Gelap' : 'Switch to Dark Mode');
  }
}

/**
 * Updates search input placeholder based on current language and view state
 */
function updateSearchPlaceholder(customDisplayName = null) {
  if (!searchInput) return;
  const isId = currentLang === 'id';
  if (activeNavTab === 'cookies') {
    searchInput.placeholder = isId
      ? 'Cari nama cookie, domain, atau nilai...'
      : 'Search cookies by name, domain, or value...';
  } else if (selectedWebsiteDomain) {
    const target = customDisplayName || selectedWebsiteDomain;
    searchInput.placeholder = isId
      ? `Cari profil cookie di ${target}...`
      : `Search cookies in ${target}...`;
  } else {
    searchInput.placeholder = isId
      ? 'Cari website atau profil cookie...'
      : 'Search websites or cookie profiles...';
  }
}

/**
 * Applies language (id / en) across all settings and UI labels
 */

function updateSourceCurrentLabel() {
  const labelEl = document.getElementById('label-source-current');
  if (labelEl) {
    const count = (allCookies && allCookies.length) || 0;
    const isId = currentLang === 'id';
    labelEl.innerHTML = isId
      ? `Cookie Tab Aktif (<strong id="source-current-count">${count}</strong> item)`
      : `Active Tab Cookies (<strong id="source-current-count">${count}</strong> item${count === 1 ? '' : 's'})`;
  }
}

function updateDeleteAllModalText() {
  const deleteDescEl = document.getElementById('delete-all-desc');
  if (deleteDescEl) {
    const isId = currentLang === 'id';
    const targetDomain = (currentTab && currentTab.domain) || (currentTab && currentTab.url) || (isId ? 'website ini' : 'this site');
    deleteDescEl.innerHTML = isId
      ? `Yakin ingin menghapus semua cookie untuk <span class="confirm-target-badge" id="delete-domain-name">${escapeHtml(targetDomain)}</span>?`
      : `Are you sure you want to delete all cookies for <span class="confirm-target-badge" id="delete-domain-name">${escapeHtml(targetDomain)}</span>?`;
  }
}

function applyLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'id';
  setLanguage(currentLang);
  const isId = currentLang === 'id';

  // 1. Translate all static HTML elements with data-i18n attributes
  applyDOMTranslations(currentLang);

  // 2. Settings menu dynamic labels
  if (labelMenuTheme) {
    if (currentTheme === 'dark') {
      labelMenuTheme.textContent = isId ? 'Mode Terang' : 'Light Mode';
    } else {
      labelMenuTheme.textContent = isId ? 'Mode Gelap' : 'Dark Mode';
    }
  }

  // 3. Update dynamic search placeholder
  updateSearchPlaceholder();

  // 4. Update website delete count hint if present
  if (deleteWebsiteCountHint && deleteWebsiteCountHint.dataset.count) {
    const count = parseInt(deleteWebsiteCountHint.dataset.count, 10);
    deleteWebsiteCountHint.textContent = count > 0
      ? (isId ? `Semua (${count}) profil cookie di website ini akan ikut terhapus.` : `All (${count}) cookie profile${count > 1 ? 's' : ''} in this website will also be deleted.`)
      : (isId ? 'Website ini tidak memiliki profil cookie tersimpan.' : 'This website has no saved cookie profiles.');
  }

  const deleteWebConfirmP = document.getElementById('delete-website-confirm-text');
  if (deleteWebConfirmP && deleteWebConfirmP.dataset.name) {
    const targetName = deleteWebConfirmP.dataset.name;
    deleteWebConfirmP.innerHTML = isId
      ? `Yakin ingin menghapus website <span class="confirm-target-badge" id="delete-website-name-target">${escapeHtml(targetName)}</span> dari daftar?`
      : `Are you sure you want to delete website <span class="confirm-target-badge" id="delete-website-name-target">${escapeHtml(targetName)}</span> from the list?`;
  }

  const deleteProfConfirmP = document.getElementById('delete-profile-confirm-text');
  if (deleteProfConfirmP && deleteProfConfirmP.dataset.title) {
    const targetTitle = deleteProfConfirmP.dataset.title;
    deleteProfConfirmP.innerHTML = isId
      ? `Yakin ingin menghapus profil <span class="confirm-target-badge" id="delete-profile-name-target">${escapeHtml(targetTitle)}</span>?`
      : `Are you sure you want to delete profile <span class="confirm-target-badge" id="delete-profile-name-target">${escapeHtml(targetTitle)}</span>?`;
  }

  updateDeleteAllModalText();
  updateSourceCurrentLabel();

  // 5. If sort dropdown is open, re-render sort options with updated language
  if (sortDropdown && !sortDropdown.classList.contains('hidden')) {
    renderSortOptions();
  }

  // 6. Re-render active views so cards, badges, and tooltips update in real-time
  if (activeNavTab === 'cookies') {
    filterAndRenderCookies();
    if (cookieCounter) {
      cookieCounter.textContent = `${filteredCookies.length} ${isId ? 'cookie' : (filteredCookies.length === 1 ? 'cookie' : 'cookies')}`;
    }
  } else if (activeNavTab === 'profiles') {
    if (selectedWebsiteDomain) {
      const q = searchInput ? (searchInput.value || '').trim() : '';
      renderWebsiteDetailView(selectedWebsiteDomain, q);
    } else {
      reloadProfiles();
    }
  }
}

/**
 * Switches between 'cookies' and 'profiles' tabs
 * @param {'cookies' | 'profiles'} tabName
 */

/**
 * Toggles the sort options dropdown
 */
function toggleSortDropdown() {
  if (!sortDropdown) return;
  const isHidden = sortDropdown.classList.contains('hidden');
  if (isHidden) {
    closeSettingsDropdown();
    renderSortOptions();
    sortDropdown.classList.remove('hidden');
    btnSortToggle?.classList.add('active');
  } else {
    closeSortDropdown();
  }
}

/**
 * Closes the sort options dropdown
 */
function closeSortDropdown() {
  if (sortDropdown && !sortDropdown.classList.contains('hidden')) {
    sortDropdown.classList.add('hidden');
    btnSortToggle?.classList.remove('active');
  }
}

/**
 * Populates sort menu options depending on the active view
 */
function renderSortOptions() {
  if (!sortOptionsList) return;
  sortOptionsList.innerHTML = '';

  let options = [];
  let currentSort = 'custom';
  const isId = currentLang === 'id';

  if (activeNavTab === 'profiles') {
    currentSort = websiteSortMode;
    options = [
      {
        id: 'custom',
        label: isId ? 'Urutan Bebas (Drag & Drop)' : 'Custom Order (Drag & Drop)',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="9" cy="19" r="1.2"/><circle cx="15" cy="5" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="15" cy="19" r="1.2"/></svg>`
      },
      {
        id: 'name-asc',
        label: isId ? 'Nama Website: A → Z' : 'Website Name: A → Z',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/></svg>`
      },
      {
        id: 'name-desc',
        label: isId ? 'Nama Website: Z → A' : 'Website Name: Z → A',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5h4M11 9h7M11 13h10M3 7l3-3 3 3M6 6v14"/></svg>`
      },
      {
        id: 'count',
        label: isId ? 'Jumlah Profil Terbanyak' : 'Most Profiles Count',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
      },
      {
        id: 'recent',
        label: isId ? 'Terakhir Diperbarui' : 'Recently Updated',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
      }
    ];
  } else {
    currentSort = cookieSortMode;
    options = [
      {
        id: 'custom',
        label: isId ? 'Urutan Bebas (Drag & Drop)' : 'Custom Order (Drag & Drop)',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="9" cy="19" r="1.2"/><circle cx="15" cy="5" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="15" cy="19" r="1.2"/></svg>`
      },
      {
        id: 'name-asc',
        label: isId ? 'Nama Cookie: A → Z' : 'Cookie Name: A → Z',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/></svg>`
      },
      {
        id: 'name-desc',
        label: isId ? 'Nama Cookie: Z → A' : 'Cookie Name: Z → A',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5h4M11 9h7M11 13h10M3 7l3-3 3 3M6 6v14"/></svg>`
      },
      {
        id: 'domain',
        label: isId ? 'Domain: A → Z' : 'Domain: A → Z',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
      },
      {
        id: 'expiry',
        label: isId ? 'Waktu Kedaluwarsa' : 'Expiration Date',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
      }
    ];
  }

  options.forEach((opt) => {
    const isSelected = opt.id === currentSort;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `sort-option-item ${isSelected ? 'selected' : ''}`;
    btn.innerHTML = `
      <div class="sort-option-left">
        <span class="sort-option-icon">${opt.icon}</span>
        <span class="sort-option-label">${escapeHtml(opt.label)}</span>
      </div>
      ${isSelected ? `
        <span class="sort-option-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      ` : ''}
    `;
    btn.addEventListener('click', async () => {
      closeSortDropdown();
      if (activeNavTab === 'profiles') {
        websiteSortMode = opt.id;
        await reloadProfiles();
        showToast(isId ? `Urutan: ${opt.label}` : `Sorted: ${opt.label}`, 'info');
      } else {
        cookieSortMode = opt.id;
        filterAndRenderCookies();
        showToast(isId ? `Urutan: ${opt.label}` : `Sorted: ${opt.label}`, 'info');
      }
    });
    sortOptionsList.appendChild(btn);
  });
}

function switchNavTab(tabName) {
  activeNavTab = tabName;
  closeSettingsDropdown();
  closeSortDropdown();

  if (tabName === 'cookies') {
    navBtnCookies.classList.add('active');
    navBtnProfiles.classList.remove('active');
    paneCookies.classList.remove('hidden');
    paneProfiles.classList.add('hidden');
    footerCookies.classList.remove('hidden');
    if (siteInfo) siteInfo.classList.remove('hidden');
    const appFooterBar = document.getElementById('app-footer-bar');
    if (appFooterBar) appFooterBar.classList.add('hidden');
    updateSearchPlaceholder();
    filterAndRenderCookies();
  } else {
    navBtnProfiles.classList.add('active');
    navBtnCookies.classList.remove('active');
    paneProfiles.classList.remove('hidden');
    paneCookies.classList.add('hidden');
    footerCookies.classList.add('hidden');
    if (siteInfo) siteInfo.classList.add('hidden');
    const appFooterBar = document.getElementById('app-footer-bar');
    if (appFooterBar) appFooterBar.classList.remove('hidden');
    updateSearchPlaceholder();
    reloadProfiles();
  }
}

/**
 * Filters and renders cookies for the active tab
 */
function filterAndRenderCookies() {
  if (!currentTab || !currentTab.isSupported) {
    showUnsupportedState(currentTab ? currentTab.url : 'Restricted Page');
    return;
  }

  if (viewUnsupported) {
    viewUnsupported.classList.add('hidden');
  }

  const query = (searchInput.value || '').trim().toLowerCase();

  if (query) {
    searchClearBtn.classList.remove('hidden');
    filteredCookies = allCookies.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const value = (c.value || '').toLowerCase();
      const domain = (c.domain || '').toLowerCase();
      return name.includes(query) || value.includes(query) || domain.includes(query);
    });
  } else {
    searchClearBtn.classList.add('hidden');
    filteredCookies = [...allCookies];
  }

  // Apply sorting if specified
  if (cookieSortMode === 'name-asc') {
    filteredCookies.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (cookieSortMode === 'name-desc') {
    filteredCookies.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  } else if (cookieSortMode === 'domain') {
    filteredCookies.sort((a, b) => (a.domain || '').localeCompare(b.domain || ''));
  } else if (cookieSortMode === 'expiry') {
    filteredCookies.sort((a, b) => (a.expirationDate || 9999999999) - (b.expirationDate || 9999999999));
  }

  cookieCounter.textContent = `${filteredCookies.length} ${currentLang === 'id' ? 'cookie' : (filteredCookies.length === 1 ? 'cookie' : 'cookies')}`;

  if (filteredCookies.length === 0) {
    cookieList.innerHTML = '';
    viewEmpty.classList.remove('hidden');
  } else {
    viewEmpty.classList.add('hidden');
    renderCookieList(filteredCookies);
  }
}

/**
 * Renders the cookie cards inside the list
 * @param {Array<object>} cookies
 */
function renderCookieList(cookies) {
  cookieList.innerHTML = '';
  cookies.forEach((cookie, index) => {
    const card = createCookieCard(cookie, index);
    cookieList.appendChild(card);
  });
}

/**
 * Creates DOM node for a single cookie card
 * @param {object} cookie
 * @param {number} index
 * @returns {HTMLElement}
 */
function createCookieCard(cookie, index) {
  const li = document.createElement('li');
  li.className = 'cookie-card';
  li.dataset.cookieName = cookie.name;

  const expirationFormatted = formatExpirationForDisplay(cookie);
  const expirationInputVal = formatTimestampForInput(cookie.expirationDate);

  li.innerHTML = `
    <div class="cookie-header">
      <div class="cookie-header-left">
        <svg class="cookie-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="cookie-name" title="${escapeHtml(cookie.name)}">${escapeHtml(cookie.name)}</span>
      </div>
      <div class="cookie-badges">
        ${cookie.session ? `<span class="badge session">${t('cookie.badge.session')}</span>` : `<span class="badge" title="${t('cookie.badge.expires_at', { date: escapeHtml(expirationFormatted) })}">${t('cookie.badge.exp')}</span>`}
        ${cookie.secure ? `<span class="badge secure">${t('cookie.badge.secure')}</span>` : ''}
        ${cookie.httpOnly ? `<span class="badge httponly">${t('cookie.badge.httponly')}</span>` : ''}
      </div>
    </div>

    <div class="cookie-body hidden">
      <form class="cookie-form-grid">
        <div class="field-group full">
          <label>${t('cookie.field.name')} <span class="req">*</span></label>
          <input type="text" name="name" value="${escapeHtml(cookie.name)}" required />
        </div>

        <div class="field-group full">
          <label>${t('cookie.field.value')}</label>
          <textarea name="value" rows="3">${escapeHtml(cookie.value || '')}</textarea>
        </div>

        <div class="field-group half">
          <label>${t('cookie.field.domain')}</label>
          <input type="text" name="domain" value="${escapeHtml(cookie.domain || '')}" />
        </div>

        <div class="field-group half">
          <label>${t('cookie.field.path')}</label>
          <input type="text" name="path" value="${escapeHtml(cookie.path || '/')}" />
        </div>

        <div class="field-group half">
          <label>${t('cookie.field.samesite')}</label>
          <select name="sameSite">
            <option value="lax" ${cookie.sameSite === 'lax' ? 'selected' : ''}>${t('cookie.field.samesite.lax')}</option>
            <option value="strict" ${cookie.sameSite === 'strict' ? 'selected' : ''}>${t('cookie.field.samesite.strict')}</option>
            <option value="no_restriction" ${cookie.sameSite === 'no_restriction' ? 'selected' : ''}>${t('cookie.field.samesite.none')}</option>
          </select>
        </div>

        <div class="field-group half">
          <label>${t('cookie.field.expiration')}</label>
          <input type="datetime-local" name="expiration" value="${expirationInputVal}" ${cookie.session ? 'disabled' : ''} />
        </div>

        <div class="checkboxes-row full">
          <label class="custom-checkbox">
            <input type="checkbox" name="session" ${cookie.session ? 'checked' : ''} />
            <span>${t('cookie.checkbox.session')}</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" name="hostOnly" ${cookie.hostOnly ? 'checked' : ''} />
            <span>${t('cookie.checkbox.hostonly')}</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" name="secure" ${cookie.secure ? 'checked' : ''} />
            <span>${t('cookie.checkbox.secure')}</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" name="httpOnly" ${cookie.httpOnly ? 'checked' : ''} />
            <span>${t('cookie.checkbox.httponly')}</span>
          </label>
        </div>

        <div class="cookie-card-actions full">
          <button type="button" class="btn btn-danger btn-sm btn-delete-card">${t('cookie.btn.delete')}</button>
          <button type="button" class="btn btn-secondary btn-sm btn-copy-val">${t('cookie.btn.copy')}</button>
          <button type="submit" class="btn btn-primary btn-sm">${t('cookie.btn.save')}</button>
        </div>
      </form>
    </div>
  `;

  // Drag and drop reordering for active cookies
  li.setAttribute('draggable', 'true');

  li.addEventListener('dragstart', (e) => {
    if (e.target.closest('button, input, textarea, select, .cookie-body')) {
      e.preventDefault();
      return;
    }
    draggedCookieName = cookie.name;
    isDraggingCookie = true;
    li.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cookie.name);
  });

  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    document.querySelectorAll('.cookie-card').forEach((c) => c.classList.remove('drag-over'));
    draggedCookieName = null;
    setTimeout(() => {
      isDraggingCookie = false;
    }, 100);
  });

  li.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedCookieName && draggedCookieName !== cookie.name) {
      li.classList.add('drag-over');
    }
  });

  li.addEventListener('dragleave', () => {
    li.classList.remove('drag-over');
  });

  li.addEventListener('drop', (e) => {
    e.preventDefault();
    li.classList.remove('drag-over');
    if (!draggedCookieName || draggedCookieName === cookie.name) return;

    const fromIdx = filteredCookies.findIndex((c) => c.name === draggedCookieName);
    const toIdx = filteredCookies.findIndex((c) => c.name === cookie.name);

    if (fromIdx !== -1 && toIdx !== -1) {
      const [movedItem] = filteredCookies.splice(fromIdx, 1);
      filteredCookies.splice(toIdx, 0, movedItem);

      // Keep allCookies in sync if present
      const allFromIdx = allCookies.findIndex((c) => c.name === draggedCookieName);
      const allToIdx = allCookies.findIndex((c) => c.name === cookie.name);
      if (allFromIdx !== -1 && allToIdx !== -1) {
        const [allMoved] = allCookies.splice(allFromIdx, 1);
        allCookies.splice(allToIdx, 0, allMoved);
      }

      cookieSortMode = 'custom';
      renderCookieList(filteredCookies);
      showToast(t('toast.cookie_order_updated'), 'info');
    }
  });

  // Toggle Accordion
  const header = li.querySelector('.cookie-header');
  const body = li.querySelector('.cookie-body');
  const form = li.querySelector('form');
  const sessionCheckbox = form.querySelector('input[name="session"]');
  const expirationInput = form.querySelector('input[name="expiration"]');

  header.addEventListener('click', () => {
    if (isDraggingCookie) return;
    const isExpanded = li.classList.toggle('expanded');
    body.classList.toggle('hidden', !isExpanded);
    li.setAttribute('draggable', isExpanded ? 'false' : 'true');
    if (isExpanded) {
      setTimeout(() => {
        li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  });

  sessionCheckbox.addEventListener('change', (e) => {
    expirationInput.disabled = e.target.checked;
    if (!e.target.checked && !expirationInput.value) {
      const nextMonth = new Date(Date.now() + 30 * 86400 * 1000);
      expirationInput.value = formatTimestampForInput(nextMonth.getTime() / 1000);
    }
  });

  // Form delete button
  const deleteBtn = li.querySelector('.btn-delete-card');
  deleteBtn.addEventListener('click', async () => {
    await handleDeleteCookie(cookie);
  });

  // Copy Value button
  const copyValBtn = li.querySelector('.btn-copy-val');
  copyValBtn.addEventListener('click', () => {
    const val = form.querySelector('textarea[name="value"]').value;
    navigator.clipboard.writeText(val).then(() => {
      showToast(t('toast.copied_value', { name: cookie.name }), 'success');
    });
  });

  // Save changes form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = form.querySelector('input[name="name"]').value.trim();
    const newValue = form.querySelector('textarea[name="value"]').value;
    const newDomain = form.querySelector('input[name="domain"]').value.trim();
    const newPath = form.querySelector('input[name="path"]').value.trim();
    const newSameSite = form.querySelector('select[name="sameSite"]').value;
    const isSession = form.querySelector('input[name="session"]').checked;
    const isHostOnly = form.querySelector('input[name="hostOnly"]').checked;
    const isSecure = form.querySelector('input[name="secure"]').checked;
    const isHttpOnly = form.querySelector('input[name="httpOnly"]').checked;

    let expirationDate = null;
    if (!isSession) {
      const expVal = form.querySelector('input[name="expiration"]').value;
      if (expVal) {
        expirationDate = Math.round(new Date(expVal).getTime() / 1000);
      }
    }

    const updatedData = {
      name: newName,
      value: newValue,
      domain: newDomain,
      path: newPath,
      sameSite: newSameSite,
      session: isSession,
      expirationDate: expirationDate,
      hostOnly: isHostOnly,
      secure: isSecure,
      httpOnly: isHttpOnly,
      storeId: cookie.storeId || currentTab.cookieStoreId
    };

    try {
      await CookieManager.saveCookie(updatedData, currentTab.url, cookie.name, cookie.hostOnly);
      showToast(t('toast.cookie_saved', { name: newName }), 'success');
      await reloadCookies();
    } catch (err) {
      console.error(err);
      showToast(t('toast.save_failed', { err: err.message }), 'error');
    }
  });

  return li;
}

/**
 * Handles single cookie deletion
 * @param {string|object} cookieOrName
 */
async function handleDeleteCookie(cookieOrName) {
  const name = typeof cookieOrName === 'string' ? cookieOrName : cookieOrName.name;
  try {
    await CookieManager.deleteCookie(cookieOrName, currentTab.url, currentTab.cookieStoreId);
    showToast(t('toast.cookie_deleted', { name: name }), 'success');
    await reloadCookies();
  } catch (err) {
    console.error(err);
    showToast(t('toast.delete_failed', { err: err.message }), 'error');
  }
}

/**
 * Opens the View/Inspect Profile modal
 * @param {object} profile
 */
function openViewProfileModal(profile) {
  currentViewProfile = profile;
  currentViewProfileFormat = 'json';

  viewProfileTitle.textContent = profile.title;
  viewProfileDomain.textContent = profile.domain;
  const pCount = (profile.cookies || []).length;
  viewProfileCount.textContent = `${pCount} ${currentLang === 'id' ? 'cookie' : (pCount === 1 ? 'cookie' : 'cookies')}`;
  viewProfileDate.textContent = t('modal.view_profile.saved_at', { date: new Date(profile.createdAt || Date.now()).toLocaleDateString() });

  document.querySelectorAll('.view-profile-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.format === 'json');
  });

  updateViewProfileContent();
  openModal(modalViewProfile);
}

/**
 * Updates text content inside View Profile modal according to active tab format
 */
function updateViewProfileContent() {
  if (!currentViewProfile) return;
  const cookies = currentViewProfile.cookies || [];

  if (currentViewProfileFormat === 'json') {
    viewProfileContent.value = JSONFormatter.format(cookies);
  } else if (currentViewProfileFormat === 'header') {
    viewProfileContent.value = HeaderStringFormatter.format(cookies);
  } else if (currentViewProfileFormat === 'netscape') {
    viewProfileContent.value = NetscapeFormatter.format(cookies);
  }
}

/**
 * Opens Save/Create Profile Modal
 * @param {'current' | 'custom'} mode
 * @param {string} [presetDomain]
 */
function openSaveProfileModal(mode = 'current', presetDomain = null) {
  formSaveProfile.reset();
  profileEditId.value = '';

  if (mode === 'current' && (!currentTab || !currentTab.isSupported || allCookies.length === 0)) {
    mode = 'custom';
    showToast(t('toast.tab_no_cookies'), 'info');
  }

  const targetDomain = presetDomain || (selectedWebsiteDomain || currentTab?.domain || '');

  if (targetDomain) {
    profileDomainInput.value = targetDomain;
    if (mode === 'current') {
      profileNameInput.value = `${targetDomain} - Profile ${allProfiles.length + 1}`;
    }
  }

  sourceCurrentCount.textContent = `${allCookies.length}`;

  if (mode === 'current') {
    sourceCurrentTab.checked = true;
    profileCustomBox.classList.add('hidden');
    profileCustomCookies.required = false;
  } else {
    sourceCustomPaste.checked = true;
    profileCustomBox.classList.remove('hidden');
    profileCustomCookies.required = true;
  }

  openModal(modalSaveProfile);
  setTimeout(() => profileNameInput.focus(), 100);
}

/**
 * Sets up all UI event handlers
 */
function setupEventListeners() {
  // Navigation tabs
  navBtnCookies.addEventListener('click', () => switchNavTab('cookies'));
  navBtnProfiles.addEventListener('click', () => switchNavTab('profiles'));

  // Sort button toggle & outside click
  if (btnSortToggle) {
    btnSortToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSortDropdown();
    });
  }

  document.addEventListener('click', (e) => {
    if (
      sortDropdown &&
      !sortDropdown.classList.contains('hidden') &&
      !sortDropdown.contains(e.target) &&
      !btnSortToggle?.contains(e.target)
    ) {
      closeSortDropdown();
    }
  });

  // Settings button toggle & outside click
  if (btnSettingsToggle) {
    btnSettingsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettingsDropdown();
    });
  }

  document.addEventListener('click', (e) => {
    if (
      settingsDropdown &&
      !settingsDropdown.classList.contains('hidden') &&
      !settingsDropdown.contains(e.target) &&
      !btnSettingsToggle?.contains(e.target)
    ) {
      closeSettingsDropdown();
    }
  });

  // Floating Settings Menu Items
  if (menuBtnSaveCurrent) {
    menuBtnSaveCurrent.addEventListener('click', () => {
      closeSettingsDropdown();
      openSaveProfileModal('current');
    });
  }

  if (menuBtnNewProfile) {
    menuBtnNewProfile.addEventListener('click', () => {
      closeSettingsDropdown();
      openSaveProfileModal('custom');
    });
  }

  if (menuBtnExport) {
    menuBtnExport.addEventListener('click', () => {
      closeSettingsDropdown();
      if (allProfiles.length === 0) {
        showToast(t('toast.no_profiles_export'), 'info');
        return;
      }

      const jsonText = JSON.stringify(allProfiles, null, 2);
      const blob = new Blob([jsonText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unxnow-cookie-profiles-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t('toast.exported_profiles', { count: allProfiles.length }), 'success');
    });
  }

  if (menuBtnImport) {
    menuBtnImport.addEventListener('click', () => {
      closeSettingsDropdown();
      inputRestoreProfiles.click();
    });
  }

  if (menuBtnTheme) {
    menuBtnTheme.addEventListener('click', async () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      try {
        await chrome.storage.local.set({ unxnow_theme_v1: currentTheme });
      } catch (err) {
        console.warn('Could not save theme preference:', err);
      }
      closeSettingsDropdown();
      showToast(
        currentTheme === 'dark'
          ? (currentLang === 'id' ? 'Mode Gelap diaktifkan' : 'Dark Mode activated')
          : (currentLang === 'id' ? 'Mode Terang diaktifkan' : 'Light Mode activated'),
        'info'
      );
    });
  }

  if (menuBtnLanguage) {
    menuBtnLanguage.addEventListener('click', async () => {
      currentLang = currentLang === 'id' ? 'en' : 'id';
      applyLanguage(currentLang);
      try {
        await chrome.storage.local.set({ unxnow_lang_v1: currentLang });
      } catch (err) {
        console.warn('Could not save language preference:', err);
      }
      closeSettingsDropdown();
      showToast(
        currentLang === 'id' ? 'Bahasa: Indonesia' : 'Language: English',
        'info'
      );
      await reloadProfiles();
    });
  }

  if (menuBtnCategories) {
    menuBtnCategories.addEventListener('click', () => {
      openCategoriesModal();
    });
  }

  // Horizontal mouse-wheel scroll & drag-to-scroll for Category Bar
  if (websiteCategoryBar) {
    websiteCategoryBar.addEventListener(
      'wheel',
      (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          websiteCategoryBar.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );

    websiteCategoryBar.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isCategoryBarDown = true;
      categoryBarHasMoved = false;
      categoryBarStartX = e.pageX - websiteCategoryBar.offsetLeft;
      categoryBarScrollLeft = websiteCategoryBar.scrollLeft;
      websiteCategoryBar.classList.add('grabbing');
    });

    window.addEventListener('mouseup', () => {
      if (!isCategoryBarDown) return;
      isCategoryBarDown = false;
      websiteCategoryBar.classList.remove('grabbing');
      setTimeout(() => {
        categoryBarHasMoved = false;
      }, 50);
    });

    websiteCategoryBar.addEventListener('mousemove', (e) => {
      if (!isCategoryBarDown) return;
      const x = e.pageX - websiteCategoryBar.offsetLeft;
      const walk = x - categoryBarStartX;
      if (Math.abs(walk) > 4) {
        categoryBarHasMoved = true;
        e.preventDefault();
        websiteCategoryBar.scrollLeft = categoryBarScrollLeft - walk;
      }
    });

    websiteCategoryBar.addEventListener(
      'click',
      (e) => {
        if (categoryBarHasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  if (formAddCategory) {
    formAddCategory.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catName = inputNewCategory ? inputNewCategory.value.trim() : '';
      if (!catName) {
        showToast(t('toast.category_name_empty'), 'error');
        return;
      }
      try {
        const existing = await PresetManager.getCategories();
        if (existing.some((c) => c.toLowerCase() === catName.toLowerCase())) {
          showToast(t('toast.category_exists', { name: catName }), 'warning');
          return;
        }
        await PresetManager.addCategory(catName);
        if (inputNewCategory) inputNewCategory.value = '';
        showToast(t('toast.category_added', { name: catName }), 'success');
        await renderCategoriesManageList();
        await reloadProfiles();
      } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
      }
    });
  }

  if (menuBtnAbout) {
    menuBtnAbout.addEventListener('click', () => {
      closeSettingsDropdown();
      if (modalAbout) {
        openModal(modalAbout);
      }
    });
  }

  // Search input
  searchInput.addEventListener('input', () => {
    if (activeNavTab === 'cookies') {
      filterAndRenderCookies();
    } else {
      reloadProfiles();
    }
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    if (activeNavTab === 'cookies') {
      filterAndRenderCookies();
    } else {
      reloadProfiles();
    }
    searchInput.focus();
  });

  // Level 2 Back button (Return to all websites)
  btnBackToWebsites.addEventListener('click', backToWebsitesDirectory);

  // Buttons to open Save Profile modal in empty state
  btnEmptySaveSite.addEventListener('click', () => openSaveProfileModal('current'));
  btnEmptyCreateSite.addEventListener('click', () => openSaveProfileModal('custom'));

  // Add profile inside Level 2 view
  btnAddProfileForSite.addEventListener('click', () => {
    openSaveProfileModal('custom', selectedWebsiteDomain);
  });
  btnSiteAddFirstProfile.addEventListener('click', () => {
    openSaveProfileModal('custom', selectedWebsiteDomain);
  });

  // Source radio toggle inside Save Profile modal
  sourceCurrentTab.addEventListener('change', () => {
    profileCustomBox.classList.add('hidden');
    profileCustomCookies.required = false;
  });

  sourceCustomPaste.addEventListener('change', () => {
    profileCustomBox.classList.remove('hidden');
    profileCustomCookies.required = true;
    profileCustomCookies.focus();
  });

  // Save Profile form submit
  formSaveProfile.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = profileNameInput.value.trim().slice(0, 50);
    const domain = profileDomainInput.value.trim().slice(0, 100);
    const isCurrentSource = sourceCurrentTab.checked;
    let cookiesToSave = [];

    if (isCurrentSource) {
      if (!allCookies || allCookies.length === 0) {
        showToast(t('toast.no_cookies_save'), 'error');
        return;
      }
      cookiesToSave = [...allCookies];
    } else {
      const rawText = profileCustomCookies.value.trim();
      if (!rawText) {
        showToast(t('toast.paste_cookie_data'), 'error');
        return;
      }
      try {
        cookiesToSave = autoDetectAndParse(rawText);
      } catch (err) {
        showToast(t('toast.parse_error', { err: err.message }), 'error');
        return;
      }
    }

    try {
      await PresetManager.savePreset({
        title,
        domain,
        cookies: cookiesToSave
      });

      closeModal(modalSaveProfile);
      showToast(t('toast.profile_saved', { title }), 'success');

      // Switch to profiles tab and drill into that domain
      switchNavTab('profiles');
      openWebsiteDetailView(domain);
    } catch (err) {
      showToast(`Save failed: ${err.message}`, 'error');
    }
  });



  inputRestoreProfiles.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        let importedCount = 0;

        for (const item of list) {
          if (item.title && item.domain && Array.isArray(item.cookies)) {
            await PresetManager.savePreset(item);
            importedCount++;
          }
        }

        await reloadProfiles();
        showToast(t('toast.profiles_restored', { count: importedCount }), 'success');
      } catch (err) {
        showToast(t('toast.restore_failed', { err: err.message }), 'error');
      } finally {
        inputRestoreProfiles.value = '';
      }
    };
    reader.readAsText(file);
  });

  // View Profile Modal tab format switcher
  document.querySelectorAll('.view-profile-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.view-profile-tab').forEach((t) => t.classList.remove('active'));
      e.target.classList.add('active');
      currentViewProfileFormat = e.target.dataset.format;
      updateViewProfileContent();
    });
  });

  // Copy from View Profile Modal
  btnCopyViewProfile.addEventListener('click', () => {
    if (!viewProfileContent.value) return;
    navigator.clipboard.writeText(viewProfileContent.value).then(() => {
      showToast(t('toast.copied_profile_cookies', { format: currentViewProfileFormat.toUpperCase() }), 'success');
    });
  });

  // Apply directly from View Profile Modal
  btnApplyFromModal.addEventListener('click', async () => {
    if (!currentViewProfile) return;
    closeModal(modalViewProfile);
    await launchWebsiteWithProfile(currentViewProfile);
  });

  // Edit Website Name Form Submit
  if (formEditWebsite) {
    formEditWebsite.addEventListener('submit', async (e) => {
      e.preventDefault();
      const domain = editWebsiteDomain.value.trim();
      const newName = editWebsiteName.value.trim().slice(0, 30);
      const newCategory = editWebsiteCategory ? editWebsiteCategory.value.trim() : '';
      if (!domain) return;

      try {
        await PresetManager.setWebsiteName(domain, newName);
        await PresetManager.setWebsiteCategory(domain, newCategory);
        closeModal(modalEditWebsite);
        showToast(t('toast.website_updated', { name: newName || domain }), 'success');
        await reloadProfiles();
        if (detailWebsiteDomain && selectedWebsiteDomain === domain) {
          detailWebsiteDomain.textContent = newName || domain;
        }
      } catch (err) {
        showToast(t('toast.save_failed', { err: err.message }), 'error');
      }
    });
  }

  // Custom Category Select Trigger Toggle
  const categorySelectTrigger = document.getElementById('category-select-trigger');
  const categorySelectDropdown = document.getElementById('category-options-dropdown');
  if (categorySelectTrigger && categorySelectDropdown) {
    categorySelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = categorySelectDropdown.classList.contains('hidden');
      if (isHidden) {
        categorySelectDropdown.classList.remove('hidden');
        categorySelectTrigger.classList.add('active');
        categorySelectTrigger.setAttribute('aria-expanded', 'true');
      } else {
        categorySelectDropdown.classList.add('hidden');
        categorySelectTrigger.classList.remove('active');
        categorySelectTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#custom-category-select')) {
        categorySelectDropdown.classList.add('hidden');
        categorySelectTrigger.classList.remove('active');
        categorySelectTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reset Website Name Button
  if (btnResetWebsiteName) {
    btnResetWebsiteName.addEventListener('click', async () => {
      const domain = editWebsiteDomain.value.trim();
      if (!domain) return;

      try {
        await PresetManager.setWebsiteName(domain, null);
        closeModal(modalEditWebsite);
        showToast(t('toast.website_reset', { domain }), 'info');
        await reloadProfiles();
        if (detailWebsiteDomain && selectedWebsiteDomain === domain) {
          detailWebsiteDomain.textContent = domain;
        }
      } catch (err) {
        showToast(t('toast.save_failed', { err: err.message }), 'error');
      }
    });
  }

  // Delete website button from Edit Website Modal (triggers confirm modal)
  if (btnDeleteWebsiteModal) {
    btnDeleteWebsiteModal.addEventListener('click', () => {
      const domain = editWebsiteDomain.value.trim();
      const currentName = editWebsiteName.value.trim();
      const count = Number(editWebsiteDomain.dataset.count) || 0;
      if (!domain) return;
      closeModal(modalEditWebsite);
      openDeleteWebsiteModal(domain, currentName, count);
    });
  }

  // Confirm Delete Website
  if (btnConfirmDeleteWebsite) {
    btnConfirmDeleteWebsite.addEventListener('click', async () => {
      if (!pendingDeleteDomain) return;
      try {
        const deletedDomain = pendingDeleteDomain;
        const deletedCount = await PresetManager.deleteWebsite(deletedDomain);
        closeModal(modalDeleteWebsite);
        showToast(t('toast.website_deleted', { domain: deletedDomain, count: deletedCount }), 'success');

        // If user was viewing details for this website (Level 2), return to directory (Level 1)
        if (selectedWebsiteDomain === deletedDomain) {
          selectedWebsiteDomain = null;
          profilesDetailView.classList.add('hidden');
          profilesWebsitesView.classList.remove('hidden');
        }
        pendingDeleteDomain = null;
        await reloadProfiles();
      } catch (err) {
        showToast(t('toast.delete_failed', { err: err.message }), 'error');
      }
    });
  }

  // Live JSON validation & count in Edit Profile Modal
  if (editProfileCookies) {
    editProfileCookies.addEventListener('input', () => {
      try {
        const text = editProfileCookies.value.trim();
        if (!text) {
          editProfileCookiesCount.textContent = '0 cookies';
          editProfileCookiesCount.style.color = '';
          return;
        }
        const parsed = JSON.parse(text);
        const count = Array.isArray(parsed) ? parsed.length : 1;
        editProfileCookiesCount.textContent = `${count} cookie${count > 1 ? 's' : ''}`;
        editProfileCookiesCount.style.color = '#10b981';
      } catch {
        editProfileCookiesCount.textContent = 'Invalid JSON';
        editProfileCookiesCount.style.color = '#ef4444';
      }
    });
  }

  // Edit Profile Form Submit (Save changes to Title & Cookie JSON data)
  if (formEditProfile) {
    formEditProfile.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = editProfileId.value;
      const domain = editProfileDomain.value.trim();
      const title = editProfileTitle.value.trim().slice(0, 50);
      const cookiesRaw = editProfileCookies.value.trim();

      if (!title) {
        showToast(t('toast.profile_name_empty'), 'error');
        return;
      }
      if (!cookiesRaw) {
        showToast(t('toast.cookie_data_empty'), 'error');
        return;
      }

      let parsedCookies;
      try {
        parsedCookies = JSON.parse(cookiesRaw);
      } catch (jsonErr) {
        showToast(t('toast.json_invalid', { err: jsonErr.message }), 'error');
        return;
      }

      if (!Array.isArray(parsedCookies)) {
        if (typeof parsedCookies === 'object' && parsedCookies !== null) {
          parsedCookies = [parsedCookies];
        } else {
          showToast(t('toast.json_must_array'), 'error');
          return;
        }
      }

      if (parsedCookies.length === 0) {
        showToast(t('toast.json_min_one'), 'error');
        return;
      }

      try {
        const note = editProfileNote ? editProfileNote.value.trim() : '';
        await PresetManager.savePreset({
          id,
          domain,
          title,
          cookies: parsedCookies,
          note
        });
        closeModal(modalEditProfile);
        showToast(t('toast.profile_saved', { title }), 'success');
        await reloadProfiles();
      } catch (err) {
        showToast(t('toast.save_failed', { err: err.message }), 'error');
      }
    });
  }

    // Profile Note Form Submit
  if (formProfileNote) {
    formProfileNote.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = noteProfileId.value;
      const note = noteProfileContent.value.trim();
      if (!id) return;

      try {
        await PresetManager.updatePresetNote(id, note);
        closeModal(modalProfileNote);
        showToast(t('toast.note_saved'), 'success');
        await reloadProfiles();
      } catch (err) {
        showToast(t('toast.save_failed', { err: err.message }), 'error');
      }
    });
  }

  // Clear Profile Note Button
  if (btnClearProfileNote) {
    btnClearProfileNote.addEventListener('click', async () => {
      const id = noteProfileId.value;
      if (!id) return;
      try {
        await PresetManager.updatePresetNote(id, '');
        closeModal(modalProfileNote);
        showToast(t('toast.note_cleared'), 'info');
        await reloadProfiles();
      } catch (err) {
        showToast(t('toast.delete_failed', { err: err.message }), 'error');
      }
    });
  }

  // Delete Profile Button from Edit Profile Modal
  if (btnDeleteProfileFromEditModal) {
    btnDeleteProfileFromEditModal.addEventListener('click', () => {
      const id = editProfileId.value;
      const title = editProfileTitle.value.trim() || (currentLang === 'id' ? 'profil ini' : 'this profile');
      if (!id) return;

      pendingDeleteProfileId = id;
      pendingDeleteProfileTitle = title;
      if (deleteProfileNameTarget) {
        deleteProfileNameTarget.textContent = title;
      }
      const confirmP = document.getElementById('delete-profile-confirm-text');
      if (confirmP) {
        confirmP.dataset.title = title;
        confirmP.innerHTML = currentLang === 'id'
          ? `Yakin ingin menghapus profil <span class="confirm-target-badge" id="delete-profile-name-target">${escapeHtml(title)}</span>?`
          : `Are you sure you want to delete profile <span class="confirm-target-badge" id="delete-profile-name-target">${escapeHtml(title)}</span>?`;
      }
      closeModal(modalEditProfile);
      openModal(modalDeleteProfile);
    });
  }

  // Confirm Delete Profile Modal Action
  if (btnConfirmDeleteProfile) {
    btnConfirmDeleteProfile.addEventListener('click', async () => {
      if (!pendingDeleteProfileId) return;
      const id = pendingDeleteProfileId;
      const title = pendingDeleteProfileTitle;
      try {
        await PresetManager.deletePreset(id);
        closeModal(modalDeleteProfile);
        showToast(t('toast.profile_deleted', { title }), 'success');
        pendingDeleteProfileId = null;
        pendingDeleteProfileTitle = '';
        await reloadProfiles();
      } catch (err) {
        showToast(t('toast.delete_failed', { err: err.message }), 'error');
      }
    });
  }

  // Add Cookie button & modal
  document.getElementById('btn-open-add').addEventListener('click', () => openModal(modalAdd));
  document.getElementById('btn-empty-add').addEventListener('click', () => openModal(modalAdd));

  addSession.addEventListener('change', (e) => {
    addExpiration.disabled = e.target.checked;
    if (!e.target.checked && !addExpiration.value) {
      const nextMonth = new Date(Date.now() + 30 * 86400 * 1000);
      addExpiration.value = formatTimestampForInput(nextMonth.getTime() / 1000);
    }
  });

  formAdd.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = addName.value.trim();
    const value = addValue.value;
    const domain = addDomain.value.trim();
    const path = addPath.value.trim() || '/';
    const sameSite = addSameSite.value;
    const isSession = addSession.checked;
    const isHostOnly = addHostOnly.checked;
    const isSecure = addSecure.checked;
    const isHttpOnly = addHttpOnly.checked;

    let expirationDate = null;
    if (!isSession && addExpiration.value) {
      expirationDate = Math.round(new Date(addExpiration.value).getTime() / 1000);
    }

    const newCookie = {
      name,
      value,
      domain,
      path,
      sameSite,
      session: isSession,
      expirationDate,
      hostOnly: isHostOnly,
      secure: isSecure,
      httpOnly: isHttpOnly,
      storeId: currentTab.cookieStoreId
    };

    try {
      await CookieManager.saveCookie(newCookie, currentTab.url);
      closeModal(modalAdd);
      formAdd.reset();
      addSession.checked = true;
      addExpiration.disabled = true;
      if (currentTab.domain) addDomain.value = currentTab.domain;
      showToast(t('toast.cookie_created', { name }), 'success');
      await reloadCookies();
    } catch (err) {
      showToast(t('toast.create_failed', { err: err.message }), 'error');
    }
  });

  // Import button & modal
  document.getElementById('btn-open-import').addEventListener('click', () => {
    importInput.value = '';
    openModal(modalImport);
  });

  btnSubmitImport.addEventListener('click', async () => {
    const raw = importInput.value.trim();
    if (!raw) {
      showToast(t('toast.import_empty'), 'error');
      return;
    }

    let parsed = [];
    try {
      parsed = autoDetectAndParse(raw);
    } catch (err) {
      showToast(err.message, 'error');
      return;
    }

    if (!parsed || parsed.length === 0) {
      showToast(t('toast.import_no_valid'), 'error');
      return;
    }

    let successCount = 0;
    let failedCount = 0;

    for (const c of parsed) {
      c.storeId = currentTab.cookieStoreId;
      try {
        await CookieManager.saveCookie(c, currentTab.url);
        successCount++;
      } catch (e) {
        failedCount++;
        console.warn(`Failed to import cookie ${c.name}:`, e);
      }
    }

    closeModal(modalImport);
    await reloadCookies();

    if (failedCount === 0) {
      showToast(t('toast.imported_success', { count: successCount }), 'success');
    } else {
      showToast(t('toast.imported_partial', { success: successCount, failed: failedCount }), 'error');
    }
  });

  // Export button & modal
  document.getElementById('btn-open-export').addEventListener('click', () => {
    updateExportOutput();
    openModal(modalExport);
  });

  document.querySelectorAll('.export-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.export-tab').forEach((t) => t.classList.remove('active'));
      e.target.classList.add('active');
      currentExportFormat = e.target.dataset.format;
      updateExportOutput();
    });
  });

  btnCopyExport.addEventListener('click', () => {
    const text = exportOutput.value;
    if (!text) {
      showToast(t('toast.no_cookies_copy'), 'error');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast(t('toast.copied_cookies', { count: filteredCookies.length, format: currentExportFormat.toUpperCase() }), 'success');
    });
  });

  btnDownloadExport.addEventListener('click', () => {
    const text = exportOutput.value;
    if (!text) {
      showToast(t('toast.no_cookies_export'), 'error');
      return;
    }

    let ext = 'json';
    let mime = 'application/json';
    if (currentExportFormat === 'netscape') {
      ext = 'txt';
      mime = 'text/plain';
    } else if (currentExportFormat === 'header') {
      ext = 'txt';
      mime = 'text/plain';
    }

    const host = currentTab.domain || 'cookies';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookies-${host}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('toast.download_started'), 'success');
  });

  // Delete All button & modal
  document.getElementById('btn-open-delete-all').addEventListener('click', () => {
    updateDeleteAllModalText();
    if (filteredCookies.length === 0) {
      showToast(t('toast.no_cookies_delete'), 'info');
      return;
    }
    openModal(modalDeleteAll);
  });

  btnConfirmDeleteAll.addEventListener('click', async () => {
    closeModal(modalDeleteAll);
    const targetCookies = [...filteredCookies];
    const { deletedCount, errors } = await CookieManager.deleteAllCookies(
      targetCookies,
      currentTab.url,
      currentTab.cookieStoreId
    );

    await reloadCookies();

    if (errors.length === 0) {
      showToast(t('toast.deleted_all_success', { count: deletedCount }), 'success');
    } else {
      showToast(t('toast.deleted_all_partial', { success: deletedCount, failed: errors.length }), 'error');
    }
  });

  // Modal dismiss buttons
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      closeModal(document.getElementById(modalId));
    });
  });

  // Click outside modal card to close
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
}

function updateExportOutput() {
  const list = filteredCookies.length > 0 ? filteredCookies : allCookies;
  if (currentExportFormat === 'json') {
    exportOutput.value = JSONFormatter.format(list);
  } else if (currentExportFormat === 'header') {
    exportOutput.value = HeaderStringFormatter.format(list);
  } else if (currentExportFormat === 'netscape') {
    exportOutput.value = NetscapeFormatter.format(list);
  }
}

function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
  const catDropdown = document.getElementById('category-options-dropdown');
  const catTrigger = document.getElementById('category-select-trigger');
  if (catDropdown) catDropdown.classList.add('hidden');
  if (catTrigger) {
    catTrigger.classList.remove('active');
    catTrigger.setAttribute('aria-expanded', 'false');
  }
}

function showUnsupportedState(details) {
  if (viewUnsupported) viewUnsupported.classList.remove('hidden');
  if (viewEmpty) viewEmpty.classList.add('hidden');
  if (cookieList) cookieList.innerHTML = '';

  let label = 'Browser Page';
  if (typeof details === 'string') {
    if (details.includes('newtab') || details.includes('chrome-search')) {
      label = 'New Tab';
    } else if (details.includes('settings')) {
      label = 'Settings';
    } else if (details.includes('extensions')) {
      label = 'Extensions';
    }
  }

  if (domainBadge) {
    domainBadge.textContent = label;
    domainBadge.title = typeof details === 'string' ? details : 'Internal Page';
  }
  if (cookieCounter) cookieCounter.textContent = currentLang === 'id' ? '0 cookie' : '0 cookies';
  document.querySelectorAll('#footer-cookies .toolbar-btn').forEach((btn) => (btn.disabled = true));
}

function showToast(msg, type = 'info') {
  clearTimeout(toastTimeout);
  toastMessage.textContent = msg;
  toastElement.className = 'toast';

  if (type === 'error') {
    toastElement.classList.add('toast-error');
  } else if (type === 'success') {
    toastElement.classList.add('toast-success');
  }

  toastElement.classList.remove('hidden');
  toastTimeout = setTimeout(() => {
    toastElement.classList.add('hidden');
  }, 2600);
}

function formatExpirationForDisplay(cookie) {
  if (cookie.session) return 'Session';
  if (!cookie.expirationDate) return 'Session';
  const d = new Date(cookie.expirationDate * 1000);
  return d.toLocaleDateString();
}

function formatTimestampForInput(seconds) {
  if (!seconds) return '';
  const date = new Date(seconds * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Start
document.addEventListener('DOMContentLoaded', init);
