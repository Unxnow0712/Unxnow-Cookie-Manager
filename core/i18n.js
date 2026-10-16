/**
 * UNXNOW Cookie Editor - Internationalization (i18n) Module
 * Supports Bahasa Indonesia ('id') and English ('en')
 */

export const I18N = {
  id: {
    // App & Navigation
    'app.title': 'UNXNOW Cookie Editor',
    'nav.profiles.title': 'Website Tersimpan',
    'nav.cookies.title': 'Cookie Tab Aktif',
    'nav.menu.title': 'Pengaturan dan Alat',

    // Settings Menu
    'menu.save': 'Simpan Tab',
    'menu.save.title': 'Simpan cookie dari tab aktif',
    'menu.add': 'Tambah Profil',
    'menu.add.title': 'Tambah profil kustom secara manual',
    'menu.backup': 'Cadangkan',
    'menu.backup.title': 'Ekspor semua profil ke JSON',
    'menu.restore': 'Pulihkan',
    'menu.restore.title': 'Pulihkan profil dari JSON',
    'menu.dark_mode': 'Mode Gelap',
    'menu.light_mode': 'Mode Terang',
    'menu.theme.title': 'Ganti mode Gelap / Terang',
    'menu.lang': 'Bahasa: Indonesia',
    'menu.lang.title': 'Ganti Bahasa (Indonesia / English)',
    'menu.categories': 'Kelola Kategori',
    'menu.categories.title': 'Kelola Kategori Website',
    'menu.about': 'Tentang UNXNOW',
    'menu.about.title': 'Tentang Ekstensi',

    // Search & Sort Bar
    'search.placeholder.profiles': 'Cari website atau profil cookie...',
    'search.placeholder.cookies': 'Cari cookie...',
    'search.clear.title': 'Hapus pencarian',
    'sort.toggle.title': 'Urutkan Daftar',
    'sort.header.title': 'Urutkan Berdasarkan',

    // Sort Options - Profiles
    'sort.profiles.custom': 'Urutan Bebas (Drag & Drop)',
    'sort.profiles.name_asc': 'Nama Website: A → Z',
    'sort.profiles.name_desc': 'Nama Website: Z → A',
    'sort.profiles.count': 'Jumlah Profil Terbanyak',
    'sort.profiles.recent': 'Terakhir Diperbarui',

    // Sort Options - Cookies
    'sort.cookies.custom': 'Urutan Bebas (Drag & Drop)',
    'sort.cookies.name_asc': 'Nama Cookie: A → Z',
    'sort.cookies.name_desc': 'Nama Cookie: Z → A',
    'sort.cookies.domain': 'Domain: A → Z',
    'sort.cookies.expiry': 'Waktu Kedaluwarsa',

    // Live Tab Context Bar
    'siteinfo.connected.title': 'Terhubung ke tab aktif',
    'siteinfo.domain.title': 'Domain Tab Aktif',
    'siteinfo.cookies.title': 'Cookie tab aktif',
    'siteinfo.cookies.count': '{count} cookie',
    'siteinfo.detecting': 'Mendeteksi...',

    // Live Tab Empty States
    'empty.restricted.title': 'Halaman Terbatas',
    'empty.restricted.desc': 'Ekstensi tidak dapat mengakses cookie pada halaman sistem browser (seperti chrome://, edge://, ekstensi web, atau file lokal).',
    'empty.cookies.title': 'Tidak Ada Cookie Ditemukan',
    'empty.cookies.desc': 'Halaman ini tidak memiliki cookie atau filter pencarian tidak menemukan hasil.',
    'empty.cookies.btn': 'Tambah Cookie Pertama',

    // Footers
    'footer.add': 'Tambah',
    'footer.add.title': 'Tambah cookie baru',
    'footer.import': 'Impor',
    'footer.import.title': 'Impor cookie',
    'footer.export': 'Ekspor',
    'footer.export.title': 'Ekspor cookie',
    'footer.delete_all': 'Hapus Semua',
    'footer.delete_all.title': 'Hapus semua cookie',
    'footer.credit': 'Dikembangkan oleh <strong>@Unxnow0712</strong>',

    // Level 1: Websites Directory
    'empty.websites.title': 'Belum Ada Website Tersimpan',
    'empty.websites.desc': 'Simpan cookie dari tab yang sedang dibuka atau tambahkan profil baru secara manual.',
    'empty.websites.btn_current': 'Simpan Tab Saat Ini',
    'empty.websites.btn_custom': '+ Tambah Website',
    'card.website.badge': '{count} profil',
    'card.website.edit.title': 'Edit website',
    'card.website.launch.title': 'Klik untuk membuka profil {domain}',

    // Level 2: Website Detail / Profiles List
    'detail.back.text': 'Semua Website',
    'detail.back.title': 'Kembali ke semua website',
    'detail.add.text': 'Tambah Profil',
    'detail.add.title': 'Tambah profil cookie untuk website ini',
    'empty.profiles.title': 'Belum Ada Profil untuk Website Ini',
    'empty.profiles.desc': 'Belum ada profil cookie untuk website ini.',
    'empty.profiles.btn': 'Tambah Profil Pertama',
    'card.profile.launch.title': 'Klik untuk membuka {domain} dengan cookie ini',
    'card.profile.saved_at': 'Tersimpan {date}',
    'card.profile.edit.title': 'Edit nama, data cookie, atau hapus profil ini',
    'card.profile.note.title': 'Tambah atau lihat catatan profil',
    'card.profile.note.has_title': 'Lihat / edit catatan profil: {note}',
    'modal.note.title': 'Catatan Profil',
    'modal.note.placeholder': 'Tulis catatan untuk profil ini... (contoh: akun kedaluwarsa, email login, instruksi, atau tags)',
    'modal.note.hint': 'Catatan hanya tersimpan lokal di browser Anda untuk profil ini.',
    'modal.note.btn_clear': 'Hapus',
    'modal.note.btn_clear_title': 'Hapus catatan dari profil ini',
    'modal.note.btn_cancel': 'Batal',
    'modal.note.btn_save': 'Simpan Catatan',
    'modal.edit_profile.note': 'Catatan Profil (Opsional)',
    'modal.edit_profile.note.ph': 'contoh: Akun pribadi, expired 2026...',
    'toast.note_saved': 'Catatan profil berhasil disimpan!',
    'toast.note_cleared': 'Catatan profil dihapus.',

    // Cookie Card (in live cookies list)
    'cookie.badge.session': 'Sesi',
    'cookie.badge.exp': 'Exp',
    'cookie.badge.expires_at': 'Kedaluwarsa: {date}',
    'cookie.badge.secure': 'Aman',
    'cookie.badge.httponly': 'HttpOnly',
    'cookie.field.name': 'Nama',
    'cookie.field.value': 'Nilai',
    'cookie.field.domain': 'Domain',
    'cookie.field.path': 'Path',
    'cookie.field.samesite': 'SameSite',
    'cookie.field.samesite.lax': 'Lax',
    'cookie.field.samesite.strict': 'Strict',
    'cookie.field.samesite.none': 'None (Tanpa batasan)',
    'cookie.field.expiration': 'Kedaluwarsa',
    'cookie.checkbox.session': 'Sesi',
    'cookie.checkbox.hostonly': 'Host Only',
    'cookie.checkbox.secure': 'Aman',
    'cookie.checkbox.httponly': 'HttpOnly',
    'cookie.btn.copy': 'Salin Nilai',
    'cookie.btn.delete': 'Hapus',
    'cookie.btn.save': 'Simpan Perubahan',

    // Modal: Add Cookie
    'modal.add.title': 'Tambah Cookie Baru',
    'modal.add.name': 'Nama Cookie',
    'modal.add.name.ph': 'contoh: session_token',
    'modal.add.value': 'Nilai Cookie',
    'modal.add.value.ph': 'Masukkan nilai cookie...',
    'modal.add.domain': 'Domain',
    'modal.add.domain.ph': 'contoh: .example.com',
    'modal.add.path': 'Path',
    'modal.add.samesite': 'SameSite',
    'modal.add.expiration': 'Kedaluwarsa (Unix / Detik)',
    'modal.add.session': 'Cookie Sesi',
    'modal.add.hostonly': 'Host Only',
    'modal.add.secure': 'Aman (Secure)',
    'modal.add.httponly': 'HttpOnly',
    'modal.add.btn_cancel': 'Batal',
    'modal.add.btn_create': 'Buat Cookie',

    // Modal: Import Cookies
    'modal.import.title': 'Impor Cookie',
    'modal.import.desc': 'Tempel cookie dalam format JSON, Header String (name=val;...), atau Netscape. Format terdeteksi otomatis.',
    'modal.import.formats': 'Format yang Didukung',
    'modal.import.ph': 'Tempel konten cookie di sini...',
    'modal.import.btn_cancel': 'Batal',
    'modal.import.btn_submit': 'Impor Sekarang',

    // Modal: Export Cookies
    'modal.export.title': 'Ekspor Cookie',
    'modal.export.format': 'Format Ekspor',
    'modal.export.btn_download': 'Unduh File',
    'modal.export.btn_copy': 'Salin ke Clipboard',

    // Modal: Delete All Cookies
    'modal.delete_all.title': 'Hapus Semua Cookie?',
    'modal.delete_all.desc': 'Yakin ingin menghapus semua cookie untuk {domain}?',
    'modal.delete_all.warn': 'Anda akan keluar dari sesi aktif di website ini.',
    'modal.delete_all.btn_cancel': 'Batal',
    'modal.delete_all.btn_confirm': 'Ya, Hapus Semua',

    // Modal: Save Profile
    'modal.save_profile.title': 'Simpan Profil Cookie',
    'modal.char_limit_30': 'Maks. 30 karakter',
    'modal.char_limit_50': 'Maks. 50 karakter',
    'modal.save_profile.name': 'Nama Profil',
    'modal.save_profile.name.ph': 'contoh: Netflix - Akun Pribadi',
    'modal.save_profile.domain': 'Domain Website Target',
    'modal.save_profile.domain.ph': 'contoh: netflix.com',
    'modal.save_profile.source': 'Sumber Cookie',
    'modal.save_profile.source_active': 'Cookie Tab Aktif ({count} item)',
    'modal.save_profile.source_custom': 'Custom / Tempel Cookie',
    'modal.save_profile.paste_label': 'Tempel Cookie (Format JSON, Header, atau Netscape)',
    'modal.save_profile.paste_ph': 'Tempel data cookie di sini...',
    'modal.save_profile.btn_cancel': 'Batal',
    'modal.save_profile.btn_save': 'Simpan Profil',

    // Modal: View Profile
    'modal.view_profile.title': 'Daftar Cookie Profil',
    'modal.view_profile.saved_at': 'Tersimpan pada {date}',
    'modal.view_profile.btn_copy': 'Salin',
    'modal.view_profile.btn_apply': 'Terapkan ke Tab Ini',

    // Modal: Edit Website
    'modal.edit_website.title': 'Edit Nama Website',
    'modal.edit_website.label': 'Nama Tampilan Website',
    'modal.edit_website.ph': 'contoh: Netflix Utama, Work ChatGPT...',
    'modal.edit_website.domain_orig': 'Domain asli: {domain}',
    'modal.edit_website.btn_delete': 'Hapus Website',
    'modal.edit_website.btn_delete.title': 'Hapus website ini dan semua profilnya',
    'modal.edit_website.category_label': 'Kategori Website',
    'modal.edit_website.category_none': 'Tanpa Kategori',
    'modal.edit_website.btn_reset': 'Reset',
    'modal.edit_website.btn_reset.title': 'Kembalikan ke nama domain asli',
    'modal.edit_website.btn_cancel': 'Batal',
    'modal.edit_website.btn_save': 'Simpan',

    // Modal: Manage Categories
    'modal.categories.title': 'Kelola Kategori Website',
    'modal.categories.ph': 'Tambah kategori baru...',
    'modal.categories.btn_add': 'Tambah',
    'modal.categories.list_title': 'Daftar Kategori',
    'modal.categories.btn_close': 'Tutup',
    'modal.categories.empty': 'Belum ada kategori tersimpan.',
    'modal.categories.delete_title': 'Hapus kategori ini',
    'modal.categories.edit_title': 'Ubah nama kategori ini',
    'modal.categories.save_title': 'Simpan perubahan nama',
    'modal.categories.cancel_title': 'Batal',
    'category.all': 'Semua',
    'category.none': 'Tanpa Kategori',
    'category.manage_title': 'Kelola Kategori',

    // Modal: Delete Website Confirmation
    'modal.delete_website.title': 'Hapus Website',
    'modal.delete_website.desc': 'Yakin ingin menghapus website {name} dari daftar?',
    'modal.delete_website.warn': 'Semua profil cookie di website ini akan ikut terhapus permanen.',
    'modal.delete_website.btn_cancel': 'Batal',
    'modal.delete_website.btn_confirm': 'Ya, Hapus Website',

    // Modal: Delete Profile Confirmation
    'modal.delete_profile.title': 'Hapus Profil Cookie',
    'modal.delete_profile.desc': 'Yakin ingin menghapus profil {title}?',
    'modal.delete_profile.warn': 'Profil cookie ini akan dihapus secara permanen dari daftar.',
    'modal.delete_profile.btn_cancel': 'Batal',
    'modal.delete_profile.btn_confirm': 'Ya, Hapus Profil',

    // Modal: Edit Profile
    'modal.edit_profile.title': 'Edit Profil Cookie',
    'modal.edit_profile.name': 'Nama Profil',
    'modal.edit_profile.name.ph': 'contoh: Akun Utama, VIP, Akun 2...',
    'modal.edit_profile.cookies': 'Data Cookie (JSON)',
    'modal.edit_profile.desc': 'Anda dapat mengubah nilai, menambah, atau menghapus cookie dalam format JSON.',
    'modal.edit_profile.cookies.ph': 'Tempel array cookie dalam format JSON...',
    'modal.edit_profile.btn_delete': 'Hapus Profil',
    'modal.edit_profile.btn_delete.title': 'Hapus profil ini',
    'modal.edit_profile.btn_cancel': 'Batal',
    'modal.edit_profile.btn_save': 'Simpan Perubahan',

    // Modal: About
    'modal.about.title': 'UNXNOW Cookie Manager',
    'modal.about.desc': 'Ekstensi manajemen cookie browser modern dengan direktori website bertingkat, pengelompokan kategori, pencadangan profil, dan editor cookie yang aman.',
    'modal.about.label_dev': 'Pengembang',
    'modal.about.label_license': 'Lisensi',
    'modal.about.label_storage': 'Penyimpanan',
    'modal.about.storage_val': 'Chrome Local Storage',
    'modal.about.btn_close': 'Tutup',

    // Toast Notifications
    'toast.cookies_refreshed': 'Cookie berhasil disegarkan',
    'toast.cookies_read_error': 'Gagal membaca cookie: {err}',
    'toast.profiles_load_error': 'Gagal memuat profil: {err}',
    'toast.website_order_saved': 'Urutan website disimpan!',
    'toast.cookie_order_saved': 'Urutan cookie disimpan!',
    'toast.activating_cookies': 'Mengaktifkan cookie & membuka {domain}...',
    'toast.login_success': 'Berhasil login ke {domain} ({count} cookie disuntikkan)',
    'toast.cookies_applied': 'Cookie diterapkan ({success} sukses, {failed} gagal)',
    'toast.open_site_error': 'Gagal membuka website: {err}',
    'toast.sorted': 'Urutan: {label}',
    'toast.cookie_order_updated': 'Urutan cookie diperbarui',
    'toast.copied_value': 'Nilai cookie "{name}" disalin',
    'toast.cookie_saved': 'Cookie "{name}" berhasil disimpan',
    'toast.save_failed': 'Gagal menyimpan: {err}',
    'toast.cookie_deleted': 'Cookie "{name}" berhasil dihapus',
    'toast.delete_failed': 'Gagal menghapus: {err}',
    'toast.tab_no_cookies': 'Tab saat ini tidak memiliki cookie.',
    'toast.no_profiles_export': 'Tidak ada profil tersimpan untuk diekspor',
    'toast.exported_profiles': 'Berhasil mengekspor {count} profil',
    'toast.theme_dark': 'Mode Gelap diaktifkan',
    'toast.theme_light': 'Mode Terang diaktifkan',
    'toast.lang_switched': 'Bahasa: Indonesia',
    'toast.no_cookies_save': 'Tab aktif tidak memiliki cookie untuk disimpan.',
    'toast.paste_cookie_data': 'Silakan masukkan atau tempel data cookie.',
    'toast.parse_error': 'Format data cookie tidak valid: {err}',
    'toast.profile_saved': 'Profil "{title}" berhasil disimpan!',
    'toast.profiles_restored': 'Berhasil memulihkan {count} profil',
    'toast.restore_failed': 'Gagal memulihkan cadangan: {err}',
    'toast.copied_profile_cookies': 'Cookie profil disalin ({format})',
    'toast.website_updated': 'Nama website diperbarui: "{name}"',
    'toast.website_reset': 'Nama website dikembalikan ke "{domain}"',
    'toast.website_deleted': 'Website "{domain}" berhasil dihapus ({count} profil)',
    'toast.profile_name_empty': 'Nama profil tidak boleh kosong.',
    'toast.cookie_data_empty': 'Data cookie tidak boleh kosong.',
    'toast.json_invalid': 'Format JSON cookie tidak valid: {err}',
    'toast.json_must_array': 'Data cookie harus berupa array JSON ([ { name, value, ... } ])',
    'toast.json_min_one': 'Data cookie harus berisi minimal 1 cookie.',
    'toast.profile_deleted': 'Profil "{title}" berhasil dihapus.',
    'toast.cookie_created': 'Cookie "{name}" berhasil dibuat',
    'toast.create_failed': 'Gagal membuat cookie: {err}',
    'toast.import_empty': 'Silakan masukkan cookie untuk diimpor',
    'toast.import_no_valid': 'Tidak ada cookie valid ditemukan dalam input',
    'toast.imported_success': 'Berhasil mengimpor {count} cookie',
    'toast.imported_partial': 'Berhasil mengimpor {success}, gagal {failed}',
    'toast.no_cookies_copy': 'Tidak ada cookie untuk disalin',
    'toast.copied_cookies': 'Menyalin {count} cookie ({format})',
    'toast.no_cookies_export': 'Tidak ada cookie untuk diekspor',
    'toast.download_started': 'Unduhan file dimulai',
    'toast.no_cookies_delete': 'Tidak ada cookie untuk dihapus',
    'toast.deleted_all_success': 'Berhasil menghapus semua ({count}) cookie',
    'toast.deleted_all_partial': 'Berhasil menghapus {success} cookie ({failed} gagal)',
    'toast.category_added': 'Kategori "{name}" berhasil ditambahkan!',
    'toast.category_exists': 'Kategori "{name}" sudah ada.',
    'toast.category_deleted': 'Kategori "{name}" berhasil dihapus.',
    'toast.category_name_empty': 'Nama kategori tidak boleh kosong.',
    'toast.category_updated': 'Kategori berhasil diubah menjadi "{name}"',
    'toast.category_name_same': 'Nama kategori tidak berubah.'
  },

  en: {
    // App & Navigation
    'app.title': 'UNXNOW Cookie Editor',
    'nav.profiles.title': 'Saved Websites',
    'nav.cookies.title': 'Live Tab Cookies',
    'nav.menu.title': 'Settings and Tools',

    // Settings Menu
    'menu.save': 'Save Active',
    'menu.save.title': 'Save cookies from active tab',
    'menu.add': 'Add Profile',
    'menu.add.title': 'Add a custom profile manually',
    'menu.backup': 'Backup',
    'menu.backup.title': 'Export all profiles to JSON',
    'menu.restore': 'Restore',
    'menu.restore.title': 'Restore profiles from JSON',
    'menu.dark_mode': 'Dark Mode',
    'menu.light_mode': 'Light Mode',
    'menu.theme.title': 'Toggle Dark / Light mode',
    'menu.lang': 'Language: English',
    'menu.lang.title': 'Switch Language (Indonesia / English)',
    'menu.categories': 'Manage Categories',
    'menu.categories.title': 'Manage Website Categories',
    'menu.about': 'About',
    'menu.about.title': 'About Extension',

    // Search & Sort Bar
    'search.placeholder.profiles': 'Search websites or cookie profiles...',
    'search.placeholder.cookies': 'Search cookies...',
    'search.clear.title': 'Clear search',
    'sort.toggle.title': 'Sort List',
    'sort.header.title': 'Sort By',

    // Sort Options - Profiles
    'sort.profiles.custom': 'Custom Order (Drag & Drop)',
    'sort.profiles.name_asc': 'Website Name: A → Z',
    'sort.profiles.name_desc': 'Website Name: Z → A',
    'sort.profiles.count': 'Most Profiles Count',
    'sort.profiles.recent': 'Recently Updated',

    // Sort Options - Cookies
    'sort.cookies.custom': 'Custom Order (Drag & Drop)',
    'sort.cookies.name_asc': 'Cookie Name: A → Z',
    'sort.cookies.name_desc': 'Cookie Name: Z → A',
    'sort.cookies.domain': 'Domain: A → Z',
    'sort.cookies.expiry': 'Expiration Date',

    // Live Tab Context Bar
    'siteinfo.connected.title': 'Connected to active tab',
    'siteinfo.domain.title': 'Active Tab Domain',
    'siteinfo.cookies.title': 'Live tab cookies',
    'siteinfo.cookies.count': '{count} cookies',
    'siteinfo.detecting': 'Detecting...',

    // Live Tab Empty States
    'empty.restricted.title': 'Restricted Page',
    'empty.restricted.desc': 'Extensions cannot access cookies on browser system pages (such as chrome://, edge://, web extensions, or local files).',
    'empty.cookies.title': 'No Cookies Found',
    'empty.cookies.desc': 'This page doesn\'t have any cookies, or search filter returned no results.',
    'empty.cookies.btn': 'Add First Cookie',

    // Footers
    'footer.add': 'Add',
    'footer.add.title': 'Add new cookie',
    'footer.import': 'Import',
    'footer.import.title': 'Import cookies',
    'footer.export': 'Export',
    'footer.export.title': 'Export cookies',
    'footer.delete_all': 'Delete All',
    'footer.delete_all.title': 'Delete all cookies',
    'footer.credit': 'Developed by <strong>@Unxnow0712</strong>',

    // Level 1: Websites Directory
    'empty.websites.title': 'No Saved Websites',
    'empty.websites.desc': 'Save cookies from your active tab or create a new profile manually.',
    'empty.websites.btn_current': 'Save Current Tab as Profile',
    'empty.websites.btn_custom': '+ Add Custom Website',
    'card.website.badge': '{count} profile',
    'card.website.edit.title': 'Edit website',
    'card.website.launch.title': 'Click to view profiles for {domain}',

    // Level 2: Website Detail / Profiles List
    'detail.back.text': 'All Sites',
    'detail.back.title': 'Back to all websites',
    'detail.add.text': 'Add Profile',
    'detail.add.title': 'Add another cookie profile for this website',
    'empty.profiles.title': 'No Profiles for this Site',
    'empty.profiles.desc': 'There are no cookie profiles for this website yet.',
    'empty.profiles.btn': 'Add First Profile',
    'card.profile.launch.title': 'Click to open {domain} with these cookies',
    'card.profile.saved_at': 'Saved {date}',
    'card.profile.edit.title': 'Edit name, cookie data, or delete this profile',
    'card.profile.note.title': 'Add or view profile note',
    'card.profile.note.has_title': 'View / edit profile note: {note}',
    'modal.note.title': 'Profile Note',
    'modal.note.placeholder': 'Write a note for this profile... (e.g. account expiration, login email, instructions, or tags)',
    'modal.note.hint': 'Notes are stored locally in your browser for this profile.',
    'modal.note.btn_clear': 'Clear',
    'modal.note.btn_clear_title': 'Remove note from this profile',
    'modal.note.btn_cancel': 'Cancel',
    'modal.note.btn_save': 'Save Note',
    'modal.edit_profile.note': 'Profile Note (Optional)',
    'modal.edit_profile.note.ph': 'e.g. Personal account, expires 2026...',
    'toast.note_saved': 'Profile note saved successfully!',
    'toast.note_cleared': 'Profile note cleared.',

    // Cookie Card (in live cookies list)
    'cookie.badge.session': 'Session',
    'cookie.badge.exp': 'Exp',
    'cookie.badge.expires_at': 'Expires: {date}',
    'cookie.badge.secure': 'Secure',
    'cookie.badge.httponly': 'HttpOnly',
    'cookie.field.name': 'Name',
    'cookie.field.value': 'Value',
    'cookie.field.domain': 'Domain',
    'cookie.field.path': 'Path',
    'cookie.field.samesite': 'SameSite',
    'cookie.field.samesite.lax': 'Lax',
    'cookie.field.samesite.strict': 'Strict',
    'cookie.field.samesite.none': 'None (No restriction)',
    'cookie.field.expiration': 'Expiration',
    'cookie.checkbox.session': 'Session',
    'cookie.checkbox.hostonly': 'Host Only',
    'cookie.checkbox.secure': 'Secure',
    'cookie.checkbox.httponly': 'HttpOnly',
    'cookie.btn.copy': 'Copy Value',
    'cookie.btn.delete': 'Delete',
    'cookie.btn.save': 'Save Changes',

    // Modal: Add Cookie
    'modal.add.title': 'Add New Cookie',
    'modal.add.name': 'Cookie Name',
    'modal.add.name.ph': 'e.g. session_token',
    'modal.add.value': 'Cookie Value',
    'modal.add.value.ph': 'Enter cookie value...',
    'modal.add.domain': 'Domain',
    'modal.add.domain.ph': 'e.g. .example.com',
    'modal.add.path': 'Path',
    'modal.add.samesite': 'SameSite',
    'modal.add.expiration': 'Expiration (Unix / Seconds)',
    'modal.add.session': 'Session Cookie',
    'modal.add.hostonly': 'Host Only',
    'modal.add.secure': 'Secure',
    'modal.add.httponly': 'HttpOnly',
    'modal.add.btn_cancel': 'Cancel',
    'modal.add.btn_create': 'Create Cookie',

    // Modal: Import Cookies
    'modal.import.title': 'Import Cookies',
    'modal.import.desc': 'Paste cookies in JSON, Header String (name=val;...), or Netscape format. Format is auto-detected.',
    'modal.import.formats': 'Supported Formats',
    'modal.import.ph': 'Paste cookies content here...',
    'modal.import.btn_cancel': 'Cancel',
    'modal.import.btn_submit': 'Import Now',

    // Modal: Export Cookies
    'modal.export.title': 'Export Cookies',
    'modal.export.format': 'Export Format',
    'modal.export.btn_download': 'Download File',
    'modal.export.btn_copy': 'Copy to Clipboard',

    // Modal: Delete All Cookies
    'modal.delete_all.title': 'Delete All Cookies?',
    'modal.delete_all.desc': 'Are you sure you want to delete all cookies for {domain}?',
    'modal.delete_all.warn': 'You will be logged out of active sessions on this website.',
    'modal.delete_all.btn_cancel': 'Cancel',
    'modal.delete_all.btn_confirm': 'Yes, Delete All',

    // Modal: Save Profile
    'modal.save_profile.title': 'Save Cookie Profile',
    'modal.char_limit_30': 'Max 30 chars',
    'modal.char_limit_50': 'Max 50 chars',
    'modal.save_profile.name': 'Profile Name',
    'modal.save_profile.name.ph': 'e.g. Netflix - Personal Account',
    'modal.save_profile.domain': 'Target Website Domain',
    'modal.save_profile.domain.ph': 'e.g. netflix.com',
    'modal.save_profile.source': 'Cookie Source',
    'modal.save_profile.source_active': 'Active Tab Cookies ({count} items)',
    'modal.save_profile.source_custom': 'Custom / Paste Cookies',
    'modal.save_profile.paste_label': 'Paste Cookies (JSON, Header, or Netscape format)',
    'modal.save_profile.paste_ph': 'Paste cookie data here...',
    'modal.save_profile.btn_cancel': 'Cancel',
    'modal.save_profile.btn_save': 'Save Profile',

    // Modal: View Profile
    'modal.view_profile.title': 'Profile Cookies',
    'modal.view_profile.saved_at': 'Saved on {date}',
    'modal.view_profile.btn_copy': 'Copy',
    'modal.view_profile.btn_apply': 'Apply to Current Tab',

    // Modal: Edit Website
    'modal.edit_website.title': 'Edit Website Name',
    'modal.edit_website.label': 'Website Display Name',
    'modal.edit_website.ph': 'e.g. Netflix Main, Work ChatGPT...',
    'modal.edit_website.domain_orig': 'Original domain: {domain}',
    'modal.edit_website.btn_delete': 'Delete Website',
    'modal.edit_website.btn_delete.title': 'Delete this website and all its profiles',
    'modal.edit_website.category_label': 'Website Category',
    'modal.edit_website.category_none': 'No Category',
    'modal.edit_website.btn_reset': 'Reset',
    'modal.edit_website.btn_reset.title': 'Reset to original domain name',
    'modal.edit_website.btn_cancel': 'Cancel',
    'modal.edit_website.btn_save': 'Save',

    // Modal: Manage Categories
    'modal.categories.title': 'Manage Website Categories',
    'modal.categories.ph': 'Add new category...',
    'modal.categories.btn_add': 'Add',
    'modal.categories.list_title': 'Categories List',
    'modal.categories.btn_close': 'Close',
    'modal.categories.empty': 'No categories yet.',
    'modal.categories.delete_title': 'Delete this category',
    'modal.categories.edit_title': 'Rename this category',
    'modal.categories.save_title': 'Save name changes',
    'modal.categories.cancel_title': 'Cancel',
    'category.all': 'All',
    'category.none': 'No Category',
    'category.manage_title': 'Manage Categories',

    // Modal: Delete Website Confirmation
    'modal.delete_website.title': 'Delete Website',
    'modal.delete_website.desc': 'Are you sure you want to delete website {name} from the list?',
    'modal.delete_website.warn': 'All cookie profiles in this website will be permanently deleted.',
    'modal.delete_website.btn_cancel': 'Cancel',
    'modal.delete_website.btn_confirm': 'Yes, Delete Website',

    // Modal: Delete Profile Confirmation
    'modal.delete_profile.title': 'Delete Cookie Profile',
    'modal.delete_profile.desc': 'Are you sure you want to delete profile {title}?',
    'modal.delete_profile.warn': 'This cookie profile will be permanently deleted from your saved list.',
    'modal.delete_profile.btn_cancel': 'Cancel',
    'modal.delete_profile.btn_confirm': 'Yes, Delete Profile',

    // Modal: Edit Profile
    'modal.edit_profile.title': 'Edit Cookie Profile',
    'modal.edit_profile.name': 'Profile Name',
    'modal.edit_profile.name.ph': 'e.g. Main Account, VIP, Account 2...',
    'modal.edit_profile.cookies': 'Cookie Data (JSON)',
    'modal.edit_profile.desc': 'You can modify values, add, or delete cookies in JSON format.',
    'modal.edit_profile.cookies.ph': 'Paste array of cookies in JSON format...',
    'modal.edit_profile.btn_delete': 'Delete Profile',
    'modal.edit_profile.btn_delete.title': 'Delete this profile',
    'modal.edit_profile.btn_cancel': 'Cancel',
    'modal.edit_profile.btn_save': 'Save Changes',

    // Modal: About
    'modal.about.title': 'UNXNOW Cookie Manager',
    'modal.about.desc': 'Modern browser cookie management extension featuring multi-level website directories, custom categories, profile backups, and a secure cookie editor.',
    'modal.about.label_dev': 'Developer',
    'modal.about.label_license': 'License',
    'modal.about.label_storage': 'Storage',
    'modal.about.storage_val': 'Chrome Local Storage',
    'modal.about.btn_close': 'Close',

    // Toast Notifications
    'toast.cookies_refreshed': 'Cookies refreshed',
    'toast.cookies_read_error': 'Error reading cookies: {err}',
    'toast.profiles_load_error': 'Failed loading profiles: {err}',
    'toast.website_order_saved': 'Website order saved!',
    'toast.cookie_order_saved': 'Cookie order saved!',
    'toast.activating_cookies': 'Activating cookies & opening {domain}...',
    'toast.login_success': 'Successfully logged in to {domain} ({count} cookies injected)',
    'toast.cookies_applied': 'Cookies applied ({success} succeeded, {failed} failed)',
    'toast.open_site_error': 'Failed to open website: {err}',
    'toast.sorted': 'Sorted: {label}',
    'toast.cookie_order_updated': 'Cookie order updated',
    'toast.copied_value': 'Copied value for "{name}"',
    'toast.cookie_saved': 'Saved "{name}" successfully',
    'toast.save_failed': 'Save failed: {err}',
    'toast.cookie_deleted': 'Deleted "{name}"',
    'toast.delete_failed': 'Delete failed: {err}',
    'toast.tab_no_cookies': 'Active tab has no cookies.',
    'toast.no_profiles_export': 'No saved profiles to export',
    'toast.exported_profiles': 'Exported {count} profiles',
    'toast.theme_dark': 'Dark Mode activated',
    'toast.theme_light': 'Light Mode activated',
    'toast.lang_switched': 'Language: English',
    'toast.no_cookies_save': 'Active tab has no cookies to save.',
    'toast.paste_cookie_data': 'Please paste cookie data.',
    'toast.parse_error': 'Parse error: {err}',
    'toast.profile_saved': 'Profile "{title}" saved!',
    'toast.profiles_restored': 'Successfully restored {count} profiles',
    'toast.restore_failed': 'Failed restoring backup: {err}',
    'toast.copied_profile_cookies': 'Copied profile cookies ({format})',
    'toast.website_updated': 'Website name updated: "{name}"',
    'toast.website_reset': 'Website name reset to "{domain}"',
    'toast.website_deleted': 'Website "{domain}" deleted ({count} profiles)',
    'toast.profile_name_empty': 'Profile name cannot be empty.',
    'toast.cookie_data_empty': 'Cookie data cannot be empty.',
    'toast.json_invalid': 'Invalid cookie JSON format: {err}',
    'toast.json_must_array': 'Cookie data must be a JSON array ([ { name, value, ... } ])',
    'toast.json_min_one': 'Cookie data must contain at least 1 cookie.',
    'toast.profile_deleted': 'Profile "{title}" deleted.',
    'toast.cookie_created': 'Created cookie "{name}"',
    'toast.create_failed': 'Failed to create: {err}',
    'toast.import_empty': 'Please enter cookies to import',
    'toast.import_no_valid': 'No valid cookies found in input',
    'toast.imported_success': 'Imported {count} cookies',
    'toast.imported_partial': 'Imported {success}, failed {failed}',
    'toast.no_cookies_copy': 'No cookies to copy',
    'toast.copied_cookies': 'Copied {count} cookies ({format})',
    'toast.no_cookies_export': 'No cookies to export',
    'toast.download_started': 'File download started',
    'toast.no_cookies_delete': 'No cookies to delete',
    'toast.deleted_all_success': 'Deleted all {count} cookies',
    'toast.deleted_all_partial': 'Deleted {success} cookies ({failed} failed)',
    'toast.category_added': 'Category "{name}" added successfully!',
    'toast.category_exists': 'Category "{name}" already exists.',
    'toast.category_deleted': 'Category "{name}" deleted successfully.',
    'toast.category_name_empty': 'Category name cannot be empty.',
    'toast.category_updated': 'Category renamed to "{name}"',
    'toast.category_name_same': 'Category name was not changed.'
  }
};

