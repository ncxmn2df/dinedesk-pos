// ==========================================
// DineDesk — Main Application & Router
// ==========================================

import { store } from './store.js';
import { calculateOrder, calculateChange } from './utils/orderCalc.js';
import { formatINR, formatINRShort } from './utils/currency.js';
import { generateId, formatDate, formatTime, formatDateTime, timeAgo, elapsedTime, debounce, getInitials, escapeHtml } from './utils/helpers.js';
import { showToast } from './utils/toast.js';
import { CATEGORIES, TAX_RATE, ORDER_STATUS, PAYMENT_STATUS, TABLE_STATUS, ORDER_TYPE, PAYMENT_METHOD } from './data/constants.js';
import { revenueChartData, popularItemsData, orderTypeData, hourlyRevenueData } from './data/mockData.js';
import { REPOSITORY_INFO, RELEASES_DATA } from './data/versionHistoryData.js';

// Expose orderCalc globally for store usage
window._orderCalc = { calculateOrder };

// ==========================================
// Lucide-like SVG Icons (inline)
// ==========================================
const ICONS = {
  layoutDashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  shoppingCart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  utensils: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  chefHat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>',
  clipboardList: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  userCog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  helpCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  logOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>',
  dollarSign: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  trendingUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  trendingDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  creditCard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  messageCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  gitCommit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/></svg>',
  gitBranch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l11 11 10-10L12 2z"/><circle cx="7" cy="7" r="1.5"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  banknote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
};

function icon(name, size = 20) {
  return `<span class="icon" style="width:${size}px;height:${size}px;display:inline-flex">${ICONS[name] || ''}</span>`;
}

// ==========================================
// Router
// ==========================================
const routes = {
  login: { title: 'Sign In', group: '', render: renderLogin },
  dashboard: { title: 'Dashboard', group: 'Operations', render: renderDashboard },
  pos: { title: 'Point of Sale', group: 'Operations', render: renderPOS },
  tables: { title: 'Table Management', group: 'Operations', render: renderTables },
  kitchen: { title: 'Kitchen Display', group: 'Operations', render: renderKitchen },
  orders: { title: 'Orders', group: 'Operations', render: renderOrders },
  billing: { title: 'Billing & Payment', group: 'Operations', render: renderBilling },
  menu: { title: 'Menu Management', group: 'Management', render: renderMenu },
  customers: { title: 'Customers', group: 'Management', render: renderCustomers },
  inventory: { title: 'Inventory', group: 'Management', render: renderInventory },
  staff: { title: 'Staff Management', group: 'Management', render: renderStaff },
  expenses: { title: 'Expenses', group: 'Management', render: renderExpenses },
  reports: { title: 'Reports & Analytics', group: 'Analytics', render: renderReports },
  settings: { title: 'Settings', group: 'System', render: renderSettings },
  versionHistory: { title: 'Version History', group: 'System', render: renderVersionHistory },
};

let currentRoute = 'login';
let chartInstances = {};

function navigate(route) {
  // Destroy old charts
  Object.values(chartInstances).forEach(c => c?.destroy?.());
  chartInstances = {};

  if (route !== 'login' && !store.state.auth.isAuthenticated) {
    route = 'login';
  }

  currentRoute = route;
  window.location.hash = route;

  const shell = document.getElementById('app');
  const routeConfig = routes[route];

  if (route === 'login') {
    shell.className = 'app-shell login-view';
    shell.innerHTML = '';
    routeConfig.render(shell);
  } else {
    shell.className = 'app-shell';
    renderAppShell(shell, route);
  }
}

// ==========================================
// Theme Management
// ==========================================
function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('dd-theme', theme);
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  // Re-render to update icon
  navigate(currentRoute);
}

// ==========================================
// Breadcrumb Helper
// ==========================================
function renderBreadcrumb(route) {
  const config = routes[route];
  if (!config || route === 'dashboard') return '';
  const group = config.group || '';
  let crumbs = `<a href="#dashboard">Home</a><span class="breadcrumb-sep">${icon('chevronRight', 12)}</span>`;
  if (group) {
    crumbs += `<span>${group}</span><span class="breadcrumb-sep">${icon('chevronRight', 12)}</span>`;
  }
  crumbs += `<span class="breadcrumb-current">${config.title}</span>`;
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>`;
}

// ==========================================
// App Shell (Sidebar + Header + Content)
// ==========================================
function renderAppShell(container, route) {
  const { state } = store;
  const routeConfig = routes[route];
  const unreadNotifs = state.notifications.filter(n => !n.read).length;
  const userName = state.auth.user?.name || 'Admin';
  const userInitials = getInitials(userName);
  const isDark = getTheme() === 'dark';
  const themeIcon = isDark ? 'sun' : 'moon';
  const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const pendingKitchen = state.orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

  container.innerHTML = `
    <div class="mobile-overlay" id="mobileOverlay"></div>
    <nav class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-header">
        <a class="sidebar-logo" href="#dashboard">
          <div class="sidebar-logo-icon">${icon('utensils', 20)}</div>
          <span class="sidebar-logo-text">DineDesk</span>
        </a>
      </div>
      <div class="sidebar-nav">
        <div class="sidebar-section-title">Operations</div>
        ${sidebarItem('dashboard', 'Dashboard', 'layoutDashboard', route)}
        ${sidebarItem('pos', 'POS', 'shoppingCart', route)}
        ${sidebarItem('tables', 'Tables', 'grid', route)}
        ${sidebarItem('kitchen', 'Kitchen', 'chefHat', route, pendingKitchen > 0 ? pendingKitchen : null)}
        ${sidebarItem('orders', 'Orders', 'clipboardList', route)}
        <div class="sidebar-section-title">Management</div>
        ${sidebarItem('menu', 'Menu', 'bookOpen', route)}
        ${sidebarItem('customers', 'Customers', 'users', route)}
        ${sidebarItem('inventory', 'Inventory', 'package', route)}
        ${sidebarItem('staff', 'Staff', 'userCog', route)}
        ${sidebarItem('expenses', 'Expenses', 'banknote', route)}
        <div class="sidebar-section-title">Analytics</div>
        ${sidebarItem('reports', 'Reports', 'barChart', route)}
        <div class="sidebar-section-title">System</div>
        ${sidebarItem('settings', 'Settings', 'settings', route)}
        ${sidebarItem('versionHistory', 'Releases', 'gitCommit', route)}
      </div>
      <div class="sidebar-footer">
        ${sidebarItem('help', 'Help & Support', 'helpCircle', route)}
        <a class="sidebar-item" id="logoutBtn" role="button" tabindex="0">
          <span class="sidebar-item-icon">${icon('logOut')}</span>
          <span class="sidebar-item-label">Logout</span>
        </a>
      </div>
    </nav>

    <main class="app-main">
      <header class="app-header">
        <div class="header-left">
          <button class="header-menu-btn" id="menuBtn" aria-label="Toggle menu">${icon('menu', 22)}</button>
          <div class="header-page-info">
            <h1 class="header-title">${routeConfig?.title || ''}</h1>
            ${renderBreadcrumb(route)}
          </div>
        </div>
        <div class="header-search" id="headerSearch">
          <span class="header-search-icon">${icon('search', 18)}</span>
          <input class="header-search-input" type="text" placeholder="Search orders, items, customers..." id="globalSearchInput" aria-label="Global search" autocomplete="off">
          <span class="header-search-shortcut">/</span>
        </div>
        <div class="header-right">
          <button class="theme-toggle" id="themeToggle" aria-label="${themeLabel}" title="${themeLabel}">
            ${icon(themeIcon, 20)}
          </button>
          <div style="position:relative">
            <button class="header-icon-btn" id="notifBtn" aria-label="Notifications">
              ${icon('bell')}
              ${unreadNotifs > 0 ? `<span class="header-badge">${unreadNotifs > 9 ? '9+' : unreadNotifs}</span>` : ''}
            </button>
            <div class="notification-dropdown" id="notifDropdown">
              <div class="notification-header">
                <h3 style="font-size:var(--font-size-md);font-weight:var(--font-weight-semibold)">Notifications</h3>
                <button class="btn btn-ghost btn-sm" id="markAllReadBtn" style="font-size:var(--font-size-xs)">Mark all read</button>
              </div>
              <div class="notification-list" id="notifList">
                ${renderNotifications()}
              </div>
            </div>
          </div>
          <div style="position:relative">
            <div class="header-avatar" id="profileBtn" role="button" tabindex="0" aria-label="Profile menu">${userInitials}</div>
            <div class="profile-dropdown" id="profileDropdown">
              <div class="profile-dropdown-header">
                <div class="profile-dropdown-name">${escapeHtml(userName)}</div>
                <div class="profile-dropdown-email">${escapeHtml(state.auth.user?.email || '')}</div>
              </div>
              <a class="profile-dropdown-item" data-nav="settings">${icon('user', 16)} My Profile</a>
              <a class="profile-dropdown-item" data-nav="settings">${icon('settings', 16)} Settings</a>
              <a class="profile-dropdown-item" data-nav="help">${icon('helpCircle', 16)} Help</a>
              <div class="profile-dropdown-divider"></div>
              <a class="profile-dropdown-item danger" id="profileLogout">${icon('logOut', 16)} Logout</a>
            </div>
          </div>
        </div>
      </header>
      <div class="app-content" id="pageContent"></div>
    </main>

    <div class="search-overlay" id="searchOverlay">
      <div class="search-modal">
        <input class="search-modal-input" type="text" placeholder="Search for orders, products, customers, tables..." id="searchModalInput" autocomplete="off">
        <div class="search-results" id="searchResults">
          <div class="empty-state" style="padding:var(--space-8)">
            <div class="empty-state-text">Type to search across orders, products, customers, and tables</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render page content
  const content = document.getElementById('pageContent');
  if (routeConfig?.render && route !== 'login') {
    routeConfig.render(content);
  }

  // Bind shell events
  bindShellEvents();
}

