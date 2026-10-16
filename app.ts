import {
  CRABNEBULA_SVGS,
  CRABNEBULA_EXT_MAP,
  CRABNEBULA_FOLDER_MAP,
  CRABNEBULA_DEFAULT_FOLDER,
  CRABNEBULA_DEFAULT_FILE,
} from './fileIconsBundle';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'archive';
  sizeBytes: number;
  sizeFormatted: string;
  modifiedDate: string;
  content?: string;
  children?: FileItem[];
}

export interface AppTheme {
  id: string;
  name: string;
  description: string;
  bgPreview: string;
  accentPreview: string;
}

export const AVAILABLE_THEMES: AppTheme[] = [
  {
    id: 'amoled',
    name: 'AMOLED Pure Black',
    description: 'Deep #000000 black for OLED screens',
    bgPreview: '#000000',
    accentPreview: '#448AFF',
  },
  {
    id: 'charcoal',
    name: 'Material Charcoal',
    description: 'Android standard dark charcoal #121212',
    bgPreview: '#1E1E1E',
    accentPreview: '#82B1FF',
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    description: 'Deep midnight blue with sky accent',
    bgPreview: '#0A0E17',
    accentPreview: '#38BDF8',
  },
  {
    id: 'emerald',
    name: 'Emerald Dark',
    description: 'Dark forest green with mint accent',
    bgPreview: '#06110D',
    accentPreview: '#00E676',
  },
  {
    id: 'amber',
    name: 'Cyber Amber',
    description: 'AMOLED dark with amber gold accent',
    bgPreview: '#0C0A05',
    accentPreview: '#FFB300',
  },
  {
    id: 'light',
    name: 'Paper Light',
    description: 'Crisp clean material light mode',
    bgPreview: '#FFFFFF',
    accentPreview: '#1A73E8',
  },
];

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'cabin',
    name: 'Cabin',
    fontFamily: "'Cabin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'lato',
    name: 'Lato',
    fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    fontFamily: "'IBM Plex Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  {
    id: 'ibm-plex-sans',
    name: 'IBM Plex Sans',
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'roboto',
    name: 'Roboto',
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
];

type SortCriteria = 'name' | 'date' | 'size';

// Initial sample data representing internal shared storage
const INITIAL_FILE_SYSTEM: FileItem[] = [
  {
    id: 'f-alarms',
    name: 'Alarms',
    type: 'folder',
    sizeBytes: 4096,
    sizeFormatted: '4.0 KB',
    modifiedDate: 'Oct 02, 2026',
    children: [
      {
        id: 'f-alarm-1',
        name: 'rooster_morning.ogg',
        type: 'file',
        sizeBytes: 345000,
        sizeFormatted: '336 KB',
        modifiedDate: 'Sep 12, 2026',
        content: '[Audio Data: Morning Rooster Alarm]',
      },
    ],
  },
  {
    id: 'f-android',
    name: 'Android',
    type: 'folder',
    sizeBytes: 8192,
    sizeFormatted: '8.0 KB',
    modifiedDate: 'Oct 08, 2026',
    children: [
      {
        id: 'f-android-data',
        name: 'data',
        type: 'folder',
        sizeBytes: 4096,
        sizeFormatted: '4.0 KB',
        modifiedDate: 'Oct 08, 2026',
        children: [],
      },
      {
        id: 'f-android-media',
        name: 'media',
        type: 'folder',
        sizeBytes: 4096,
        sizeFormatted: '4.0 KB',
        modifiedDate: 'Oct 04, 2026',
        children: [],
      },
    ],
  },
  {
    id: 'f-dcim',
    name: 'DCIM',
    type: 'folder',
    sizeBytes: 16384,
    sizeFormatted: '16.0 KB',
    modifiedDate: 'Oct 10, 2026',
    children: [
      {
        id: 'f-dcim-camera',
        name: 'Camera',
        type: 'folder',
        sizeBytes: 4096,
        sizeFormatted: '4.0 KB',
        modifiedDate: 'Oct 10, 2026',
        children: [
          {
            id: 'f-photo-1',
            name: 'IMG_20261010_104215.jpg',
            type: 'file',
            sizeBytes: 3420000,
            sizeFormatted: '3.3 MB',
            modifiedDate: 'Oct 10, 2026',
          },
          {
            id: 'f-photo-2',
            name: 'IMG_20261009_182045.jpg',
            type: 'file',
            sizeBytes: 4120000,
            sizeFormatted: '3.9 MB',
            modifiedDate: 'Oct 09, 2026',
          },
        ],
      },
      {
        id: 'f-dcim-screenshots',
        name: 'Screenshots',
        type: 'folder',
        sizeBytes: 4096,
        sizeFormatted: '4.0 KB',
        modifiedDate: 'Oct 06, 2026',
        children: [],
      },
    ],
  },
  {
    id: 'f-documents',
    name: 'Documents',
    type: 'folder',
    sizeBytes: 4096,
    sizeFormatted: '4.0 KB',
    modifiedDate: 'Sep 28, 2026',
    children: [
      {
        id: 'f-doc-budget',
        name: 'Quarterly_Budget.pdf',
        type: 'file',
        sizeBytes: 524000,
        sizeFormatted: '512 KB',
        modifiedDate: 'Sep 28, 2026',
      },
    ],
  },
  {
    id: 'f-download',
    name: 'Download',
    type: 'folder',
    sizeBytes: 12288,
    sizeFormatted: '12.0 KB',
    modifiedDate: 'Oct 11, 2026',
    children: [
      {
        id: 'f-dl-apk',
        name: 'termux-v0.118.apk',
        type: 'file',
        sizeBytes: 98000000,
        sizeFormatted: '93.5 MB',
        modifiedDate: 'Oct 05, 2026',
      },
    ],
  },
  {
    id: 'f-movies',
    name: 'Movies',
    type: 'folder',
    sizeBytes: 4096,
    sizeFormatted: '4.0 KB',
    modifiedDate: 'Aug 14, 2026',
    children: [],
  },
  {
    id: 'f-music',
    name: 'Music',
    type: 'folder',
    sizeBytes: 8192,
    sizeFormatted: '8.0 KB',
    modifiedDate: 'Sep 15, 2026',
    children: [
      {
        id: 'f-music-1',
        name: 'synthwave_session.mp3',
        type: 'file',
        sizeBytes: 9400000,
        sizeFormatted: '8.9 MB',
        modifiedDate: 'Sep 15, 2026',
      },
    ],
  },
  {
    id: 'f-pictures',
    name: 'Pictures',
    type: 'folder',
    sizeBytes: 4096,
    sizeFormatted: '4.0 KB',
    modifiedDate: 'Oct 01, 2026',
    children: [
      {
        id: 'f-pic-wall',
        name: 'amoled_minimal.png',
        type: 'file',
        sizeBytes: 1850000,
        sizeFormatted: '1.7 MB',
        modifiedDate: 'Oct 01, 2026',
      },
    ],
  },
  {
    id: 'f-termux',
    name: 'Termux',
    type: 'folder',
    sizeBytes: 4096,
    sizeFormatted: '4.0 KB',
    modifiedDate: 'Oct 10, 2026',
    children: [
      {
        id: 'f-termux-script',
        name: 'deploy.sh',
        type: 'file',
        sizeBytes: 1240,
        sizeFormatted: '1.2 KB',
        modifiedDate: 'Oct 10, 2026',
        content: '#!/bin/bash\n# Android build script\necho "Compiling application..."\nexit 0',
      },
    ],
  },
  {
    id: 'f-notes',
    name: 'notes.txt',
    type: 'file',
    sizeBytes: 1840,
    sizeFormatted: '1.8 KB',
    modifiedDate: 'Oct 12, 2026',
    content:
      'Android File Manager - Release Notes\n------------------------------------\n1. AMOLED Black Theme (#000000)\n2. Pure TypeScript architecture\n3. Zero external frameworks\n4. Fast reactive file browser\n5. Android 48px touch targets',
  },
  {
    id: 'f-index-html',
    name: 'index.html',
    type: 'file',
    sizeBytes: 4210,
    sizeFormatted: '4.2 KB',
    modifiedDate: 'Oct 11, 2026',
    content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Files</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n</body>\n</html>',
  },
  {
    id: 'f-photo-jpg',
    name: 'photo.jpg',
    type: 'file',
    sizeBytes: 2450000,
    sizeFormatted: '2.4 MB',
    modifiedDate: 'Oct 10, 2026',
    content: '[JPEG Image Data: 1920x1080]',
  },
  {
    id: 'f-backup',
    name: 'backup.zip',
    type: 'archive',
    sizeBytes: 50855936,
    sizeFormatted: '48.5 MB',
    modifiedDate: 'Oct 09, 2026',
    content: '[Encrypted Archive: 24 files compressed]',
  },
];