let currentLanguage = 'id';

export function setLanguage(lang) {
  currentLanguage = lang === 'en' ? 'en' : 'id';
}

export function getLanguage() {
  return currentLanguage;
}

/**
 * Returns translated string with parameter replacements
 * @param {string} key
 * @param {Object} [params]
 * @param {'id'|'en'} [lang]
 * @returns {string}
 */
export function t(key, params = {}, lang = null) {
  const activeLang = lang || currentLanguage;
  const dict = I18N[activeLang] || I18N['id'];
  let text = dict[key];

  if (text === undefined) {
    // Fallback to Indonesian then English
    text = I18N['id'][key] ?? I18N['en'][key] ?? key;
  }

  if (params && typeof params === 'object') {
    Object.keys(params).forEach((p) => {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
  }

  return text;
}

/**
 * Automatically scans and updates all elements with:
 * - data-i18n: updates textContent
 * - data-i18n-html: updates innerHTML
 * - data-i18n-title: updates title attribute
 * - data-i18n-placeholder: updates placeholder attribute
 * @param {'id'|'en'} [lang]
 */
export function applyDOMTranslations(lang = null) {
  if (lang) setLanguage(lang);
  const activeLang = currentLanguage;

  // textContent
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key, {}, activeLang);
    }
  });

  // innerHTML (for strings containing markup like <strong>)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (key) {
      el.innerHTML = t(key, {}, activeLang);
    }
  });

  // title
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.title = t(key, {}, activeLang);
    }
  });

  // placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key, {}, activeLang);
    }
  });
}