function sidebarItem(route, label, iconName, currentRoute, badgeCount = null) {
  const isActive = route === currentRoute;
  const badge = badgeCount ? `<span class="sidebar-item-badge">${badgeCount}</span>` : '';
  return `<a class="sidebar-item ${isActive ? 'active' : ''}" data-nav="${route}" role="button" tabindex="0" aria-current="${isActive ? 'page' : 'false'}">
    <span class="sidebar-item-icon">${icon(iconName)}</span>
    <span class="sidebar-item-label">${label}</span>
    ${badge}
  </a>`;
}

function renderNotifications() {
  const notifs = store.state.notifications.slice(0, 8);
  if (notifs.length === 0) {
    return '<div class="empty-state" style="padding:var(--space-6)"><div class="empty-state-text">No notifications</div></div>';
  }
  const typeColors = { new_order: 'var(--color-info-bg)', low_inventory: 'var(--color-warning-bg)', payment: 'var(--color-success-bg)', table_reservation: 'var(--color-primary-lighter)', kitchen_delay: 'var(--color-error-bg)', staff_event: 'var(--color-surface-hover)' };
  const typeIcons = { new_order: 'clipboardList', low_inventory: 'alertTriangle', payment: 'wallet', table_reservation: 'grid', kitchen_delay: 'clock', staff_event: 'user' };
  return notifs.map(n => `
    <div class="notification-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
      <div class="notification-icon-wrap" style="background:${typeColors[n.type] || 'var(--color-surface-hover)'}">${icon(typeIcons[n.type] || 'bell', 16)}</div>
      <div class="notification-content">
        <div class="notification-text">${escapeHtml(n.message)}</div>
        <div class="notification-time">${timeAgo(n.createdAt)}</div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// Shell Event Bindings
// ==========================================
function bindShellEvents() {
  // Sidebar navigation
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.dataset.nav;
      if (route === 'help') { showToast('Help & Support coming soon', 'info'); return; }
      navigate(route);
      closeMobileMenu();
    });
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    store.logout();
    navigate('login');
    showToast('Logged out successfully', 'success');
  });

  document.getElementById('profileLogout')?.addEventListener('click', () => {
    store.logout();
    navigate('login');
    showToast('Logged out successfully', 'success');
  });

  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  // Mobile menu
  document.getElementById('menuBtn')?.addEventListener('click', toggleMobileMenu);
  document.getElementById('mobileOverlay')?.addEventListener('click', closeMobileMenu);

  // Notifications
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('active');
    document.getElementById('profileDropdown')?.classList.remove('active');
  });

  document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
    store.markAllNotificationsRead();
    document.getElementById('notifList').innerHTML = renderNotifications();
    const badge = notifBtn.querySelector('.header-badge');
    if (badge) badge.remove();
    showToast('All notifications marked as read', 'success');
  });

  document.querySelectorAll('[data-notif-id]').forEach(el => {
    el.addEventListener('click', () => {
      store.markNotificationRead(el.dataset.notifId);
      el.classList.remove('unread');
    });
  });

  // Profile dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    notifDropdown?.classList.remove('active');
  });

  // Close dropdowns on click outside or Escape
  document.addEventListener('click', () => {
    notifDropdown?.classList.remove('active');
    profileDropdown?.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      notifDropdown?.classList.remove('active');
      profileDropdown?.classList.remove('active');
      closeSearchOverlay();
      closeMobileMenu();
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      openSearchOverlay();
    }
  });

  // Global search
  document.getElementById('globalSearchInput')?.addEventListener('focus', openSearchOverlay);

  document.getElementById('searchOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'searchOverlay') closeSearchOverlay();
  });

  const searchModalInput = document.getElementById('searchModalInput');
  searchModalInput?.addEventListener('input', debounce((e) => {
    performSearch(e.target.value);
  }, 200));
}

function toggleMobileMenu() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('mobileOverlay')?.classList.toggle('active');
}

function closeMobileMenu() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('active');
}

function openSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  overlay?.classList.add('active');
  setTimeout(() => document.getElementById('searchModalInput')?.focus(), 100);
}

function closeSearchOverlay() {
  document.getElementById('searchOverlay')?.classList.remove('active');
}

function performSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!query || query.length < 2) {
    resultsEl.innerHTML = '<div class="empty-state" style="padding:var(--space-8)"><div class="empty-state-text">Type to search across orders, products, customers, and tables</div></div>';
    return;
  }
  const q = query.toLowerCase();
  const { state } = store;

  let html = '';

  // Search orders
  const matchedOrders = state.orders.filter(o => o.id.toLowerCase().includes(q) || o.status.toLowerCase().includes(q)).slice(0, 3);
  if (matchedOrders.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Orders</div>';
    matchedOrders.forEach(o => {
      html += `<div class="search-result-item" data-search-nav="orders">${icon('clipboardList', 16)} <span>${o.id} — ${o.status} — ${formatINR(o.total)}</span></div>`;
    });
    html += '</div>';
  }

  // Search products
  const matchedProducts = state.menuItems.filter(i => i.name.toLowerCase().includes(q)).slice(0, 3);
  if (matchedProducts.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Products</div>';
    matchedProducts.forEach(p => {
      html += `<div class="search-result-item" data-search-nav="menu">${p.emoji} <span>${p.name} — ${formatINR(p.price)}</span></div>`;
    });
    html += '</div>';
  }

  // Search customers
  const matchedCustomers = state.customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3);
  if (matchedCustomers.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Customers</div>';
    matchedCustomers.forEach(c => {
      html += `<div class="search-result-item" data-search-nav="customers">${icon('user', 16)} <span>${c.name} — ${c.phone}</span></div>`;
    });
    html += '</div>';
  }

  // Search tables
  const matchedTables = state.tables.filter(t => t.number.toLowerCase().includes(q) || t.floor.toLowerCase().includes(q)).slice(0, 3);
  if (matchedTables.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Tables</div>';
    matchedTables.forEach(t => {
      html += `<div class="search-result-item" data-search-nav="tables">${icon('grid', 16)} <span>Table ${t.number} — ${t.floor} — ${t.status}</span></div>`;
    });
    html += '</div>';
  }

  if (!html) {
    html = '<div class="empty-state" style="padding:var(--space-6)"><div class="empty-state-text">No results found for "' + escapeHtml(query) + '"</div></div>';
  }

  resultsEl.innerHTML = html;

  // Bind click
  resultsEl.querySelectorAll('[data-search-nav]').forEach(el => {
    el.addEventListener('click', () => {
      closeSearchOverlay();
      navigate(el.dataset.searchNav);
    });
  });
}

// ==========================================
// PAGE: Login
// ==========================================
function renderLogin(container) {
  container.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">
          <div class="login-logo-icon">${icon('utensils', 28)}</div>
          <span class="login-logo-text">DineDesk</span>
        </div>
        <h2 class="login-title">Welcome Back</h2>
        <p class="login-subtitle">Sign in to your restaurant dashboard</p>
        <div class="login-error" id="loginError">
          ${icon('alertTriangle', 16)} <span>Invalid email or password. Please try again.</span>
        </div>
        <form class="login-form" id="loginForm">
          <div class="form-group">
            <label class="form-label" for="loginEmail">Email Address</label>
            <input class="form-input" type="email" id="loginEmail" placeholder="admin@dinedesk.com" value="admin@dinedesk.com" required autocomplete="email">
          </div>
          <div class="form-group">
            <label class="form-label" for="loginPassword">Password</label>
            <div class="input-group">
              <input class="form-input" type="password" id="loginPassword" placeholder="Enter your password" value="admin123" required autocomplete="current-password">
              <button type="button" class="input-group-action" id="togglePassword" aria-label="Toggle password visibility">${icon('eye', 18)}</button>
            </div>
          </div>
          <div class="login-options">
            <label class="checkbox">
              <input type="checkbox" checked> Remember me
            </label>
            <a href="#" class="login-forgot" onclick="event.preventDefault()">Forgot Password?</a>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmitBtn">
            Sign In
          </button>
        </form>
        <p style="text-align:center;margin-top:var(--space-5);font-size:var(--font-size-sm);color:var(--color-text-tertiary)">
          Demo: admin@dinedesk.com / admin123
        </p>
      </div>
    </div>
  `;

  // Password toggle
  document.getElementById('togglePassword')?.addEventListener('click', () => {
    const pwd = document.getElementById('loginPassword');
    const btn = document.getElementById('togglePassword');
    if (pwd.type === 'password') {
      pwd.type = 'text';
      btn.innerHTML = icon('eyeOff', 18);
    } else {
      pwd.type = 'password';
      btn.innerHTML = icon('eye', 18);
    }
  });

  // Form submit
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginSubmitBtn');
    const error = document.getElementById('loginError');

    btn.innerHTML = '<div class="loading-spinner loading-spinner-sm" style="border-top-color:white"></div> Signing in...';
    btn.disabled = true;
    error.classList.remove('visible');

    setTimeout(() => {
      if (store.login(email, password)) {
        showToast('Welcome back, ' + store.state.auth.user.name + '!', 'success');
        navigate('dashboard');
      } else {
        error.classList.add('visible');
        btn.innerHTML = 'Sign In';
        btn.disabled = false;
      }
    }, 800);
  });
}