// Action buttons for list items (chevron for opening folders, 3-dots for file options)
const ACTION_ICONS = {
  chevron: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`,
  dots: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="12" cy="19" r="1.75"/></svg>`,
};

/**
 * @crabnebula/file-icons library integration for files and folder icons
 */
export function getFileAndFolderIcon(item: FileItem): { svg: string; category: string } {
  if (item.type === 'folder') {
    const lowerName = item.name.toLowerCase();
    const folderIconId = CRABNEBULA_FOLDER_MAP[lowerName] || CRABNEBULA_DEFAULT_FOLDER;
    const rawSvg = CRABNEBULA_SVGS[folderIconId] || CRABNEBULA_SVGS[CRABNEBULA_DEFAULT_FOLDER];
    const preparedSvg = rawSvg
      ? rawSvg.replace(/<svg\b([^>]*)>/, '<svg class="item-icon-svg" $1 width="24" height="24">')
      : `<img src="/file-icons/${folderIconId}.svg" alt="folder" class="item-icon-svg" width="24" height="24" />`;
    return {
      svg: preparedSvg,
      category: 'folder',
    };
  }

  const ext = item.name.split('.').pop()?.toLowerCase() || '';

  // Resolve category for styling cues
  let category = 'file';
  if (item.type === 'archive' || ['zip', 'tar', 'gz', '7z', 'rar', 'bz2', 'xz', 'iso'].includes(ext)) {
    category = 'archive';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'heic'].includes(ext)) {
    category = 'image';
  } else if (['mp3', 'ogg', 'wav', 'flac', 'm4a', 'aac', 'opus', 'mid'].includes(ext)) {
    category = 'audio';
  } else if (['mp4', 'mkv', 'webm', 'mov', 'avi', 'flv', '3gp'].includes(ext)) {
    category = 'video';
  } else if (['ts', 'js', 'py', 'html', 'css', 'c', 'cpp', 'java', 'go', 'rs', 'php', 'sql', 'sh', 'json', 'yaml', 'yml', 'xml'].includes(ext)) {
    category = 'code';
  } else if (['apk', 'aab', 'bin', 'exe'].includes(ext)) {
    category = 'apk';
  } else if (['xls', 'xlsx', 'csv', 'tsv'].includes(ext)) {
    category = 'spreadsheet';
  } else if (['key', 'pem', 'crt', 'cer', 'pub'].includes(ext)) {
    category = 'key';
  } else if (['txt', 'pdf', 'doc', 'docx', 'md', 'rtf', 'log'].includes(ext)) {
    category = 'text';
  }

  const fileIconId = CRABNEBULA_EXT_MAP[ext] || CRABNEBULA_DEFAULT_FILE;
  const rawSvg = CRABNEBULA_SVGS[fileIconId] || CRABNEBULA_SVGS[CRABNEBULA_DEFAULT_FILE];
  const preparedSvg = rawSvg
    ? rawSvg.replace(/<svg\b([^>]*)>/, '<svg class="item-icon-svg" $1 width="24" height="24">')
    : `<img src="/file-icons/${fileIconId}.svg" alt="${item.name}" class="item-icon-svg" width="24" height="24" />`;

  return {
    svg: preparedSvg,
    category,
  };
}

/**
 * State Manager for Android File Manager
 */
class FileManagerApp {
  private fileSystem: FileItem[];
  private currentPath: string[] = []; // e.g. ['DCIM', 'Camera']
  private searchQuery: string = '';
  private sortCriteria: SortCriteria = 'name';
  private showHiddenFiles: boolean = false;
  private activeTab: 'home' | 'files' | 'settings' = 'home';
  private selectedItem: FileItem | null = null;
  private currentTheme: string = 'amoled';
  private currentFont: string = 'inter';
  private isSearchOpen: boolean = false;

  // DOM Elements
  private appTitleEl!: HTMLElement;
  private btnBackEl!: HTMLButtonElement;
  private btnOpenSearchEl!: HTMLButtonElement;
  private btnTopMenuEl!: HTMLButtonElement;
  private searchSectionEl?: HTMLElement | null;
  private searchInputEl!: HTMLInputElement;
  private searchClearBtnEl!: HTMLButtonElement;
  private searchCloseBtnEl?: HTMLButtonElement | null;
  private pathBarEl!: HTMLElement;
  private fileListEl!: HTMLUListElement;
  private emptyStateEl!: HTMLElement;
  private btnFabEl!: HTMLButtonElement;
  private fabMenuEl!: HTMLElement;
  private menuBackdropEl!: HTMLElement;
  private topMenuPopupEl!: HTMLElement;
  private itemMenuPopupEl!: HTMLElement;
  private modalContainerEl!: HTMLElement;
  private modalTitleEl!: HTMLElement;
  private modalBodyEl!: HTMLElement;
  private modalBtnCancelEl!: HTMLButtonElement;
  private modalBtnConfirmEl!: HTMLButtonElement;
  private toastEl!: HTMLElement;
  private filesViewEl!: HTMLElement;
  private homeViewEl!: HTMLElement;
  private settingsViewEl!: HTMLElement;
  private toggleHiddenEl!: HTMLButtonElement;
  private toggleAnimationsEl!: HTMLButtonElement;
  private settingThemeRowEl!: HTMLElement;
  private currentThemeLabelEl!: HTMLElement;
  private themePreviewDotEl!: HTMLElement;
  private themeCardsGridEl!: HTMLElement;
  private settingFontRowEl!: HTMLElement;
  private currentFontLabelEl!: HTMLElement;
  private navTabs!: NodeListOf<HTMLButtonElement>;

  // Callback holder for confirmation modal
  private modalConfirmHandler: (() => void) | null = null;

  constructor() {
    this.fileSystem = JSON.parse(JSON.stringify(INITIAL_FILE_SYSTEM));
  }

  public init(): void {
    this.bindDOMElements();
    this.attachEventListeners();
    const savedTheme = localStorage.getItem('afm_theme') || 'amoled';
    this.applyTheme(savedTheme, false);
    this.renderThemeCards();
    const savedFont = localStorage.getItem('afm_font') || 'inter';
    this.applyFont(savedFont, false);
    const savedAnimations = localStorage.getItem('afm_animations');
    const animationsEnabled = savedAnimations !== null ? savedAnimations === 'true' : true;
    this.applyAnimations(animationsEnabled, false);
    this.setActiveTab(this.activeTab);
    this.render();
  }

  private bindDOMElements(): void {
    this.appTitleEl = document.getElementById('app-title') as HTMLElement;
    this.btnBackEl = document.getElementById('btn-back') as HTMLButtonElement;
    this.btnOpenSearchEl = document.getElementById('btn-open-search') as HTMLButtonElement;
    this.btnTopMenuEl = document.getElementById('btn-top-menu') as HTMLButtonElement;
    this.searchSectionEl = document.getElementById('search-section') as HTMLElement | null;
    this.searchInputEl = document.getElementById('search-input') as HTMLInputElement;
    this.searchClearBtnEl = document.getElementById('search-clear-btn') as HTMLButtonElement;
    this.searchCloseBtnEl = document.getElementById('search-close-btn') as HTMLButtonElement | null;
    this.pathBarEl = document.getElementById('path-bar') as HTMLElement;
    this.fileListEl = document.getElementById('file-list') as HTMLUListElement;
    this.emptyStateEl = document.getElementById('empty-state') as HTMLElement;
    this.btnFabEl = document.getElementById('btn-fab') as HTMLButtonElement;
    this.fabMenuEl = document.getElementById('fab-menu') as HTMLElement;
    this.menuBackdropEl = document.getElementById('menu-backdrop') as HTMLElement;
    this.topMenuPopupEl = document.getElementById('top-menu-popup') as HTMLElement;
    this.itemMenuPopupEl = document.getElementById('item-menu-popup') as HTMLElement;
    this.modalContainerEl = document.getElementById('modal-container') as HTMLElement;
    this.modalTitleEl = document.getElementById('modal-title') as HTMLElement;
    this.modalBodyEl = document.getElementById('modal-body') as HTMLElement;
    this.modalBtnCancelEl = document.getElementById('modal-btn-cancel') as HTMLButtonElement;
    this.modalBtnConfirmEl = document.getElementById('modal-btn-confirm') as HTMLButtonElement;
    this.toastEl = document.getElementById('toast') as HTMLElement;
    this.filesViewEl = document.getElementById('files-view') as HTMLElement;
    this.homeViewEl = document.getElementById('home-view') as HTMLElement;
    this.settingsViewEl = document.getElementById('settings-view') as HTMLElement;
    this.toggleHiddenEl = document.getElementById('toggle-hidden') as HTMLButtonElement;
    this.toggleAnimationsEl = document.getElementById('toggle-animations') as HTMLButtonElement;
    this.settingThemeRowEl = document.getElementById('setting-theme-row') as HTMLElement;
    this.currentThemeLabelEl = document.getElementById('current-theme-label') as HTMLElement;
    this.themePreviewDotEl = document.getElementById('theme-preview-dot') as HTMLElement;
    this.themeCardsGridEl = document.getElementById('theme-cards-grid') as HTMLElement;
    this.settingFontRowEl = document.getElementById('setting-font-row') as HTMLElement;
    this.currentFontLabelEl = document.getElementById('current-font-label') as HTMLElement;
    this.navTabs = document.querySelectorAll('.nav-tab');
  }