// ==========================================
// PAGE: Dashboard
// ==========================================
function renderDashboard(container) {
  const metrics = store.getDashboardMetrics();

  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-icon green">${icon('dollarSign')}</div>
          <div class="kpi-info">
            <div class="kpi-label">Today's Revenue</div>
            <div class="kpi-value">${formatINR(metrics.revenue)}</div>
            <div class="kpi-trend up">${icon('trendingUp', 14)} +12.5% from yesterday</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon blue">${icon('clipboardList')}</div>
          <div class="kpi-info">
            <div class="kpi-label">Orders</div>
            <div class="kpi-value">${metrics.orderCount}</div>
            <div class="kpi-trend up">${icon('trendingUp', 14)} +8.3% from yesterday</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon orange">${icon('users')}</div>
          <div class="kpi-info">
            <div class="kpi-label">Customers</div>
            <div class="kpi-value">${metrics.customerCount}</div>
            <div class="kpi-trend up">${icon('trendingUp', 14)} +5.2% from yesterday</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon red">${icon('grid')}</div>
          <div class="kpi-info">
            <div class="kpi-label">Active Tables</div>
            <div class="kpi-value">${metrics.activeTables} / ${metrics.totalTables}</div>
            <div class="kpi-trend down">${icon('trendingDown', 14)} ${Math.round(metrics.activeTables/metrics.totalTables*100)}% occupancy</div>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Revenue Overview</h3>
            <div class="tabs-pill">
              <span class="tab-pill active" data-range="7d">7 Days</span>
              <span class="tab-pill" data-range="30d">30 Days</span>
              <span class="tab-pill" data-range="month">Month</span>
            </div>
          </div>
          <div class="card-body"><canvas id="revenueChart" height="280"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Order Types</h3></div>
          <div class="card-body"><canvas id="orderTypeChart" height="280"></canvas></div>
        </div>
      </div>

      <div class="dashboard-bottom">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Popular Items</h3></div>
          <div class="card-body"><canvas id="popularItemsChart" height="220"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Orders</h3>
            <button class="btn btn-ghost btn-sm" onclick="navigate('orders')">View All</button>
          </div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Order</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                ${store.state.orders.slice(0, 5).map(o => `
                  <tr>
                    <td style="font-weight:var(--font-weight-semibold)">${o.id}</td>
                    <td><span class="badge badge-neutral">${o.orderType}</span></td>
                    <td>${formatINR(o.total)}</td>
                    <td><span class="badge ${statusBadgeClass(o.status)}">${o.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize charts
  initDashboardCharts();
}

function statusBadgeClass(status) {
  const map = { Pending: 'badge-warning', Preparing: 'badge-info', Ready: 'badge-primary', Completed: 'badge-success', Cancelled: 'badge-error', Paid: 'badge-success', Unpaid: 'badge-warning' };
  return map[status] || 'badge-neutral';
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  const chartColors = {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    info: '#0EA5E9',
    warning: '#F59E0B',
    error: '#EF4444',
    grid: 'rgba(15, 23, 42, 0.06)'
  };

  // Revenue Chart
  const revCtx = document.getElementById('revenueChart')?.getContext('2d');
  if (revCtx) {
    chartInstances.revenue = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: revenueChartData.labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: revenueChartData.revenue,
          borderColor: chartColors.primary,
          backgroundColor: 'rgba(99, 102, 241, 0.10)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: chartColors.primary
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: chartColors.grid }, ticks: { callback: v => formatINRShort(v) } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Order type doughnut
  const otCtx = document.getElementById('orderTypeChart')?.getContext('2d');
  if (otCtx) {
    chartInstances.orderType = new Chart(otCtx, {
      type: 'doughnut',
      data: {
        labels: orderTypeData.labels,
        datasets: [{
          data: orderTypeData.values,
          backgroundColor: [chartColors.primary, chartColors.info, chartColors.warning],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { padding: 16 } } }
      }
    });
  }

  // Popular items horizontal bar
  const piCtx = document.getElementById('popularItemsChart')?.getContext('2d');
  if (piCtx) {
    chartInstances.popular = new Chart(piCtx, {
      type: 'bar',
      data: {
        labels: popularItemsData.map(i => i.name),
        datasets: [{
          label: 'Orders',
          data: popularItemsData.map(i => i.orders),
          backgroundColor: chartColors.primaryLight,
          borderRadius: 4,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, grid: { color: chartColors.grid } },
          y: { grid: { display: false } }
        }
      }
    });
  }
}

// ==========================================
// PAGE: POS
// ==========================================
function renderPOS(container) {
  const { state } = store;
  const cart = state.cart;
  const activeCategory = window._posCategory || 'all';

  const filteredItems = activeCategory === 'all'
    ? state.menuItems.filter(i => i.available)
    : state.menuItems.filter(i => i.category === activeCategory && i.available);

  const calc = calculateOrder(cart.items, cart.discount);

  container.innerHTML = `
    <div class="pos-layout">
      <div class="pos-categories">
        ${CATEGORIES.map(c => `
          <div class="pos-category-item ${activeCategory === c.id ? 'active' : ''}" data-category="${c.id}">
            <span>${c.emoji}</span>
            <span>${c.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="pos-products">
        <div class="pos-toolbar">
          <div class="pos-search">
            ${icon('search', 18)}
            <input type="text" placeholder="Search products..." id="posSearchInput" autocomplete="off">
          </div>
          <button class="btn btn-secondary btn-sm">${icon('filter', 16)} Filter</button>
        </div>
        <div class="pos-product-grid" id="posProductGrid">
          ${filteredItems.map(item => `
            <div class="pos-product-card" data-product-id="${item.id}">
              <div class="pos-product-image">${item.emoji}</div>
              <div class="pos-product-name">${escapeHtml(item.name)}</div>
              <div class="pos-product-price">${formatINR(item.price)}</div>
            </div>
          `).join('')}
          ${filteredItems.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No items in this category</div></div>' : ''}
        </div>
      </div>

      <div class="pos-order-panel">
        <div class="pos-order-header">
          <div class="pos-order-type-tabs">
            ${['Dine In', 'Takeaway', 'Delivery'].map(t => `
              <div class="pos-order-type-tab ${cart.orderType === t ? 'active' : ''}" data-order-type="${t}">${t}</div>
            `).join('')}
          </div>
          <div class="pos-order-selectors">
            <div class="pos-order-selector" id="selectCustomer">
              ${icon('user', 16)}
              <span>${cart.customerId ? (state.customers.find(c => c.id === cart.customerId)?.name || 'Customer') : 'Select Customer'}</span>
            </div>
            <div class="pos-order-selector" id="selectTable">
              ${icon('grid', 16)}
              <span>${cart.tableId ? (state.tables.find(t => t.id === cart.tableId)?.number || 'Table') : 'Select Table'}</span>
            </div>
          </div>
        </div>

        <div class="pos-order-items" id="posOrderItems">
          ${cart.items.length === 0 ? `
            <div class="empty-state" style="padding:var(--space-8)">
              <div class="empty-state-icon">${icon('shoppingCart', 24)}</div>
              <div class="empty-state-title">No items yet</div>
              <div class="empty-state-text">Click on products to add them to the order</div>
            </div>
          ` : cart.items.map(item => `
            <div class="pos-order-item">
              <div class="pos-order-item-info">
                <div class="pos-order-item-name">${escapeHtml(item.name)}</div>
                <div class="pos-order-item-price">${formatINR(item.price)}</div>
              </div>
              <div class="pos-qty-control">
                <button class="pos-qty-btn" data-qty-action="dec" data-item-id="${item.id}">−</button>
                <span class="pos-qty-value">${item.quantity}</span>
                <button class="pos-qty-btn" data-qty-action="inc" data-item-id="${item.id}">+</button>
              </div>
              <div class="pos-order-item-total">${formatINR(item.price * item.quantity)}</div>
              <button class="pos-remove-btn" data-remove-id="${item.id}" aria-label="Remove item">${icon('x', 14)}</button>
            </div>
          `).join('')}
        </div>

        <div class="pos-order-summary">
          <div class="pos-summary-row">
            <span>Subtotal</span>
            <span>${formatINR(calc.subtotal)}</span>
          </div>
          <div class="pos-summary-row">
            <span>Discount</span>
            <input class="discount-input" type="number" min="0" value="${cart.discount}" id="posDiscount" placeholder="0">
          </div>
          <div class="pos-summary-row">
            <span>Tax (5% GST)</span>
            <span>${formatINR(calc.tax)}</span>
          </div>
          <div class="pos-summary-row total">
            <span>Grand Total</span>
            <span>${formatINR(calc.grandTotal)}</span>
          </div>
          <button class="pos-pay-btn" id="posProceedPayBtn" ${cart.items.length === 0 ? 'disabled' : ''}>
            Proceed to Payment — ${formatINR(calc.grandTotal)}
          </button>
        </div>
      </div>
    </div>
  `;

  bindPOSEvents();
}

function bindPOSEvents() {
  // Category selection
  document.querySelectorAll('[data-category]').forEach(el => {
    el.addEventListener('click', () => {
      window._posCategory = el.dataset.category;
      renderPOS(document.getElementById('pageContent'));
    });
  });

  // Add product to cart
  document.querySelectorAll('[data-product-id]').forEach(el => {
    el.addEventListener('click', () => {
      const item = store.state.menuItems.find(i => i.id === el.dataset.productId);
      if (item) {
        store.addToCart(item);
        renderPOS(document.getElementById('pageContent'));
      }
    });
  });

  // Quantity controls
  document.querySelectorAll('[data-qty-action]').forEach(el => {
    el.addEventListener('click', () => {
      const itemId = el.dataset.itemId;
      const item = store.state.cart.items.find(i => i.id === itemId);
      if (!item) return;
      if (el.dataset.qtyAction === 'inc') {
        store.updateCartItemQty(itemId, item.quantity + 1);
      } else {
        store.updateCartItemQty(itemId, item.quantity - 1);
      }
      renderPOS(document.getElementById('pageContent'));
    });
  });

  // Remove item
  document.querySelectorAll('[data-remove-id]').forEach(el => {
    el.addEventListener('click', () => {
      store.removeFromCart(el.dataset.removeId);
      renderPOS(document.getElementById('pageContent'));
    });
  });

  // Order type
  document.querySelectorAll('[data-order-type]').forEach(el => {
    el.addEventListener('click', () => {
      store.setCartOrderType(el.dataset.orderType);
      renderPOS(document.getElementById('pageContent'));
    });
  });

  // Discount
  document.getElementById('posDiscount')?.addEventListener('input', (e) => {
    store.setCartDiscount(e.target.value);
    // Update just the totals without full re-render
    const calc = calculateOrder(store.state.cart.items, store.state.cart.discount);
    document.querySelector('.pos-summary-row:nth-child(3) span:last-child').textContent = formatINR(calc.tax);
    document.querySelector('.pos-summary-row.total span:last-child').textContent = formatINR(calc.grandTotal);
    document.getElementById('posProceedPayBtn').textContent = `Proceed to Payment — ${formatINR(calc.grandTotal)}`;
  });

  // Select customer
  document.getElementById('selectCustomer')?.addEventListener('click', () => {
    showCustomerSelector();
  });

  // Select table
  document.getElementById('selectTable')?.addEventListener('click', () => {
    showTableSelector();
  });

  // Proceed to payment
  document.getElementById('posProceedPayBtn')?.addEventListener('click', () => {
    if (store.state.cart.items.length === 0) return;
    const order = store.createOrderFromCart();
    if (order) {
      showToast(`Order ${order.id} created successfully!`, 'success');
      navigate('billing');
    }
  });

  // Search
  document.getElementById('posSearchInput')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.pos-product-card').forEach(card => {
      const name = card.querySelector('.pos-product-name')?.textContent.toLowerCase();
      card.style.display = !q || name?.includes(q) ? '' : 'none';
    });
  }, 200));
}

function showCustomerSelector() {
  showModal('Select Customer', `
    <div style="margin-bottom:var(--space-4)">
      <input class="form-input" type="text" id="customerSearchInput" placeholder="Search customers..." autocomplete="off">
    </div>
    <div id="customerList">
      ${store.state.customers.map(c => `
        <div class="search-result-item" data-select-customer="${c.id}" style="padding:var(--space-3)">
          <div class="avatar avatar-sm" style="background:var(--color-info)">${getInitials(c.name)}</div>
          <div>
            <div style="font-weight:var(--font-weight-semibold)">${escapeHtml(c.name)}</div>
            <div style="font-size:var(--font-size-xs);color:var(--color-text-tertiary)">${c.phone}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `);

  document.querySelectorAll('[data-select-customer]').forEach(el => {
    el.addEventListener('click', () => {
      store.setCartCustomer(el.dataset.selectCustomer);
      closeModal();
      renderPOS(document.getElementById('pageContent'));
    });
  });
}

function showTableSelector() {
  const availableTables = store.state.tables.filter(t => t.status === 'Available');
  showModal('Select Table', `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:var(--space-3)">
      ${availableTables.map(t => `
        <div class="table-card available" data-select-table="${t.id}" style="cursor:pointer">
          <div class="table-card-number">${t.number}</div>
          <div class="table-card-capacity">${t.capacity} seats</div>
          <div class="table-card-status">Available</div>
        </div>
      `).join('')}
      ${availableTables.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No available tables</div></div>' : ''}
    </div>
  `);

  document.querySelectorAll('[data-select-table]').forEach(el => {
    el.addEventListener('click', () => {
      store.setCartTable(el.dataset.selectTable);
      closeModal();
      renderPOS(document.getElementById('pageContent'));
    });
  });
}

// ==========================================
// PAGE: Tables
// ==========================================
function renderTables(container) {
  const { tables } = store.state;
  const floors = ['All', 'Ground', 'First', 'Terrace'];
  const currentFloor = window._tableFloor || 'All';
  const filtered = currentFloor === 'All' ? tables : tables.filter(t => t.floor === currentFloor);

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Table Management</h2>
      <div class="page-actions">
        <div class="tabs-pill">
          ${floors.map(f => `<span class="tab-pill ${currentFloor === f ? 'active' : ''}" data-floor="${f}">${f}</span>`).join('')}
        </div>
      </div>
    </div>
    <div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-4)">
      <span class="badge badge-success badge-dot">Available (${tables.filter(t=>t.status==='Available').length})</span>
      <span class="badge badge-warning badge-dot">Occupied (${tables.filter(t=>t.status==='Occupied').length})</span>
      <span class="badge badge-info badge-dot">Reserved (${tables.filter(t=>t.status==='Reserved').length})</span>
    </div>
    <div class="tables-grid">
      ${filtered.map(t => {
        const order = t.currentOrderId ? store.state.orders.find(o => o.id === t.currentOrderId) : null;
        return `
          <div class="table-card ${t.status.toLowerCase()}" data-table-detail="${t.id}">
            <div class="table-card-number">${t.number}</div>
            <div class="table-card-capacity">${t.capacity} seats · ${t.floor}</div>
            <div class="table-card-status">${t.status}</div>
            ${order ? `
              <div class="table-card-order">
                <div class="table-card-order-amount">${formatINR(order.total)}</div>
                <div class="table-card-order-time">${icon('clock', 12)} ${elapsedTime(t.occupiedSince)}</div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.querySelectorAll('[data-floor]').forEach(el => {
    el.addEventListener('click', () => { window._tableFloor = el.dataset.floor; renderTables(container); });
  });

  document.querySelectorAll('[data-table-detail]').forEach(el => {
    el.addEventListener('click', () => showTableDetail(el.dataset.tableDetail));
  });
}

function showTableDetail(tableId) {
  const table = store.state.tables.find(t => t.id === tableId);
  if (!table) return;
  const order = table.currentOrderId ? store.state.orders.find(o => o.id === table.currentOrderId) : null;

  let content = `
    <div style="margin-bottom:var(--space-5)">
      <h3 style="margin-bottom:var(--space-2)">Table ${table.number}</h3>
      <p>${table.capacity} seats · ${table.floor} Floor</p>
      <span class="badge ${statusBadgeClass(table.status)} badge-dot">${table.status}</span>
    </div>
  `;

  if (order) {
    content += `
      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-body">
          <h4 style="margin-bottom:var(--space-3)">Current Order: ${order.id}</h4>
          ${order.items.map(i => `<div style="display:flex;justify-content:space-between;padding:var(--space-1) 0;font-size:var(--font-size-sm)"><span>${i.quantity}x ${i.name}</span><span>${formatINR(i.price * i.quantity)}</span></div>`).join('')}
          <div style="border-top:1px solid var(--color-border);margin-top:var(--space-3);padding-top:var(--space-3);display:flex;justify-content:space-between;font-weight:var(--font-weight-bold)"><span>Total</span><span>${formatINR(order.total)}</span></div>
        </div>
      </div>
    `;
  }

  content += `
    <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
      ${table.status === 'Available' ? `<button class="btn btn-primary btn-sm" onclick="store.updateTableStatus('${tableId}','Reserved');closeModal();renderTables(document.getElementById('pageContent'));showToast('Table reserved','success')">Reserve</button>` : ''}
      ${table.status === 'Occupied' && order ? `<button class="btn btn-primary btn-sm" onclick="store.state.currentBillingOrder=store.state.orders.find(o=>o.id==='${order.id}');closeModal();navigate('billing')">Print Bill</button>` : ''}
      ${table.status !== 'Available' ? `<button class="btn btn-secondary btn-sm" onclick="store.updateTableStatus('${tableId}','Available');closeModal();renderTables(document.getElementById('pageContent'));showToast('Table freed','success')">Free Table</button>` : ''}
    </div>
  `;

  showModal(`Table ${table.number}`, content);
}

// ==========================================
// PAGE: Kitchen
// ==========================================
function renderKitchen(container) {
  const orders = store.state.orders;
  const pending = orders.filter(o => o.status === 'Pending');
  const preparing = orders.filter(o => o.status === 'Preparing');
  const ready = orders.filter(o => o.status === 'Ready');

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Kitchen Display</h2>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="renderKitchen(document.getElementById('pageContent'))">${icon('clock', 16)} Refresh</button>
      </div>
    </div>
    <div class="kitchen-layout">
      ${kitchenColumn('Pending', pending, 'warning')}
      ${kitchenColumn('Preparing', preparing, 'info')}
      ${kitchenColumn('Ready', ready, 'success')}
    </div>
  `;

  bindKitchenEvents();
}

function kitchenColumn(title, orders, color) {
  return `
    <div class="kitchen-column">
      <div class="kitchen-column-header">
        <span class="kitchen-column-title">
          <span class="badge badge-${color}" style="width:8px;height:8px;padding:0;border-radius:50%"></span>
          ${title}
        </span>
        <span class="kitchen-column-count">${orders.length}</span>
      </div>
      <div class="kitchen-column-body">
        ${orders.length === 0 ? '<div class="empty-state" style="padding:var(--space-6)"><div class="empty-state-text">No orders</div></div>' : ''}
        ${orders.map(o => {
          const minsSinceCreate = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
          const isUrgent = minsSinceCreate > 20;
          const customer = o.customerId ? store.state.customers.find(c => c.id === o.customerId) : null;
          const table = o.tableId ? store.state.tables.find(t => t.id === o.tableId) : null;
          return `
            <div class="kitchen-order-card ${isUrgent ? 'urgent' : ''}">
              <div class="kitchen-order-top">
                <span class="kitchen-order-id">${o.id}</span>
                <span class="kitchen-order-time ${isUrgent ? 'urgent' : ''}">${icon('clock', 12)} ${minsSinceCreate}m</span>
              </div>
              <div class="kitchen-order-meta">
                <span class="badge badge-neutral">${o.orderType}</span>
                ${table ? `<span class="badge badge-info">${table.number}</span>` : ''}
                ${customer ? `<span class="badge badge-neutral">${customer.name}</span>` : ''}
              </div>
              <div class="kitchen-order-items">
                ${o.items.map(i => `<div class="kitchen-order-item"><span><span class="kitchen-order-item-qty">${i.quantity}x</span> ${escapeHtml(i.name)}</span></div>`).join('')}
              </div>
              ${o.notes ? `<div class="kitchen-order-notes">📝 ${escapeHtml(o.notes)}</div>` : ''}
              <div class="kitchen-order-actions">
                ${o.status === 'Pending' ? `<button class="btn btn-primary btn-sm" data-kitchen-action="Preparing" data-order-id="${o.id}">Start Preparing</button>` : ''}
                ${o.status === 'Preparing' ? `<button class="btn btn-success btn-sm" data-kitchen-action="Ready" data-order-id="${o.id}">Mark Ready</button>` : ''}
                ${o.status === 'Ready' ? `<button class="btn btn-primary btn-sm" data-kitchen-action="Completed" data-order-id="${o.id}">${icon('check', 14)} Complete</button>` : ''}
                <button class="btn btn-ghost btn-sm" data-kitchen-action="Cancelled" data-order-id="${o.id}" style="color:var(--color-error)">Cancel</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function bindKitchenEvents() {
  document.querySelectorAll('[data-kitchen-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = el.dataset.kitchenAction;
      const orderId = el.dataset.orderId;
      store.updateOrderStatus(orderId, action);
      showToast(`Order ${orderId} → ${action}`, action === 'Cancelled' ? 'warning' : 'success');
      renderKitchen(document.getElementById('pageContent'));
    });
  });
}

// ==========================================
// PAGE: Billing
// ==========================================
function renderBilling(container) {
  const order = store.state.currentBillingOrder;
  if (!order) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${icon('receipt', 28)}</div>
        <div class="empty-state-title">No order selected</div>
        <div class="empty-state-text">Create an order from POS or select from Orders to bill</div>
        <button class="btn btn-primary" onclick="navigate('pos')" style="margin-top:var(--space-4)">Go to POS</button>
      </div>
    `;
    return;
  }

  const customer = order.customerId ? store.state.customers.find(c => c.id === order.customerId) : null;
  const table = order.tableId ? store.state.tables.find(t => t.id === order.tableId) : null;
  const isPaid = order.paymentStatus === 'Paid';

  container.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:var(--space-3)">
        <button class="btn btn-ghost btn-icon" onclick="navigate('orders')">${icon('arrowLeft')}</button>
        <h2 class="page-title">Billing — ${order.id}</h2>
      </div>
    </div>
    <div class="billing-layout">
      <div class="billing-invoice card">
        <div class="card-body">
          <div class="billing-invoice-header">
            <div>
              <h3 style="margin-bottom:var(--space-1)">Invoice</h3>
              <p style="font-size:var(--font-size-sm);margin:0">${formatDateTime(order.createdAt)}</p>
            </div>
            <div style="text-align:right">
              ${customer ? `<div style="font-weight:var(--font-weight-semibold)">${escapeHtml(customer.name)}</div><div style="font-size:var(--font-size-sm);color:var(--color-text-tertiary)">${customer.phone}</div>` : ''}
              ${table ? `<div class="badge badge-info" style="margin-top:var(--space-2)">Table ${table.number}</div>` : ''}
              <div class="badge badge-neutral" style="margin-top:var(--space-1)">${order.orderType}</div>
            </div>
          </div>
          <table class="billing-items-table">
            <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${escapeHtml(i.name)}</td>
                  <td style="text-align:center">${i.quantity}</td>
                  <td style="text-align:right">${formatINR(i.price)}</td>
                  <td style="text-align:right">${formatINR(i.price * i.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="billing-totals">
            <div class="billing-total-row"><span>Subtotal</span><span>${formatINR(order.subtotal)}</span></div>
            <div class="billing-total-row"><span>Discount</span><span>- ${formatINR(order.discount)}</span></div>
            <div class="billing-total-row"><span>Tax (5% GST)</span><span>${formatINR(order.tax)}</span></div>
            <div class="billing-total-row grand"><span>Grand Total</span><span>${formatINR(order.total)}</span></div>
          </div>
        </div>
      </div>

      <div class="billing-payment">
        <div class="card">
          <div class="card-body" id="paymentPanel">
            ${isPaid ? renderPaymentSuccess(order) : renderPaymentForm(order)}
          </div>
        </div>
      </div>
    </div>
  `;

  if (!isPaid) bindBillingEvents(order);
}

function renderPaymentForm(order) {
  return `
    <h3 style="margin-bottom:var(--space-5)">Payment</h3>
    <div class="payment-methods" id="paymentMethods">
      <div class="payment-method-btn active" data-method="Cash">
        <div class="payment-method-icon">💵</div>
        <div class="payment-method-label">Cash</div>
      </div>
      <div class="payment-method-btn" data-method="Card">
        <div class="payment-method-icon">💳</div>
        <div class="payment-method-label">Card</div>
      </div>
      <div class="payment-method-btn" data-method="UPI">
        <div class="payment-method-icon">📱</div>
        <div class="payment-method-label">UPI</div>
      </div>
    </div>
    <div id="cashSection" class="payment-cash-section">
      <div class="form-group">
        <label class="form-label">Amount Received</label>
        <input class="form-input" type="number" id="cashReceived" placeholder="Enter amount" value="${Math.ceil(order.total / 100) * 100}" min="0" step="10">
      </div>
      <div class="cash-change" id="cashChange">
        <span class="cash-change-label">Change to Return</span>
        <span class="cash-change-amount">${formatINR(calculateChange(order.total, Math.ceil(order.total / 100) * 100))}</span>
      </div>
    </div>
    <button class="btn btn-primary btn-block btn-lg" id="completePaymentBtn">Complete Payment — ${formatINR(order.total)}</button>
    <div class="receipt-options">
      <button class="btn btn-secondary btn-sm" onclick="window.print();showToast('Printing receipt...','info')">${icon('printer', 16)} Print</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Receipt sent via WhatsApp','success')">${icon('messageCircle', 16)} WhatsApp</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Receipt sent via Email','success')">${icon('mail', 16)} Email</button>
    </div>
  `;
}

function renderPaymentSuccess(order) {
  return `
    <div class="payment-success">
      <div class="payment-success-icon">${icon('checkCircle', 36)}</div>
      <h3 style="margin-bottom:var(--space-2)">Payment Successful!</h3>
      <p style="font-size:var(--font-size-lg);font-weight:var(--font-weight-bold);color:var(--color-success);margin-bottom:var(--space-4)">${formatINR(order.total)}</p>
      <p>Paid via ${order.paymentMethod}</p>
      <div class="receipt-options" style="justify-content:center;margin-top:var(--space-6)">
        <button class="btn btn-secondary btn-sm" onclick="window.print();showToast('Printing receipt...','info')">${icon('printer', 16)} Print</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Receipt sent via WhatsApp','success')">${icon('messageCircle', 16)} WhatsApp</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Receipt sent via Email','success')">${icon('mail', 16)} Email</button>
      </div>
      <button class="btn btn-primary" onclick="navigate('pos')" style="margin-top:var(--space-4)">New Order</button>
    </div>
  `;
}

function bindBillingEvents(order) {
  let selectedMethod = 'Cash';

  document.querySelectorAll('[data-method]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-method]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      selectedMethod = el.dataset.method;
      const cashSection = document.getElementById('cashSection');
      if (cashSection) cashSection.style.display = selectedMethod === 'Cash' ? '' : 'none';
    });
  });

  document.getElementById('cashReceived')?.addEventListener('input', (e) => {
    const change = calculateChange(order.total, e.target.value);
    const changeEl = document.querySelector('.cash-change-amount');
    if (changeEl) changeEl.textContent = formatINR(change);
  });

  document.getElementById('completePaymentBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('completePaymentBtn');
    btn.innerHTML = '<div class="loading-spinner loading-spinner-sm" style="border-top-color:white"></div> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      store.completePayment(order.id, selectedMethod);
      showToast(`Payment of ${formatINR(order.total)} received via ${selectedMethod}`, 'success');
      renderBilling(document.getElementById('pageContent'));
    }, selectedMethod === 'Cash' ? 500 : 1500);
  });
}