  private attachEventListeners(): void {
    // Back Button
    this.btnBackEl.addEventListener('click', () => {
      this.handleNavigateBack();
    });

    // Search Controls
    this.btnOpenSearchEl?.addEventListener('click', () => {
      this.openSearch();
    });

    this.searchCloseBtnEl?.addEventListener('click', () => {
      this.closeSearch();
    });

    // Search Input
    this.searchInputEl.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.searchQuery = target.value.trim().toLowerCase();
      this.searchClearBtnEl.hidden = this.searchQuery === '';
      this.renderFileList();
    });

    this.searchClearBtnEl.addEventListener('click', () => {
      this.searchInputEl.value = '';
      this.searchQuery = '';
      this.searchClearBtnEl.hidden = true;
      this.renderFileList();
      this.searchInputEl.focus();
    });

    this.searchInputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });

    // Top Overflow Menu
    this.btnTopMenuEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleTopMenu();
    });

    // Menu Backdrop (Closes all popups)
    this.menuBackdropEl.addEventListener('click', () => {
      this.closeAllMenus();
    });

    // Top menu actions
    document.getElementById('menu-sort-name')?.addEventListener('click', () => {
      this.sortCriteria = 'name';
      this.closeAllMenus();
      this.renderFileList();
      this.showToast('Sorted by Name');
    });

    document.getElementById('menu-sort-date')?.addEventListener('click', () => {
      this.sortCriteria = 'date';
      this.closeAllMenus();
      this.renderFileList();
      this.showToast('Sorted by Date');
    });

    document.getElementById('menu-sort-size')?.addEventListener('click', () => {
      this.sortCriteria = 'size';
      this.closeAllMenus();
      this.renderFileList();
      this.showToast('Sorted by Size');
    });

    document.getElementById('menu-toggle-hidden')?.addEventListener('click', () => {
      this.showHiddenFiles = !this.showHiddenFiles;
      this.updateHiddenToggleUI();
      this.closeAllMenus();
      this.renderFileList();
      this.showToast(this.showHiddenFiles ? 'Hidden files visible' : 'Hidden files hidden');
    });

    document.getElementById('menu-refresh')?.addEventListener('click', () => {
      this.closeAllMenus();
      this.renderFileList();
      this.showToast('Folder refreshed');
    });

    // Item Contextual Menu Actions
    document.getElementById('item-action-open')?.addEventListener('click', () => {
      if (!this.selectedItem) return;
      const item = this.selectedItem;
      this.closeAllMenus();
      if (item.type === 'folder') {
        this.navigateToFolder(item.name);
      } else {
        this.openFileDetailsOrViewer(item);
      }
    });

    document.getElementById('item-action-rename')?.addEventListener('click', () => {
      if (!this.selectedItem) return;
      const item = this.selectedItem;
      this.closeAllMenus();
      this.promptRename(item);
    });

    document.getElementById('item-action-details')?.addEventListener('click', () => {
      if (!this.selectedItem) return;
      const item = this.selectedItem;
      this.closeAllMenus();
      this.showDetailsModal(item);
    });

    document.getElementById('item-action-delete')?.addEventListener('click', () => {
      if (!this.selectedItem) return;
      const item = this.selectedItem;
      this.closeAllMenus();
      this.promptDelete(item);
    });

    // FAB Button & Actions
    this.btnFabEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFabMenu();
    });

    document.getElementById('btn-new-folder')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeAllMenus();
      this.promptNewFolder();
    });

    document.getElementById('btn-new-file')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeAllMenus();
      this.promptNewFile();
    });

    this.toggleAnimationsEl?.addEventListener('click', () => {
      const currentState = this.toggleAnimationsEl.classList.contains('active');
      this.applyAnimations(!currentState, true);
    });

    // Bottom Navigation Tabs
    this.navTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab') as 'home' | 'files' | 'settings';
        if (targetTab) {
          this.setActiveTab(targetTab);
        }
      });
    });

    // Home tab listeners
    const homeSearchInput = document.getElementById('home-search-input') as HTMLInputElement | null;
    const homeSearchClearBtn = document.getElementById('home-search-clear-btn') as HTMLButtonElement | null;

    homeSearchClearBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (homeSearchInput) {
        homeSearchInput.value = '';
        homeSearchClearBtn.hidden = true;
        homeSearchInput.focus();
      }
    });

    homeSearchInput?.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      if (homeSearchClearBtn) {
        homeSearchClearBtn.hidden = query.length === 0;
      }
      if (query.trim().length > 0) {
        this.setActiveTab('files');
        this.openSearch();
        this.searchInputEl.value = query;
        this.searchQuery = query.toLowerCase().trim();
        this.searchClearBtnEl.hidden = false;
        this.renderFileList();
        this.searchInputEl.focus();
      }
    });

    homeSearchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = (e.target as HTMLInputElement).value;
        if (query.trim().length > 0) {
          this.setActiveTab('files');
          this.openSearch();
          this.searchInputEl.value = query;
          this.searchQuery = query.toLowerCase().trim();
          this.searchClearBtnEl.hidden = false;
          this.renderFileList();
          this.searchInputEl.focus();
        }
      } else if (e.key === 'Escape') {
        if (homeSearchInput) {
          homeSearchInput.value = '';
          if (homeSearchClearBtn) homeSearchClearBtn.hidden = true;
          homeSearchInput.blur();
        }
      }
    });

    const homeStorageSection = document.getElementById('home-storage-section');
    homeStorageSection?.addEventListener('click', () => {
      this.closeSearch();
      this.setActiveTab('files');
      this.currentPath = [];
      this.render();
    });
    homeStorageSection?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.closeSearch();
        this.setActiveTab('files');
        this.currentPath = [];
        this.render();
      }
    });

    document.querySelectorAll('.home-folder-row').forEach((row) => {
      row.addEventListener('click', () => {
        const folderType = (row as HTMLElement).getAttribute('data-folder');
        this.closeSearch();
        this.setActiveTab('files');

        let targetFolder = '';
        if (folderType === 'Images') {
          targetFolder = this.fileSystem.some((i) => i.name === 'Pictures')
            ? 'Pictures'
            : this.fileSystem.some((i) => i.name === 'DCIM')
            ? 'DCIM'
            : '';
        } else if (folderType === 'Videos') {
          targetFolder = this.fileSystem.some((i) => i.name === 'Movies')
            ? 'Movies'
            : this.fileSystem.some((i) => i.name === 'Videos')
            ? 'Videos'
            : '';
        } else if (folderType === 'Audio') {
          targetFolder = this.fileSystem.some((i) => i.name === 'Music')
            ? 'Music'
            : this.fileSystem.some((i) => i.name === 'Audio')
            ? 'Audio'
            : '';
        } else if (folderType === 'Documents') {
          targetFolder = this.fileSystem.some((i) => i.name === 'Documents') ? 'Documents' : '';
        }

        if (targetFolder) {
          this.currentPath = [targetFolder];
        } else {
          this.currentPath = [];
        }
        this.render();
      });
    });

    // Settings Toggle
    this.toggleHiddenEl.addEventListener('click', () => {
      this.showHiddenFiles = !this.showHiddenFiles;
      this.updateHiddenToggleUI();
      this.renderFileList();
    });

    // Theme Settings Click (Dialog)
    this.settingThemeRowEl.addEventListener('click', () => {
      this.openThemeChoiceModal();
    });

    // Theme Settings Keydown (Accessibility)
    this.settingThemeRowEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openThemeChoiceModal();
      }
    });

    // Theme Quick Cards Grid Click
    this.themeCardsGridEl.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.theme-card-option') as HTMLElement;
      if (card) {
        const themeId = card.getAttribute('data-theme-id');
        if (themeId && themeId !== this.currentTheme) {
          this.applyTheme(themeId, true);
        }
      }
    });

    // Font Settings Click (Dialog)
    this.settingFontRowEl?.addEventListener('click', () => {
      this.openFontChoiceModal();
    });

    // Font Settings Keydown (Accessibility)
    this.settingFontRowEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openFontChoiceModal();
      }
    });

    // Modal Cancel & Confirm
    this.modalBtnCancelEl.addEventListener('click', () => {
      this.closeModal();
    });

    this.modalBtnConfirmEl.addEventListener('click', () => {
      if (this.modalConfirmHandler) {
        this.modalConfirmHandler();
      }
    });

    // Event delegation on file list for high performance & clean architecture
    this.fileListEl.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked the overflow button
      const menuBtn = target.closest('.row-action-btn.file-menu-btn') as HTMLElement;
      if (menuBtn) {
        e.stopPropagation();
        const itemId = menuBtn.getAttribute('data-id');
        if (itemId) {
          const item = this.findItemInCurrentDir(itemId);
          if (item) {
            this.openItemMenu(item, menuBtn);
          }
        }
        return;
      }

      // Check if clicked anywhere on a row
      const row = target.closest('.file-row') as HTMLElement;
      if (row) {
        const itemId = row.getAttribute('data-id');
        if (itemId) {
          const item = this.findItemInCurrentDir(itemId);
          if (item) {
            if (item.type === 'folder') {
              this.navigateToFolder(item.name);
            } else {
              this.openFileDetailsOrViewer(item);
            }
          }
        }
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.modalContainerEl.hidden) {
          this.closeModal();
        } else {
          this.closeAllMenus();
        }
      }
    });
  }

  private currentDirItems: FileItem[] = [];

  // Current Directory Resolution
  private getCurrentDirectoryList(): FileItem[] {
    return this.currentDirItems;
  }

  private findItemInCurrentDir(id: string): FileItem | undefined {
    return this.getCurrentDirectoryList().find((i) => i.id === id);
  }

  // Navigation handlers
  private navigateToFolder(folderName: string): void {
    this.closeSearch();
    if (folderName === 'data' && this.currentPath.length === 1 && this.currentPath[0] === 'Android') {
      this.showAndroidDataRestrictionModal();
      return;
    }
    this.currentPath.push(folderName);
    this.render();
  }

  private showAndroidDataRestrictionModal(): void {
    this.openModal({
      title: 'Android System Access Restriction',
      confirmLabel: 'Understood',
      isDanger: false,
      renderContent: () => `
        <div style="text-align: left; line-height: 1.5; font-size: 14px; color: var(--text-primary);">
          <p style="margin-bottom: 12px; font-weight: 600; color: #ffb74d;">Cannot access Android/data directory</p>
          <p style="margin-bottom: 12px;">Due to Android OS security policies (Scoped Storage restrictions introduced in Android 11+), Google restricts all third-party file managers and apps from reading or writing inside the <strong>Android/data</strong> and <strong>Android/obb</strong> folders.</p>
          <p style="margin-bottom: 0; color: var(--text-secondary); font-size: 13px;">This is an official Android operating system restriction, <strong>not a bug</strong> in this File Manager.</p>
        </div>
      `,
      onConfirm: () => {
        this.closeModal();
      },
    });
  }

  // Search Box Open / Close Handlers
  private openSearch(): void {
    if (this.activeTab !== 'files') {
      this.setActiveTab('files');
    }
    this.isSearchOpen = true;
    if (this.searchSectionEl) {
      this.searchSectionEl.hidden = false;
      this.searchSectionEl.style.display = 'block';
    }
    this.searchInputEl?.focus();
  }

  private closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    if (this.searchInputEl) {
      this.searchInputEl.value = '';
    }
    if (this.searchClearBtnEl) {
      this.searchClearBtnEl.hidden = true;
    }
    if (this.searchSectionEl) {
      this.searchSectionEl.hidden = true;
      this.searchSectionEl.style.display = 'none';
    }
    this.renderFileList();
  }

  private handleNavigateBack(): void {
    if (this.isSearchOpen || this.searchQuery !== '') {
      this.closeSearch();
      return;
    }

    if (this.currentPath.length > 0) {
      this.currentPath.pop();
      this.render();
    } else {
      this.showToast('Already at Internal Storage root');
    }
  }

  private setActiveTab(tab: 'home' | 'files' | 'settings'): void {
    this.activeTab = tab;

    this.navTabs.forEach((tabBtn) => {
      const isTarget = tabBtn.getAttribute('data-tab') === tab;
      tabBtn.classList.toggle('active', isTarget);
      tabBtn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    const isFilesTab = tab === 'files';
    this.filesViewEl.hidden = !isFilesTab;
    this.homeViewEl.hidden = tab !== 'home';
    this.settingsViewEl.hidden = tab !== 'settings';

    // Top bar search button visibility
    if (this.btnOpenSearchEl) {
      this.btnOpenSearchEl.style.display = isFilesTab ? 'inline-flex' : 'none';
    }

    // Top bar and section visibility adjustments
    const fabContainer = document.getElementById('fab-container');
    if (tab === 'home') {
      this.appTitleEl.textContent = 'Files';
      this.btnBackEl.style.display = 'none';
      if (this.btnOpenSearchEl) {
        this.btnOpenSearchEl.style.display = 'none';
      }
      this.btnTopMenuEl.style.display = 'inline-flex';
      this.pathBarEl.style.display = 'none';
      if (this.searchSectionEl) {
        this.searchSectionEl.hidden = true;
        this.searchSectionEl.style.display = 'none';
      }
      if (fabContainer) fabContainer.style.display = 'block';
      const homeSearchInput = document.getElementById('home-search-input') as HTMLInputElement | null;
      if (homeSearchInput) {
        homeSearchInput.value = '';
        const homeSearchClearBtn = document.getElementById('home-search-clear-btn');
        if (homeSearchClearBtn) homeSearchClearBtn.hidden = true;
      }
      this.renderHomeView();
    } else if (tab === 'settings') {
      this.appTitleEl.textContent = 'Settings';
      this.btnBackEl.style.display = 'none';
      if (this.btnOpenSearchEl) {
        this.btnOpenSearchEl.style.display = 'none';
      }
      this.btnTopMenuEl.style.display = 'inline-flex';
      this.pathBarEl.style.display = 'none';
      if (this.searchSectionEl) {
        this.searchSectionEl.hidden = true;
        this.searchSectionEl.style.display = 'none';
      }
      if (fabContainer) fabContainer.style.display = 'none';
    } else {
      // In Files tab
      if (this.btnOpenSearchEl) {
        this.btnOpenSearchEl.style.display = 'inline-flex';
      }
      this.btnBackEl.style.display = this.currentPath.length > 0 ? 'inline-flex' : 'none';
      this.btnTopMenuEl.style.display = 'inline-flex';
      if (this.searchSectionEl) {
        this.searchSectionEl.hidden = !this.isSearchOpen;
        this.searchSectionEl.style.display = this.isSearchOpen ? 'block' : 'none';
      }
      this.pathBarEl.style.display = 'flex';
      if (fabContainer) fabContainer.style.display = 'block';
      this.updateTitleAndBreadcrumbs();
      this.renderFileList();
    }
  }

  private updateHiddenToggleUI(): void {
    this.toggleHiddenEl.classList.toggle('active', this.showHiddenFiles);
    this.toggleHiddenEl.setAttribute('aria-checked', this.showHiddenFiles ? 'true' : 'false');
  }

  // Theme Management
  private applyTheme(themeId: string, showToast = true): void {
    const theme = AVAILABLE_THEMES.find((t) => t.id === themeId) || AVAILABLE_THEMES[0];
    this.currentTheme = theme.id;

    // Set data-theme on html root
    document.documentElement.setAttribute('data-theme', theme.id);

    // Persist choice
    try {
      localStorage.setItem('afm_theme', theme.id);
    } catch {
      // Ignore if localStorage unavailable
    }

    // Update Meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.bgPreview);
    }

    // Update Settings UI indicators
    if (this.currentThemeLabelEl) {
      this.currentThemeLabelEl.textContent = theme.name;
    }

    if (this.themePreviewDotEl) {
      this.themePreviewDotEl.style.backgroundColor = theme.bgPreview;
      this.themePreviewDotEl.style.borderColor = theme.accentPreview;
    }

    // Update active state in quick cards
    if (this.themeCardsGridEl) {
      this.themeCardsGridEl.querySelectorAll('.theme-card-option').forEach((card) => {
        const id = card.getAttribute('data-theme-id');
        const isActive = id === theme.id;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }

    if (showToast) {
      this.showToast(`Theme: ${theme.name}`);
    }
  }

  private renderThemeCards(): void {
    if (!this.themeCardsGridEl) return;

    this.themeCardsGridEl.innerHTML = AVAILABLE_THEMES.map((theme) => {
      const isActive = theme.id === this.currentTheme;
      return `
        <div class="theme-card-option ${isActive ? 'active' : ''}" 
             data-theme-id="${theme.id}" 
             role="radio" 
             aria-checked="${isActive ? 'true' : 'false'}"
             tabindex="0"
             title="${theme.description}">
          <div class="theme-swatch-circle" style="background-color: ${theme.bgPreview};">
            <span class="theme-swatch-accent" style="background-color: ${theme.accentPreview};"></span>
          </div>
          <span class="theme-card-label">${this.escapeHtml(theme.name.split(' ')[0])}</span>
        </div>
      `;
    }).join('');
  }

  private openThemeChoiceModal(): void {
    let tempSelectedTheme = this.currentTheme;

    this.openModal({
      title: 'Choose theme',
      confirmLabel: 'Apply',
      isDanger: false,
      renderContent: () => `
        <div class="theme-modal-list" role="radiogroup" aria-label="Available themes">
          ${AVAILABLE_THEMES.map((theme) => {
            const isSelected = theme.id === tempSelectedTheme;
            return `
              <button type="button" class="theme-modal-item ${isSelected ? 'active' : ''}" data-theme-choice="${theme.id}" role="radio" aria-checked="${isSelected ? 'true' : 'false'}">
                <div class="theme-modal-radio">
                  <div class="theme-modal-radio-dot"></div>
                </div>
                <div class="theme-swatch-circle" style="background-color: ${theme.bgPreview}; width: 22px; height: 22px;">
                  <span class="theme-swatch-accent" style="background-color: ${theme.accentPreview}; width: 8px; height: 8px;"></span>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: 500;">${this.escapeHtml(theme.name)}</span>
                  <span style="font-size: 11px; color: var(--text-secondary);">${this.escapeHtml(theme.description)}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      `,
      onConfirm: () => {
        this.applyTheme(tempSelectedTheme, true);
        this.closeModal();
      },
    });

    // Handle selection clicks within the modal
    const items = this.modalBodyEl.querySelectorAll('.theme-modal-item');
    items.forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-theme-choice');
        if (choice) {
          tempSelectedTheme = choice;
          items.forEach((i) => {
            const isTarget = i === btn;
            i.classList.toggle('active', isTarget);
            i.setAttribute('aria-checked', isTarget ? 'true' : 'false');
          });
        }
      });
    });
  }

  // Font Management
  private applyFont(fontId: string, showToast = true): void {
    const font = AVAILABLE_FONTS.find((f) => f.id === fontId) || AVAILABLE_FONTS[0];
    this.currentFont = font.id;

    // Apply data-font and custom CSS property to html root
    document.documentElement.setAttribute('data-font', font.id);
    document.documentElement.style.setProperty('--app-font-family', font.fontFamily);

    // Persist choice
    try {
      localStorage.setItem('afm_font', font.id);
    } catch {
      // Ignore if localStorage unavailable
    }

    // Update Settings UI indicators
    if (this.currentFontLabelEl) {
      this.currentFontLabelEl.textContent = font.name;
    }

    if (showToast) {
      this.showToast(`Font: ${font.name}`);
    }
  }

  private openFontChoiceModal(): void {
    let tempSelectedFont = this.currentFont;

    this.openModal({
      title: 'Choose font',
      confirmLabel: 'Apply',
      isDanger: false,
      renderContent: () => `
        <div class="font-modal-list" role="radiogroup" aria-label="Available fonts">
          ${AVAILABLE_FONTS.map((font) => {
            const isSelected = font.id === tempSelectedFont;
            return `
              <button type="button" class="font-modal-item ${isSelected ? 'active' : ''}" data-font-choice="${font.id}" role="radio" aria-checked="${isSelected ? 'true' : 'false'}" style="font-family: ${font.fontFamily};">
                <div class="font-modal-radio">
                  <div class="font-modal-radio-dot"></div>
                </div>
                <span class="font-modal-name">${this.escapeHtml(font.name)}</span>
              </button>
            `;
          }).join('')}
        </div>
      `,
      onConfirm: () => {
        this.applyFont(tempSelectedFont, true);
        this.closeModal();
      },
    });

    // Handle selection clicks within the modal
    const items = this.modalBodyEl.querySelectorAll('.font-modal-item');
    items.forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-font-choice');
        if (choice) {
          tempSelectedFont = choice;
          items.forEach((i) => {
            const isTarget = i === btn;
            i.classList.toggle('active', isTarget);
            i.setAttribute('aria-checked', isTarget ? 'true' : 'false');
          });
        }
      });
    });
  }

  // Home View Rendering & Dynamic Info
  private renderHomeView(): void {
    // 1. Storage Metric
    const metricEl = document.getElementById('home-storage-metric');
    if (metricEl) {
      metricEl.textContent = '24.5 GB / 64 GB';
    }

    // 2. Render Recent Files List using @crabnebula/file-icons
    const recentListEl = document.getElementById('home-recent-list');
    if (recentListEl) {
      const allFiles: { file: FileItem; path: string[] }[] = [];
      const collectFiles = (items: FileItem[], path: string[]) => {
        for (const item of items) {
          if (item.type === 'file') {
            allFiles.push({ file: item, path });
          } else if (item.children) {
            collectFiles(item.children, [...path, item.name]);
          }
        }
      };
      collectFiles(this.fileSystem, []);

      // Sort by modified date descending (newest first)
      allFiles.sort((a, b) => new Date(b.file.modifiedDate).getTime() - new Date(a.file.modifiedDate).getTime());
      const recentSlice = allFiles.slice(0, 5);

      if (recentSlice.length === 0) {
        recentListEl.innerHTML = '<div style="padding: 10px 0; color: var(--text-secondary); font-size: 13.5px;">No recent files</div>';
      } else {
        recentListEl.innerHTML = recentSlice
          .map(({ file }) => {
            const { svg } = getFileAndFolderIcon(file);
            return `
              <div class="home-list-row home-file-row" data-id="${file.id}">
                <button type="button" class="home-row-left home-file-open-btn" data-id="${file.id}" title="Open ${this.escapeHtml(file.name)}">
                  <span class="home-file-icon" aria-hidden="true">${svg}</span>
                  <span class="home-row-label">${this.escapeHtml(file.name)}</span>
                </button>
                <button type="button" class="home-row-menu-btn icon-btn" data-id="${file.id}" aria-label="More options for ${this.escapeHtml(file.name)}" title="More options">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.75"/>
                    <circle cx="12" cy="12" r="1.75"/>
                    <circle cx="12" cy="19" r="1.75"/>
                  </svg>
                </button>
              </div>
            `;
          })
          .join('');

        // Wire click handlers for open and options menu
        recentListEl.querySelectorAll('.home-file-open-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const target = recentSlice.find((r) => r.file.id === id);
            if (target) {
              this.currentPath = target.path;
              this.openFileDetailsOrViewer(target.file);
            }
          });
        });

        recentListEl.querySelectorAll('.home-row-menu-btn').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            const target = recentSlice.find((r) => r.file.id === id);
            if (target) {
              this.currentPath = target.path;
              this.openItemMenu(target.file, btn as HTMLElement);
            }
          });
        });
      }
    }
  }

  // Rendering
  private render(): void {
    if (this.activeTab === 'home') {
      this.renderHomeView();
    }
    this.updateTitleAndBreadcrumbs();
    this.renderFileList();
  }

  private updateTitleAndBreadcrumbs(): void {
    if (this.currentPath.length === 0) {
      this.appTitleEl.textContent = 'Files';
    } else {
      this.appTitleEl.textContent = this.currentPath[this.currentPath.length - 1];
    }

    // Render breadcrumb navigation
    let breadcrumbHtml = `<span class="path-crumb ${this.currentPath.length === 0 ? 'active' : ''}" data-index="-1">Internal Storage</span>`;

    this.currentPath.forEach((folder, idx) => {
      const isLast = idx === this.currentPath.length - 1;
      breadcrumbHtml += ` <span>›</span> <span class="path-crumb ${isLast ? 'active' : ''}" data-index="${idx}">${this.escapeHtml(folder)}</span>`;
    });

    this.pathBarEl.innerHTML = breadcrumbHtml;

    // Breadcrumb clicks
    this.pathBarEl.querySelectorAll('.path-crumb').forEach((crumb) => {
      crumb.addEventListener('click', () => {
        const indexStr = (crumb as HTMLElement).getAttribute('data-index');
        if (indexStr !== null) {
          const index = parseInt(indexStr, 10);
          if (index === -1) {
            this.currentPath = [];
          } else {
            this.currentPath = this.currentPath.slice(0, index + 1);
          }
          this.searchQuery = '';
          this.searchInputEl.value = '';
          this.searchClearBtnEl.hidden = true;
          this.render();
        }
      });
    });
  }

  private async renderFileList(): Promise<void> {
    if (this.currentPath.length >= 2 && this.currentPath[0] === 'Android' && this.currentPath[1] === 'data') {
      this.fileListEl.innerHTML = `
        <li style="padding: 40px 24px; text-align: center; color: var(--text-secondary);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; color: #ffb74d;">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">Access Restricted by Android OS</div>
          <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-secondary); margin-bottom: 16px;">
            Android/data cannot be accessed due to system-level Scoped Storage security restrictions introduced in Android 11+.
          </p>
          <p style="font-size: 13px; color: var(--accent-blue); font-weight: 500;">
            This is an official Android system restriction, not a bug in File Manager.
          </p>
        </li>
      `;
      this.emptyStateEl.hidden = true;
      return;
    }

    try {
      const pathParam = this.currentPath.join('/');
      const res = await fetch(`/api/files?path=${encodeURIComponent(pathParam)}`);
      const data = await res.json();
      if (data.success) {
        this.currentDirItems = data.items;
      } else {
        this.currentDirItems = [];
      }
    } catch {
      this.currentDirItems = [];
    }

    let items = [...this.currentDirItems];

    // Hidden files filter
    if (!this.showHiddenFiles) {
      items = items.filter((item) => !item.name.startsWith('.'));
    }

    // Search filter
    if (this.searchQuery) {
      items = items.filter((item) => item.name.toLowerCase().includes(this.searchQuery));
    }

    // Sorting
    items = [...items].sort((a, b) => {
      // Folders always first unless sorting explicitly by size or date
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      if (this.sortCriteria === 'name') {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      } else if (this.sortCriteria === 'size') {
        return b.sizeBytes - a.sizeBytes;
      } else if (this.sortCriteria === 'date') {
        return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime();
      }
      return 0;
    });

    if (items.length === 0) {
      this.fileListEl.innerHTML = '';
      this.emptyStateEl.hidden = false;
      return;
    }

    this.emptyStateEl.hidden = true;

    // Render items matching exact ASCII reference:
    // [folder] FolderName     ›
    // [file]   FileName       ⋮
    // [zip]    ArchiveName    ⋮
    this.fileListEl.innerHTML = items
      .map((item) => {
        const isFolder = item.type === 'folder';
        const { svg: iconSvg, category } = getFileAndFolderIcon(item);
        const actionButton = isFolder
          ? `<span class="row-action-btn" aria-label="Open folder" role="img">${ACTION_ICONS.chevron}</span>`
          : `<button class="row-action-btn file-menu-btn" data-id="${item.id}" aria-label="More options for ${this.escapeHtml(item.name)}" title="More options">${ACTION_ICONS.dots}</button>`;

        return `
        <li class="file-row" data-id="${item.id}" role="listitem">
          <div class="file-row-main">
            <span class="item-icon-wrapper ${category}">
              ${iconSvg}
            </span>
            <div class="file-info">
              <span class="file-name" title="${this.escapeHtml(item.name)}">${this.escapeHtml(item.name)}</span>
              <span class="file-meta">${isFolder ? 'Folder' : item.sizeFormatted} · ${item.modifiedDate}</span>
            </div>
          </div>
          ${actionButton}
        </li>
      `;
      })
      .join('');
  }

  // Menus
  private toggleTopMenu(): void {
    const isOpen = this.topMenuPopupEl.classList.contains('show');
    this.closeAllMenus();
    if (!isOpen) {
      this.topMenuPopupEl.classList.add('show');
      this.menuBackdropEl.classList.add('show');
    }
  }

  private toggleFabMenu(): void {
    const isOpen = this.fabMenuEl.classList.contains('show');
    this.closeAllMenus();
    if (!isOpen) {
      this.fabMenuEl.classList.add('show');
      this.btnFabEl.classList.add('open');
      this.btnFabEl.setAttribute('aria-expanded', 'true');
      this.menuBackdropEl.classList.add('show');
    }
  }

  private openItemMenu(item: FileItem, anchorBtn: HTMLElement): void {
    this.closeAllMenus();
    this.selectedItem = item;

    const rect = anchorBtn.getBoundingClientRect();
    const viewportRect = document.querySelector('.app-viewport')?.getBoundingClientRect();

    let top = rect.bottom + 4;
    let right = 16;

    if (viewportRect) {
      right = Math.max(16, viewportRect.right - rect.right);
    }

    // Keep within bottom bounds
    if (top + 180 > window.innerHeight) {
      top = rect.top - 180;
    }

    this.itemMenuPopupEl.style.top = `${top}px`;
    this.itemMenuPopupEl.style.right = `${right}px`;
    this.itemMenuPopupEl.classList.add('show');
    this.menuBackdropEl.classList.add('show');
  }

  private closeAllMenus(): void {
    this.topMenuPopupEl.classList.remove('show');
    this.itemMenuPopupEl.classList.remove('show');
    this.fabMenuEl.classList.remove('show');
    this.btnFabEl.classList.remove('open');
    this.btnFabEl.setAttribute('aria-expanded', 'false');
    this.menuBackdropEl.classList.remove('show');
  }

  // Modals & User Actions
  private promptNewFolder(): void {
    this.openModal({
      title: 'New folder',
      confirmLabel: 'Create',
      isDanger: false,
      renderContent: () => `
        <label for="folder-name-input" class="sr-only" style="display:none;">Folder name</label>
        <input type="text" id="folder-name-input" class="modal-input" placeholder="Folder name" value="New folder" autofocus />
      `,
      onConfirm: async () => {
        const input = document.getElementById('folder-name-input') as HTMLInputElement;
        const name = input?.value.trim();
        if (!name) return;

        const parentPath = this.currentPath.join('/');
        try {
          const res = await fetch('/api/files/create-folder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentPath, name }),
          });
          const data = await res.json();
          if (!data.success) {
            this.showToast(data.error || 'Failed to create folder');
            return;
          }
        } catch (err: any) {
          this.showToast(err.message || 'Failed to create folder');
          return;
        }

        if (this.activeTab === 'home') {
          this.setActiveTab('files');
        }
        this.closeModal();
        await this.renderFileList();
        this.showToast(`Folder "${name}" created`);
      },
    });
  }

  private promptNewFile(): void {
    this.openModal({
      title: 'New file',
      confirmLabel: 'Create',
      isDanger: false,
      renderContent: () => `
        <label for="file-name-input" class="sr-only" style="display:none;">File name</label>
        <input type="text" id="file-name-input" class="modal-input" placeholder="File name (e.g. document.txt)" value="new_note.txt" autofocus />
      `,
      onConfirm: async () => {
        const input = document.getElementById('file-name-input') as HTMLInputElement;
        const name = input?.value.trim();
        if (!name) return;

        const parentPath = this.currentPath.join('/');
        try {
          const res = await fetch('/api/files/create-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentPath, name, content: 'Created via File Manager' }),
          });
          const data = await res.json();
          if (!data.success) {
            this.showToast(data.error || 'Failed to create file');
            return;
          }
        } catch (err: any) {
          this.showToast(err.message || 'Failed to create file');
          return;
        }

        if (this.activeTab === 'home') {
          this.setActiveTab('files');
        }
        this.closeModal();
        await this.renderFileList();
        this.showToast(`File "${name}" created`);
      },
    });
  }

  private applyAnimations(enabled: boolean, showToast = true): void {
    if (this.toggleAnimationsEl) {
      this.toggleAnimationsEl.classList.toggle('active', enabled);
      this.toggleAnimationsEl.setAttribute('aria-checked', enabled ? 'true' : 'false');
    }
    document.documentElement.setAttribute('data-animations', enabled ? 'on' : 'off');
    try {
      localStorage.setItem('afm_animations', enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (showToast) {
      this.showToast(enabled ? 'Animations enabled' : 'Animations disabled');
    }
  }

  private promptRename(item: FileItem): void {
    this.openModal({
      title: 'Rename',
      confirmLabel: 'OK',
      isDanger: false,
      renderContent: () => `
        <label for="rename-input" class="sr-only" style="display:none;">New name</label>
        <input type="text" id="rename-input" class="modal-input" value="${this.escapeHtml(item.name)}" autofocus />
      `,
      onConfirm: async () => {
        const input = document.getElementById('rename-input') as HTMLInputElement;
        const newName = input?.value.trim();
        if (!newName || newName === item.name) {
          this.closeModal();
          return;
        }

        const oldPath = [...this.currentPath, item.name].join('/');
        try {
          const res = await fetch('/api/files/rename', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPath, newName }),
          });
          const data = await res.json();
          if (!data.success) {
            this.showToast(data.error || 'Failed to rename');
            return;
          }
        } catch (err: any) {
          this.showToast(err.message || 'Failed to rename');
          return;
        }

        this.closeModal();
        await this.renderFileList();
        this.showToast(`Renamed to "${newName}"`);
      },
    });
  }

  private promptDelete(item: FileItem): void {
    const { svg: iconSvg, category } = getFileAndFolderIcon(item);
    this.openModal({
      title: 'Delete item',
      confirmLabel: 'Delete',
      isDanger: true,
      renderContent: () => `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span class="item-icon-wrapper ${category}" style="width: 24px; height: 24px;">
            ${iconSvg}
          </span>
          <span style="font-weight: 500; color: var(--text-primary); word-break: break-all;">${this.escapeHtml(item.name)}</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 14px; margin: 0;">
          Are you sure you want to permanently delete this ${item.type === 'folder' ? 'folder and its contents' : 'file'}?
        </p>
      `,
      onConfirm: async () => {
        const targetPath = [...this.currentPath, item.name].join('/');
        try {
          const res = await fetch('/api/files/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetPath }),
          });
          const data = await res.json();
          if (!data.success) {
            this.showToast(data.error || 'Failed to delete');
            return;
          }
        } catch (err: any) {
          this.showToast(err.message || 'Failed to delete');
          return;
        }

        this.closeModal();
        await this.renderFileList();
        this.showToast(`Deleted "${item.name}"`);
      },
    });
  }

  private async openFileDetailsOrViewer(item: FileItem): Promise<void> {
    const filePath = [...this.currentPath, item.name].join('/');
    try {
      const res = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.success) {
        this.openModal({
          title: item.name,
          confirmLabel: 'Close',
          isDanger: false,
          renderContent: () => `
            <div class="modal-file-viewer">${this.escapeHtml(data.content)}</div>
          `,
          onConfirm: () => {
            this.closeModal();
          },
        });
        return;
      }
    } catch {
      // fallback
    }
    this.showDetailsModal(item);
  }

  private showDetailsModal(item: FileItem): void {
    const fullPath = '/' + [...this.currentPath, item.name].join('/');
    const { svg: iconSvg, category } = getFileAndFolderIcon(item);
    this.openModal({
      title: 'Details',
      confirmLabel: 'Close',
      isDanger: false,
      renderContent: () => `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
          <span class="item-icon-wrapper ${category}" style="width: 28px; height: 28px;">
            ${iconSvg}
          </span>
          <div style="min-width: 0;">
            <div style="font-weight: 600; color: var(--text-primary); word-break: break-all;">${this.escapeHtml(item.name)}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${item.type === 'folder' ? 'Folder' : item.sizeFormatted}</div>
          </div>
        </div>
        <dl class="modal-details-grid">
          <dt>Name</dt>
          <dd>${this.escapeHtml(item.name)}</dd>
          <dt>Type</dt>
          <dd>${item.type === 'folder' ? 'Folder' : item.type === 'archive' ? 'ZIP Archive' : 'File'}</dd>
          <dt>Size</dt>
          <dd>${item.sizeFormatted} (${item.sizeBytes.toLocaleString()} bytes)</dd>
          <dt>Path</dt>
          <dd>${this.escapeHtml(fullPath)}</dd>
          <dt>Modified</dt>
          <dd>${item.modifiedDate}</dd>
        </dl>
      `,
      onConfirm: () => {
        this.closeModal();
      },
    });
  }

  private openModal(config: {
    title: string;
    confirmLabel: string;
    isDanger: boolean;
    renderContent: () => string;
    onConfirm: () => void;
  }): void {
    this.modalTitleEl.textContent = config.title;
    this.modalBodyEl.innerHTML = config.renderContent();
    this.modalBtnConfirmEl.textContent = config.confirmLabel;
    this.modalBtnConfirmEl.className = config.isDanger ? 'modal-btn danger' : 'modal-btn';
    this.modalConfirmHandler = config.onConfirm;

    this.modalContainerEl.hidden = false;

    // Focus first input if available and bind Enter key to submit
    setTimeout(() => {
      const input = this.modalBodyEl.querySelector('input');
      if (input) {
        input.focus();
        input.select();
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (this.modalConfirmHandler) {
              this.modalConfirmHandler();
            }
          }
        });
      }
    }, 50);
  }

  private closeModal(): void {
    this.modalContainerEl.hidden = true;
    this.modalConfirmHandler = null;
    this.modalBodyEl.innerHTML = '';
  }

  private showToast(message: string): void {
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 2400);
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Safely instantiate and start app exactly once
let appInstance: FileManagerApp | null = null;
const initApp = () => {
  if (!appInstance) {
    appInstance = new FileManagerApp();
    appInstance.init();
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