// ==========================================
// PAGE: Orders
// ==========================================
function renderOrders(container) {
  const orders = store.state.orders;
  const statusFilter = window._orderStatusFilter || 'All';
  const filtered = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter || o.paymentStatus === statusFilter);

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Orders</h2>
    </div>
    <div class="data-table-container">
      <div class="data-table-header">
        <div class="data-table-search">${icon('search', 16)}<input type="text" placeholder="Search orders..." id="orderSearchInput"></div>
        <div class="data-table-actions">
          <select class="form-select" style="width:auto;height:36px;font-size:var(--font-size-sm)" id="orderStatusFilter">
            <option ${statusFilter==='All'?'selected':''}>All</option>
            <option ${statusFilter==='Pending'?'selected':''}>Pending</option>
            <option ${statusFilter==='Preparing'?'selected':''}>Preparing</option>
            <option ${statusFilter==='Ready'?'selected':''}>Ready</option>
            <option ${statusFilter==='Completed'?'selected':''}>Completed</option>
            <option ${statusFilter==='Cancelled'?'selected':''}>Cancelled</option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Type</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${filtered.length === 0 ? '<tr><td colspan="9"><div class="empty-state" style="padding:var(--space-6)"><div class="empty-state-text">No orders found</div></div></td></tr>' : ''}
          ${filtered.map(o => {
            const customer = o.customerId ? store.state.customers.find(c => c.id === o.customerId) : null;
            return `<tr>
              <td style="font-weight:var(--font-weight-semibold)">${o.id}</td>
              <td>${customer ? escapeHtml(customer.name) : '—'}</td>
              <td><span class="badge badge-neutral">${o.orderType}</span></td>
              <td>${o.itemCount}</td>
              <td style="font-weight:var(--font-weight-semibold)">${formatINR(o.total)}</td>
              <td><span class="badge ${statusBadgeClass(o.paymentStatus)}">${o.paymentStatus}</span></td>
              <td><span class="badge ${statusBadgeClass(o.status)}">${o.status}</span></td>
              <td style="font-size:var(--font-size-sm);color:var(--color-text-tertiary)">${formatDateTime(o.createdAt)}</td>
              <td>
                ${o.paymentStatus === 'Unpaid' ? `<button class="btn btn-primary btn-sm" onclick="store.state.currentBillingOrder=store.state.orders.find(o=>o.id==='${o.id}');navigate('billing')">Bill</button>` : ''}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="data-table-footer"><span>Showing ${filtered.length} of ${orders.length} orders</span></div>
    </div>
  `;

  document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
    window._orderStatusFilter = e.target.value;
    renderOrders(container);
  });

  document.getElementById('orderSearchInput')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 200));
}

// ==========================================
// PAGE: Menu Management
// ==========================================
function renderMenu(container) {
  const items = store.state.menuItems;
  const catFilter = window._menuCatFilter || 'all';
  const filtered = catFilter === 'all' ? items : items.filter(i => i.category === catFilter);

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Menu Management</h2>
      <button class="btn btn-primary" id="addMenuItemBtn">${icon('plus', 16)} Add Item</button>
    </div>
    <div class="filter-bar">
      ${CATEGORIES.map(c => `<span class="tab-pill ${catFilter === c.id ? 'active' : ''}" data-menu-cat="${c.id}">${c.emoji} ${c.name}</span>`).join('')}
    </div>
    <div class="data-table-container">
      <div class="data-table-header">
        <div class="data-table-search">${icon('search', 16)}<input type="text" placeholder="Search menu items..." id="menuSearchInput"></div>
      </div>
      <table class="data-table">
        <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Prep Time</th><th>Available</th><th>Actions</th></tr></thead>
        <tbody>
          ${filtered.map(item => `
            <tr>
              <td style="font-size:24px">${item.emoji}</td>
              <td style="font-weight:var(--font-weight-semibold)">${escapeHtml(item.name)}</td>
              <td><span class="badge badge-neutral">${CATEGORIES.find(c => c.id === item.category)?.name || item.category}</span></td>
              <td>${formatINR(item.price)}</td>
              <td>${item.prepTime} min</td>
              <td>
                <label class="toggle">
                  <input type="checkbox" ${item.available ? 'checked' : ''} data-toggle-item="${item.id}">
                  <span class="toggle-slider"></span>
                </label>
              </td>
              <td>
                <button class="btn btn-ghost btn-sm btn-icon" data-edit-item="${item.id}">${icon('edit', 16)}</button>
                <button class="btn btn-ghost btn-sm btn-icon" data-delete-item="${item.id}" style="color:var(--color-error)">${icon('trash', 16)}</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.querySelectorAll('[data-menu-cat]').forEach(el => {
    el.addEventListener('click', () => { window._menuCatFilter = el.dataset.menuCat; renderMenu(container); });
  });

  document.querySelectorAll('[data-toggle-item]').forEach(el => {
    el.addEventListener('change', () => { store.toggleMenuItemAvailability(el.dataset.toggleItem); });
  });

  document.querySelectorAll('[data-delete-item]').forEach(el => {
    el.addEventListener('click', () => {
      showConfirmDialog('Delete Item', 'Are you sure you want to delete this menu item?', () => {
        store.deleteMenuItem(el.dataset.deleteItem);
        showToast('Menu item deleted', 'warning');
        renderMenu(container);
      });
    });
  });

  document.getElementById('addMenuItemBtn')?.addEventListener('click', () => showMenuItemForm());

  document.querySelectorAll('[data-edit-item]').forEach(el => {
    el.addEventListener('click', () => {
      const item = store.state.menuItems.find(i => i.id === el.dataset.editItem);
      if (item) showMenuItemForm(item);
    });
  });

  document.getElementById('menuSearchInput')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 200));
}

function showMenuItemForm(item = null) {
  const isEdit = !!item;
  showModal(isEdit ? 'Edit Menu Item' : 'Add Menu Item', `
    <form id="menuItemForm">
      <div class="form-group"><label class="form-label">Name</label><input class="form-input" name="name" value="${item?.name || ''}" required></div>
      <div class="form-group"><label class="form-label">Price (₹)</label><input class="form-input" type="number" name="price" value="${item?.price || ''}" required min="1"></div>
      <div class="form-group"><label class="form-label">Category</label>
        <select class="form-select" name="category" required>
          ${CATEGORIES.filter(c=>c.id!=='all').map(c => `<option value="${c.id}" ${item?.category===c.id?'selected':''}>${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Prep Time (min)</label><input class="form-input" type="number" name="prepTime" value="${item?.prepTime || 10}" min="1"></div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" name="description">${item?.description || ''}</textarea></div>
    </form>
  `, () => {
    const form = document.getElementById('menuItemForm');
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.price) { showToast('Please fill all required fields', 'error'); return; }
    const emoji = CATEGORIES.find(c => c.id === data.category)?.emoji || '🍽️';
    if (isEdit) {
      store.updateMenuItem(item.id, { ...data, price: parseFloat(data.price), prepTime: parseInt(data.prepTime), emoji });
      showToast('Menu item updated', 'success');
    } else {
      store.addMenuItem({ ...data, price: parseFloat(data.price), prepTime: parseInt(data.prepTime), emoji, available: true });
      showToast('Menu item added', 'success');
    }
    closeModal();
    renderMenu(document.getElementById('pageContent'));
  });
}

// ==========================================
// PAGE: Customers
// ==========================================
function renderCustomers(container) {
  const customers = store.state.customers;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Customers</h2>
      <button class="btn btn-primary" id="addCustomerBtn">${icon('plus', 16)} Add Customer</button>
    </div>
    <div class="data-table-container">
      <div class="data-table-header">
        <div class="data-table-search">${icon('search', 16)}<input type="text" placeholder="Search customers..." id="custSearchInput"></div>
      </div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Phone</th><th>Orders</th><th>Total Spend</th><th>Loyalty Points</th><th>Last Visit</th><th>Preferred</th></tr></thead>
        <tbody>
          ${customers.map(c => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:var(--space-2)"><div class="avatar avatar-sm" style="background:hsl(${c.name.length*30},60%,45%)">${getInitials(c.name)}</div><span style="font-weight:var(--font-weight-semibold)">${escapeHtml(c.name)}</span></div></td>
              <td>${c.phone}</td>
              <td>${c.orderCount}</td>
              <td style="font-weight:var(--font-weight-semibold)">${formatINR(c.totalSpend)}</td>
              <td><span class="badge badge-primary">${c.loyaltyPoints} pts</span></td>
              <td style="font-size:var(--font-size-sm);color:var(--color-text-tertiary)">${formatDate(c.lastVisit)}</td>
              <td><span class="badge badge-neutral">${c.preferredOrderType}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
    showModal('Add Customer', `
      <form id="customerForm">
        <div class="form-group"><label class="form-label">Name</label><input class="form-input" name="name" required></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" name="phone" required></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" name="email"></div>
        <div class="form-group"><label class="form-label">Preferred Order Type</label>
          <select class="form-select" name="preferredOrderType"><option>Dine In</option><option>Takeaway</option><option>Delivery</option></select>
        </div>
        <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" name="notes"></textarea></div>
      </form>
    `, () => {
      const data = Object.fromEntries(new FormData(document.getElementById('customerForm')));
      if (!data.name || !data.phone) { showToast('Name and phone required', 'error'); return; }
      store.addCustomer(data);
      showToast('Customer added', 'success');
      closeModal();
      renderCustomers(container);
    });
  });

  document.getElementById('custSearchInput')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 200));
}

// ==========================================
// PAGE: Reports
// ==========================================
function renderReports(container) {
  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Reports & Analytics</h2>
      <div class="page-actions">
        <div class="tabs-pill" id="reportRange">
          <span class="tab-pill active" data-range="today">Today</span>
          <span class="tab-pill" data-range="7d">7 Days</span>
          <span class="tab-pill" data-range="30d">30 Days</span>
          <span class="tab-pill" data-range="month">Month</span>
        </div>
      </div>
    </div>
    <div class="kpi-row" style="margin-bottom:var(--space-6)">
      <div class="kpi-card"><div class="kpi-icon green">${icon('dollarSign')}</div><div class="kpi-info"><div class="kpi-label">Total Revenue</div><div class="kpi-value">${formatINR(42580)}</div></div></div>
      <div class="kpi-card"><div class="kpi-icon blue">${icon('clipboardList')}</div><div class="kpi-info"><div class="kpi-label">Total Orders</div><div class="kpi-value">156</div></div></div>
      <div class="kpi-card"><div class="kpi-icon orange">${icon('dollarSign')}</div><div class="kpi-info"><div class="kpi-label">Avg Order Value</div><div class="kpi-value">${formatINR(273)}</div></div></div>
      <div class="kpi-card"><div class="kpi-icon red">${icon('users')}</div><div class="kpi-info"><div class="kpi-label">Unique Customers</div><div class="kpi-value">124</div></div></div>
    </div>
    <div class="reports-grid">
      <div class="card reports-full-width"><div class="card-header"><h3 class="card-title">Hourly Revenue</h3></div><div class="card-body"><canvas id="hourlyRevenueChart" height="200"></canvas></div></div>
      <div class="card"><div class="card-header"><h3 class="card-title">Payment Methods</h3></div><div class="card-body"><canvas id="paymentMethodChart" height="250"></canvas></div></div>
      <div class="card"><div class="card-header"><h3 class="card-title">Top Products</h3></div><div class="card-body"><canvas id="topProductsChart" height="250"></canvas></div></div>
    </div>
  `;

  if (typeof Chart !== 'undefined') {
    const hrCtx = document.getElementById('hourlyRevenueChart')?.getContext('2d');
    if (hrCtx) {
      chartInstances.hourly = new Chart(hrCtx, {
        type: 'bar',
        data: { labels: hourlyRevenueData.labels, datasets: [{ label: 'Revenue', data: hourlyRevenueData.values, backgroundColor: '#6366F1', borderRadius: 4, barThickness: 24 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => formatINRShort(v) } }, x: { grid: { display: false } } } }
      });
    }
    const pmCtx = document.getElementById('paymentMethodChart')?.getContext('2d');
    if (pmCtx) {
      chartInstances.payment = new Chart(pmCtx, {
        type: 'doughnut',
        data: { labels: ['Cash', 'Card', 'UPI'], datasets: [{ data: [35, 28, 37], backgroundColor: ['#10B981', '#6366F1', '#F59E0B'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
      });
    }
    const tpCtx = document.getElementById('topProductsChart')?.getContext('2d');
    if (tpCtx) {
      chartInstances.topProd = new Chart(tpCtx, {
        type: 'bar',
        data: { labels: popularItemsData.map(i => i.name), datasets: [{ label: 'Orders', data: popularItemsData.map(i => i.orders), backgroundColor: '#4F46E5', borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true }, y: { grid: { display: false } } } }
      });
    }
  }
}

// ==========================================
// PAGE: Inventory
// ==========================================
function renderInventory(container) {
  const items = store.state.inventory;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Inventory</h2>
      <button class="btn btn-primary">${icon('plus', 16)} Add Item</button>
    </div>
    <div class="data-table-container">
      <div class="data-table-header">
        <div class="data-table-search">${icon('search', 16)}<input type="text" placeholder="Search inventory..." id="invSearchInput"></div>
        <div class="data-table-actions">
          <span class="badge badge-warning badge-dot">Low Stock: ${items.filter(i=>i.status==='Low Stock').length}</span>
          <span class="badge badge-error badge-dot">Out of Stock: ${items.filter(i=>i.status==='Out of Stock').length}</span>
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Item</th><th>Category</th><th>Stock</th><th>Unit</th><th>Reorder Level</th><th>Supplier</th><th>Status</th></tr></thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td style="font-weight:var(--font-weight-semibold)">${escapeHtml(i.name)}</td>
              <td><span class="badge badge-neutral">${i.category}</span></td>
              <td style="font-weight:var(--font-weight-semibold)">${i.currentStock}</td>
              <td>${i.unit}</td>
              <td>${i.reorderLevel}</td>
              <td style="color:var(--color-text-secondary)">${i.supplier}</td>
              <td><span class="badge ${i.status==='In Stock'?'badge-success':i.status==='Low Stock'?'badge-warning':'badge-error'} badge-dot">${i.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('invSearchInput')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 200));
}

// ==========================================
// PAGE: Staff
// ==========================================
function renderStaff(container) {
  const staff = store.state.staff;
  const roleBadgeColors = { Admin: 'badge-error', Manager: 'badge-info', Chef: 'badge-warning', Waiter: 'badge-primary', Cashier: 'badge-success' };

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Staff Management</h2>
      <button class="btn btn-primary">${icon('plus', 16)} Add Staff</button>
    </div>
    <div class="data-table-container">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Role</th><th>Contact</th><th>Shift</th><th>Status</th><th>Last Login</th></tr></thead>
        <tbody>
          ${staff.map(s => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:var(--space-2)"><div class="avatar avatar-sm" style="background:hsl(${s.name.length*40},50%,45%)">${getInitials(s.name)}</div><span style="font-weight:var(--font-weight-semibold)">${escapeHtml(s.name)}</span></div></td>
              <td><span class="badge ${roleBadgeColors[s.role] || 'badge-neutral'}">${s.role}</span></td>
              <td style="font-size:var(--font-size-sm)">${s.phone}<br><span style="color:var(--color-text-tertiary)">${s.email}</span></td>
              <td>${s.shift}</td>
              <td><span class="badge ${s.status==='Active'?'badge-success':'badge-neutral'} badge-dot">${s.status}</span></td>
              <td style="font-size:var(--font-size-sm);color:var(--color-text-tertiary)">${timeAgo(s.lastLogin)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==========================================
// PAGE: Settings
// ==========================================
function renderSettings(container) {
  const s = store.state.settings;

  container.innerHTML = `
    <div class="page-header"><h2 class="page-title">Settings</h2></div>
    <div class="settings-layout">
      <div class="settings-nav">
        <div class="settings-nav-item active">${icon('settings', 16)} Restaurant Info</div>
        <div class="settings-nav-item">${icon('receipt', 16)} Tax & Billing</div>
        <div class="settings-nav-item">${icon('creditCard', 16)} Payment Methods</div>
        <div class="settings-nav-item">${icon('grid', 16)} Tables</div>
        <div class="settings-nav-item">${icon('chefHat', 16)} Kitchen</div>
        <div class="settings-nav-item">${icon('bell', 16)} Notifications</div>
        <div class="settings-nav-item">${icon('users', 16)} Staff & Roles</div>
        <div class="settings-nav-item">${icon('user', 16)} Profile</div>
      </div>
      <div class="settings-content">
        <div class="settings-section-title">Restaurant Information</div>
        <form id="settingsForm">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
            <div class="form-group"><label class="form-label">Restaurant Name</label><input class="form-input" value="${escapeHtml(s.restaurantName)}"></div>
            <div class="form-group"><label class="form-label">Phone</label><input class="form-input" value="${s.phone}"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${s.email}"></div>
            <div class="form-group"><label class="form-label">GST Number</label><input class="form-input" value="${s.gstNumber}"></div>
          </div>
          <div class="form-group"><label class="form-label">Address</label><textarea class="form-textarea" rows="2">${escapeHtml(s.address)}</textarea></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
            <div class="form-group"><label class="form-label">Tax Rate (%)</label><input class="form-input" type="number" value="${s.taxRate * 100}" step="0.5"></div>
            <div class="form-group"><label class="form-label">Currency</label><select class="form-select"><option selected>INR (₹)</option><option>USD ($)</option></select></div>
          </div>
          <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
            <button type="button" class="btn btn-primary" onclick="showToast('Settings saved successfully!','success')">${icon('save', 16)} Save Changes</button>
            <button type="button" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Settings tab switching
  document.querySelectorAll('.settings-nav-item').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      showToast('Settings section: ' + el.textContent.trim(), 'info');
    });
  });
}

// ==========================================
// Version History & GitHub Releases View
// ==========================================
let versionHistoryFilter = 'all';
let versionHistorySearch = '';

function renderVersionHistory(container) {
  const filteredReleases = RELEASES_DATA.filter(rel => {
    const matchesSearch = !versionHistorySearch || 
      rel.title.toLowerCase().includes(versionHistorySearch.toLowerCase()) ||
      rel.version.toLowerCase().includes(versionHistorySearch.toLowerCase()) ||
      rel.summary.toLowerCase().includes(versionHistorySearch.toLowerCase()) ||
      rel.commits.some(c => c.message.toLowerCase().includes(versionHistorySearch.toLowerCase()) || c.sha.includes(versionHistorySearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (versionHistoryFilter === 'all') return true;
    if (versionHistoryFilter === 'latest') return rel.isLatest;
    if (versionHistoryFilter === 'v1.2') return rel.version.startsWith('v1.2');
    if (versionHistoryFilter === 'v1.1') return rel.version.startsWith('v1.1');
    if (versionHistoryFilter === 'v1.0') return rel.version.startsWith('v1.0');
    return true;
  });

  container.innerHTML = `
    <div class="version-history-container">
      <!-- Repo Info Banner -->
      <div class="vh-repo-card">
        <div class="vh-repo-header">
          <div class="vh-repo-title">
            <span class="icon" style="color:var(--color-primary)">${icon('github', 28)}</span>
            <div>
              <h2>${REPOSITORY_INFO.fullName} <span class="vh-repo-visibility">Public POS Engine</span></h2>
              <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary);margin-top:2px">
                Branch: <code>${REPOSITORY_INFO.branch}</code> • License: <strong>${REPOSITORY_INFO.license}</strong> • Latest Release: <strong>${REPOSITORY_INFO.latestVersion}</strong>
              </div>
            </div>
          </div>
          <div class="vh-repo-actions">
            <a href="${REPOSITORY_INFO.url}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:6px">
              ${icon('github', 16)} GitHub Repository ${icon('externalLink', 14)}
            </a>
            <button class="btn btn-primary btn-sm" id="vhBranchBtn" style="display:inline-flex;align-items:center;gap:6px">
              ${icon('gitBranch', 16)} Branch: main
            </button>
          </div>
        </div>

        <div class="vh-stats-grid">
          <div class="vh-stat-item">
            <div class="vh-stat-icon">${icon('gitCommit', 18)}</div>
            <div class="vh-stat-info">
              <span class="vh-stat-label">Total Commits</span>
              <span class="vh-stat-value">${REPOSITORY_INFO.totalCommits}</span>
            </div>
          </div>
          <div class="vh-stat-item">
            <div class="vh-stat-icon">${icon('tag', 18)}</div>
            <div class="vh-stat-info">
              <span class="vh-stat-label">Releases</span>
              <span class="vh-stat-value">${REPOSITORY_INFO.totalReleases}</span>
            </div>
          </div>
          <div class="vh-stat-item">
            <div class="vh-stat-icon">${icon('users', 18)}</div>
            <div class="vh-stat-info">
              <span class="vh-stat-label">Contributors</span>
              <span class="vh-stat-value">${REPOSITORY_INFO.totalContributors}</span>
            </div>
          </div>
          <div class="vh-stat-item">
            <div class="vh-stat-icon">${icon('checkCircle', 18)}</div>
            <div class="vh-stat-info">
              <span class="vh-stat-label">Build Status</span>
              <span class="vh-stat-value" style="color:var(--color-success)">Passing</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls: Filter Tabs & Search -->
      <div class="vh-controls-bar">
        <div class="vh-search-box">
          <span class="vh-search-icon">${icon('search', 16)}</span>
          <input type="text" id="vhSearchInput" placeholder="Search releases, commits, SHA or features..." value="${escapeHtml(versionHistorySearch)}">
        </div>
        <div class="vh-filter-tabs">
          <button class="vh-tab-btn ${versionHistoryFilter === 'all' ? 'active' : ''}" data-filter="all">All Releases (${RELEASES_DATA.length})</button>
          <button class="vh-tab-btn ${versionHistoryFilter === 'latest' ? 'active' : ''}" data-filter="latest">Latest Tag</button>
          <button class="vh-tab-btn ${versionHistoryFilter === 'v1.2' ? 'active' : ''}" data-filter="v1.2">v1.2.0</button>
          <button class="vh-tab-btn ${versionHistoryFilter === 'v1.1' ? 'active' : ''}" data-filter="v1.1">v1.1.0</button>
          <button class="vh-tab-btn ${versionHistoryFilter === 'v1.0' ? 'active' : ''}" data-filter="v1.0">v1.0.0</button>
        </div>
      </div>

      <!-- GitHub Timeline -->
      <div class="vh-timeline">
        ${filteredReleases.length === 0 ? `
          <div class="vh-empty-state">
            <h3>No releases found</h3>
            <p>No commits or releases match your search query "${escapeHtml(versionHistorySearch)}".</p>
          </div>
        ` : filteredReleases.map(rel => `
          <div class="vh-release-item ${rel.isLatest ? 'latest' : ''}">
            <div class="vh-timeline-node">
              ${icon(rel.isLatest ? 'tag' : 'gitCommit', 14)}
            </div>
            <div class="vh-release-card">
              <div class="vh-release-header">
                <div class="vh-release-meta-main">
                  <div class="vh-tag-row">
                    <span class="vh-version-tag">${icon('tag', 14)} ${rel.version}</span>
                    <span class="vh-badge ${rel.tagColor}">${rel.tagType}</span>
                  </div>
                  <h3 class="vh-release-title">${escapeHtml(rel.title)}</h3>
                  <div class="vh-author-meta">
                    <img class="vh-author-avatar" src="${rel.author.avatar}" alt="${rel.author.name}">
                    <span><strong>${escapeHtml(rel.author.name)}</strong> (@${rel.author.username}) released this</span>
                    <span class="vh-pub-date">• ${formatDate(rel.publishedAt)}</span>
                  </div>
                </div>
              </div>

              <div class="vh-release-body">
                <p class="vh-release-summary">${escapeHtml(rel.summary)}</p>

                ${rel.highlights && rel.highlights.length > 0 ? `
                  <div class="vh-highlights-box">
                    <h4>Key Highlights</h4>
                    <ul class="vh-highlights-list">
                      ${rel.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}

                <div class="vh-changelog-sections">
                  ${rel.changelog.features.length > 0 ? `
                    <div class="vh-section-block">
                      <h4>${icon('plus', 14)} New Features</h4>
                      <ul class="vh-bullet-list">
                        ${rel.changelog.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  ${rel.changelog.improvements.length > 0 ? `
                    <div class="vh-section-block">
                      <h4>${icon('trendingUp', 14)} Improvements</h4>
                      <ul class="vh-bullet-list">
                        ${rel.changelog.improvements.map(imp => `<li>${escapeHtml(imp)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  ${rel.changelog.fixes.length > 0 ? `
                    <div class="vh-section-block">
                      <h4>${icon('checkCircle', 14)} Bug Fixes</h4>
                      <ul class="vh-bullet-list">
                        ${rel.changelog.fixes.map(fix => `<li>${escapeHtml(fix)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>

                <!-- Commits List Table -->
                <div class="vh-commits-section">
                  <div class="vh-commits-title">
                    <span>Commits included in ${rel.version} (${rel.commits.length})</span>
                    <span style="font-size:var(--font-size-xs);color:var(--color-text-tertiary)">Click SHA to view code diff</span>
                  </div>
                  <div class="vh-commit-list">
                    ${rel.commits.map(c => `
                      <div class="vh-commit-row">
                        <div class="vh-commit-msg-wrap">
                          <span class="vh-commit-icon">${icon('gitCommit', 16)}</span>
                          <span class="vh-commit-msg">${escapeHtml(c.message)}</span>
                        </div>
                        <div class="vh-commit-meta">
                          <span class="vh-commit-author">${c.author} • ${c.date}</span>
                          <span class="vh-diff-badge">
                            <span class="vh-additions">+${c.additions}</span>
                            <span class="vh-deletions">-${c.deletions}</span>
                          </span>
                          <button class="vh-sha-btn" data-sha="${c.sha}" title="View commit diff for ${c.sha}">
                            ${icon('code', 12)} ${c.sha}
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Bind event handlers
  const searchInput = container.querySelector('#vhSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      versionHistorySearch = e.target.value;
      renderVersionHistory(container);
    }, 250));
  }

  container.querySelectorAll('.vh-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      versionHistoryFilter = btn.dataset.filter;
      renderVersionHistory(container);
    });
  });

  container.querySelectorAll('.vh-sha-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sha = btn.dataset.sha;
      const commit = findCommitBySha(sha);
      if (commit) {
        showCommitDiffModal(commit);
      }
    });
  });

  container.querySelector('#vhBranchBtn')?.addEventListener('click', () => {
    showToast('Branch main is up-to-date with origin/main', 'info');
  });
}

function findCommitBySha(sha) {
  for (const rel of RELEASES_DATA) {
    const found = rel.commits.find(c => c.sha === sha);
    if (found) return found;
  }
  return null;
}

function showCommitDiffModal(commit) {
  const content = `
    <div class="vh-diff-modal">
      <div class="vh-diff-header-info">
        <div style="font-weight:var(--font-weight-bold);font-size:var(--font-size-md);color:var(--color-text-primary)">
          ${escapeHtml(commit.message)}
        </div>
        <div class="vh-diff-sha-full">
          Commit SHA: <code>${commit.fullSha}</code>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;font-size:var(--font-size-xs);color:var(--color-text-secondary)">
          <span>Author: <strong>${commit.author}</strong> (@${commit.username}) • ${commit.date}</span>
          <span class="vh-diff-badge">
            <span class="vh-additions">+${commit.additions} lines</span>
            <span class="vh-deletions">-${commit.deletions} lines</span>
            <button class="btn btn-ghost btn-sm" id="copyShaBtn" style="padding:2px 6px;margin-left:6px" title="Copy SHA to clipboard">
              ${icon('copy', 12)} Copy SHA
            </button>
          </span>
        </div>
      </div>

      <div class="vh-diff-files-title">Files Changed (${commit.filesChanged.length})</div>

      ${commit.filesChanged.map(f => `
        <div class="vh-file-diff-card">
          <div class="vh-file-diff-header">
            <span>📄 ${f.name}</span>
            <span>
              <span class="vh-additions">+${f.additions}</span>
              <span class="vh-deletions">-${f.deletions}</span>
              <span style="opacity:0.6;margin-left:8px">${f.status}</span>
            </span>
          </div>
          <div class="vh-diff-code-body">${formatDiffSummary(commit.diffSummary)}</div>
        </div>
      `).join('')}
    </div>
  `;

  showModal(`Commit Inspector: ${commit.sha}`, content);

  document.getElementById('copyShaBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(commit.fullSha).then(() => {
      showToast(`Copied commit SHA ${commit.sha} to clipboard`, 'success');
    }).catch(() => {
      showToast(`SHA: ${commit.sha}`, 'info');
    });
  });
}

function formatDiffSummary(summary) {
  if (!summary) return 'No diff detail available';
  return summary.split('\n').map(line => {
    if (line.startsWith('+')) {
      return `<div class="vh-diff-line-add">${escapeHtml(line)}</div>`;
    } else if (line.startsWith('-')) {
      return `<div class="vh-diff-line-del">${escapeHtml(line)}</div>`;
    }
    return `<div>${escapeHtml(line)}</div>`;
  }).join('');
}

// ==========================================
// Modal System
// ==========================================
function showModal(title, content, onConfirm = null) {
  let existing = document.getElementById('globalModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'globalModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal ${onConfirm ? '' : 'modal-lg'}">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" id="modalCloseBtn">${icon('x', 18)}</button>
      </div>
      <div class="modal-body">${content}</div>
      ${onConfirm ? `
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
          <button class="btn btn-primary" id="modalConfirmBtn">Save</button>
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('active'));

  modal.querySelector('#modalCloseBtn')?.addEventListener('click', closeModal);
  modal.querySelector('#modalCancelBtn')?.addEventListener('click', closeModal);
  modal.querySelector('#modalConfirmBtn')?.addEventListener('click', () => onConfirm());
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

function closeModal() {
  const modal = document.getElementById('globalModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  }
}

function showConfirmDialog(title, message, onConfirm) {
  showModal(title, `
    <div class="confirm-dialog">
      <div class="confirm-dialog-icon danger">${icon('alertTriangle', 28)}</div>
      <h3 class="confirm-dialog-title">${title}</h3>
      <p class="confirm-dialog-text">${message}</p>
    </div>
  `, () => { onConfirm(); closeModal(); });
}

// ==========================================
// PAGE: Expenses (Placeholder — Phase F)
// ==========================================
function renderExpenses(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-content">
        <h2 class="page-header-title">Expenses</h2>
        <p class="page-header-desc">Track and manage restaurant expenses, vendor payments, and cost centers</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" disabled>${icon('plus', 16)} Add Expense</button>
      </div>
    </div>
    <div class="card" style="padding:var(--space-16)">
      <div class="empty-state">
        <div class="empty-state-icon">${icon('banknote', 48)}</div>
        <h3 class="empty-state-title">Expense Tracking Coming Soon</h3>
        <div class="empty-state-text">Full expense management with categories, vendor tracking, recurring expenses, and P&L reports will be available in the next update.</div>
      </div>
    </div>
  `;
}

// ==========================================
// Make functions global for onclick handlers
// ==========================================
window.navigate = navigate;
window.store = store;
window.closeModal = closeModal;
window.showToast = showToast;
window.formatINR = formatINR;

// ==========================================
// Initialize Application
// ==========================================
function init() {
  const hash = window.location.hash.slice(1);
  if (hash && routes[hash] && store.state.auth.isAuthenticated) {
    navigate(hash);
  } else {
    navigate('login');
  }
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash && routes[hash] && hash !== currentRoute) {
    navigate(hash);
  }
});

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
