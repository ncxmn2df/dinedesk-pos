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
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>',
  arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
  percent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
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
  pos: { title: 'Order Entry', group: 'Operations', render: renderPOS },
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
      ${sidebarItem('pos', 'Order Entry', 'shoppingCart', route)}
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
    return renderEmptyState({
      iconName: 'bell',
      title: 'All caught up',
      description: 'You have no unread operational alerts or notifications.',
      glass: false
    });
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
  const matchedProducts = state.menuItems.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)).slice(0, 3);
  if (matchedProducts.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Menu Dishes</div>';
    matchedProducts.forEach(p => {
      html += `<div class="search-result-item" data-search-nav="pos" style="display:flex;align-items:center;gap:10px">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:28px;height:28px;border-radius:4px;object-fit:cover">
        <div style="flex:1"><strong>${escapeHtml(p.name)}</strong> <span style="font-size:11px;color:var(--color-text-tertiary)">(${p.category})</span></div>
        <span style="font-family:var(--dd-font-mono);font-weight:700">${formatINR(p.price)}</span>
      </div>`;
    });
    html += '</div>';
  }

  // Search customers
  const matchedCustomers = state.customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3);
  if (matchedCustomers.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Customers</div>';
    matchedCustomers.forEach(c => {
      html += `<div class="search-result-item" data-search-nav="customers">${icon('user', 16)} <span>${escapeHtml(c.name)} — ${c.phone}</span></div>`;
    });
    html += '</div>';
  }

  // Search tables
  const matchedTables = state.tables.filter(t => t.number.toLowerCase().includes(q) || t.floor.toLowerCase().includes(q)).slice(0, 3);
  if (matchedTables.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Tables</div>';
    matchedTables.forEach(t => {
      html += `<div class="search-result-item" data-search-nav="tables">${icon('grid', 16)} <span>Table ${t.number} — ${t.floor} Floor (${t.status})</span></div>`;
    });
    html += '</div>';
  }

  // Search staff
  const matchedStaff = state.staff.filter(s => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)).slice(0, 3);
  if (matchedStaff.length) {
    html += '<div class="search-results-group"><div class="search-results-title">Staff Members</div>';
    matchedStaff.forEach(s => {
      html += `<div class="search-result-item" data-search-nav="staff">${icon('userCog', 16)} <span>${escapeHtml(s.name)} — ${s.role} (${s.shift} Shift)</span></div>`;
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

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    openSearchOverlay();
  } else if (e.key === 'Escape') {
    closeSearchOverlay();
    closeModal();
    closeDrawer();
  }
});

// ==========================================
// PAGE: Login / Open Shift (Reference B: 888 × 551 Viewport)
// ==========================================
function renderLogin(container) {
  container.innerHTML = `
    <div class="login-page">
      <div class="login-split-container">
        <!-- Left Hero Brand Panel -->
        <div class="login-left-hero">
          <div class="login-hero-top">
            <div class="login-hero-logo">
              <div class="login-hero-logo-icon">${icon('utensils', 20)}</div>
              <span class="login-hero-logo-text">DineDesk</span>
            </div>
          </div>

          <div class="login-hero-mid">
            <h1 class="login-hero-headline">Your whole floor,<br>on one screen.</h1>
            <p class="login-hero-desc">Real-time tables, instant KDS synchronization, and lightning-fast billing built for high-volume restaurant service.</p>
            <div class="login-hero-chips">
              <span class="login-hero-chip">⚡ 2.4s Avg Bill</span>
              <span class="login-hero-chip">🔄 Live KDS Sync</span>
              <span class="login-hero-chip">🛡️ Cloud Offline</span>
            </div>
          </div>

          <div class="login-hero-bottom">
            <div class="login-hero-metrics">
              <div>
                <div class="login-metric-val">₹42,580</div>
                <div class="login-metric-lbl">Today's Revenue</div>
              </div>
              <div>
                <div class="login-metric-val">156</div>
                <div class="login-metric-lbl">Live Orders</div>
              </div>
              <div>
                <div class="login-metric-val">12/16</div>
                <div class="login-metric-lbl">Active Tables</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Shift Form Panel -->
        <div class="login-right-panel">
          <div class="login-shift-badge">
            <span class="ops-dot green"></span> Active Shift · Lunch Service (11:00 - 16:00)
          </div>
          <h2 class="login-right-title">Welcome back</h2>
          <p class="login-right-desc">Sign in to your station to start or continue your shift.</p>

          <div class="login-error" id="loginError" style="margin-bottom:14px">
            ${icon('alertTriangle', 16)} <span>Invalid email or password. Please try again.</span>
          </div>

          <form class="login-form" id="loginForm">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label" for="loginEmail" style="font-size:12.5px;font-weight:600">Email Address</label>
              <input class="form-input" type="email" id="loginEmail" placeholder="admin@dinedesk.com" value="admin@dinedesk.com" required autocomplete="email" style="height:42px;border-radius:8px">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label" for="loginPassword" style="font-size:12.5px;font-weight:600">Password</label>
              <div class="input-group">
                <input class="form-input" type="password" id="loginPassword" placeholder="Enter your password" value="admin123" required autocomplete="current-password" style="height:42px;border-radius:8px">
                <button type="button" class="input-group-action" id="togglePassword" aria-label="Toggle password visibility">${icon('eye', 18)}</button>
              </div>
            </div>
            <div class="login-options" style="margin-bottom:18px">
              <label class="checkbox" style="font-size:12.5px;color:var(--dd-text-secondary)">
                <input type="checkbox" checked> Keep me signed in
              </label>
              <a href="#" class="login-forgot" onclick="event.preventDefault()" style="font-size:12.5px;color:var(--dd-primary);font-weight:500">Forgot Password?</a>
            </div>
            <button type="submit" class="btn btn-primary btn-block" id="loginSubmitBtn" style="height:44px;font-size:14px;font-weight:700;border-radius:8px">
              Open my shift →
            </button>
          </form>

          <div class="login-divider-row">
            <span>OR QUICK SIGN IN</span>
          </div>

          <div class="login-quick-actions">
            <button type="button" class="login-quick-btn" onclick="showToast('Badge reader ready — scan staff NFC card', 'info')">
              ${icon('userCheck', 15)} Scan staff badge
            </button>
            <button type="button" class="login-quick-btn" onclick="showToast('PIN mode activated', 'info')">
              ${icon('hash', 15)} 4-digit PIN
            </button>
          </div>

          <div class="login-staff-active-indicator">
            <span class="ops-dot green"></span> 8 Staff Members Currently on Shift
          </div>

          <p style="text-align:center;margin-top:14px;font-size:11.5px;color:var(--dd-text-muted)">
            Demo Credentials: <strong>admin@dinedesk.com</strong> / <strong>admin123</strong>
          </p>
        </div>
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
// PAGE: Dashboard (Restaurant Operations Command Center)
// ==========================================
function renderDashboard(container) {
  const metrics = store.getDashboardMetrics();
  const { orders, tables, inventory } = store.state;

  // Filter or compute operational metrics
  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing');
  const delayedOrders = orders.filter(o => {
    if (o.status !== 'Pending' && o.status !== 'Preparing') return false;
    const mins = (Date.now() - new Date(o.createdAt).getTime()) / 60000;
    return mins > 20;
  });
  const reservedTables = tables.filter(t => t.status === 'Reserved');
  const availableTables = tables.filter(t => t.status === 'Available');
  const occupiedTables = tables.filter(t => t.status === 'Occupied');
  const lowStockItems = inventory.filter(i => i.currentStock <= i.reorderLevel);

  // Floor occupancy counts
  const floors = ['Ground', 'First', 'Terrace'];
  const floorStats = floors.map(f => {
    const floorTables = tables.filter(t => t.floor === f);
    const floorOcc = floorTables.filter(t => t.status === 'Occupied').length;
    const pct = floorTables.length ? Math.round((floorOcc / floorTables.length) * 100) : 0;
    return { floor: f, occupied: floorOcc, total: floorTables.length, pct };
  });

  // Top ranked items with revenue calculations
  const rankedItems = [
    { rank: '01', name: 'Butter Chicken', orders: 124, revenue: 39680, pct: 100 },
    { rank: '02', name: 'Paneer Tikka', orders: 98, revenue: 25480, pct: 79 },
    { rank: '03', name: 'Chicken Biryani', orders: 91, revenue: 25480, pct: 73 },
    { rank: '04', name: 'Margherita Pizza', orders: 76, revenue: 18924, pct: 61 },
    { rank: '05', name: 'Masala Fries', orders: 64, revenue: 8256, pct: 51 },
    { rank: '06', name: 'Cold Coffee', orders: 52, revenue: 7748, pct: 42 },
  ];

  // Kitchen status breakdown
  const kNew = orders.filter(o => o.status === 'Pending').length;
  const kPrep = orders.filter(o => o.status === 'Preparing').length;
  const kReady = orders.filter(o => o.status === 'Ready').length;
  const kDelayed = delayedOrders.length;

  container.innerHTML = `
    <div class="dashboard-page">
      <!-- Top Command Center Header -->
      <div class="dashboard-header">
        <div class="dashboard-header-left">
          <h1 class="dashboard-header-title">Dashboard</h1>
          <p class="dashboard-header-subtitle">Today's restaurant performance & live operational overview</p>
        </div>
        <div class="dashboard-header-actions">
          <div class="input-group" style="width:auto">
            <select class="form-select form-select-sm" id="dashDateRange" style="height:32px;font-size:var(--font-size-xs)">
              <option value="today">Today (25 Aug)</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div class="input-group" style="width:auto">
            <select class="form-select form-select-sm" id="dashOutlet" style="height:32px;font-size:var(--font-size-xs)">
              <option>Main Dining</option>
              <option>Rooftop Terrace</option>
              <option>Express Takeaway</option>
            </select>
          </div>
          <button class="btn btn-secondary btn-sm" id="dashRefreshBtn" title="Refresh metrics" style="height:32px">
            ${icon('refresh', 14)} Refresh
          </button>
          <button class="btn btn-primary btn-sm" onclick="navigate('pos')" style="height:32px">
            ${icon('plus', 14)} New Order
          </button>
        </div>
      </div>

      <!-- Single Continuous 4-Column KPI Surface -->
      <div class="kpi-surface">
        <div class="kpi-col">
          <div class="kpi-col-header">
            <span class="kpi-col-label">Today's Revenue</span>
            <span class="kpi-col-icon">${icon('dollarSign', 16)}</span>
          </div>
          <div class="kpi-col-value">${formatINR(metrics.revenue)}</div>
          <div class="kpi-col-footer">
            <span class="kpi-trend-pill up">${icon('trendingUp', 12)} +12.8%</span>
            <span class="kpi-trend-sub">vs yesterday</span>
          </div>
        </div>

        <div class="kpi-col">
          <div class="kpi-col-header">
            <span class="kpi-col-label">Total Orders</span>
            <span class="kpi-col-icon">${icon('clipboardList', 16)}</span>
          </div>
          <div class="kpi-col-value">${metrics.orderCount}</div>
          <div class="kpi-col-footer">
            <span class="kpi-trend-pill up">${icon('trendingUp', 12)} +8.3%</span>
            <span class="kpi-trend-sub">vs yesterday</span>
          </div>
        </div>

        <div class="kpi-col">
          <div class="kpi-col-header">
            <span class="kpi-col-label">Average Order Value</span>
            <span class="kpi-col-icon">${icon('percent', 16)}</span>
          </div>
          <div class="kpi-col-value">${formatINR(metrics.orderCount ? Math.round(metrics.revenue / metrics.orderCount) : 0)}</div>
          <div class="kpi-col-footer">
            <span class="kpi-trend-pill up">${icon('trendingUp', 12)} +4.1%</span>
            <span class="kpi-trend-sub">target ₹250</span>
          </div>
        </div>

        <div class="kpi-col">
          <div class="kpi-col-header">
            <span class="kpi-col-label">Table Occupancy</span>
            <span class="kpi-col-icon">${icon('grid', 16)}</span>
          </div>
          <div class="kpi-col-value">${Math.round(metrics.activeTables / metrics.totalTables * 100)}%</div>
          <div class="kpi-col-footer">
            <span class="kpi-trend-pill ${metrics.activeTables > 0 ? 'up' : 'down'}">${metrics.activeTables} / ${metrics.totalTables} active</span>
            <span class="kpi-trend-sub">${metrics.totalTables - metrics.activeTables} available</span>
          </div>
        </div>
      </div>

      <!-- Asymmetrical Balanced Grid -->
      <div class="dashboard-grid-asym">
        <!-- Row 1: Revenue Overview (62%) + Operations Snapshot (38%) -->
        <div class="grid-row-rev-ops">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Revenue Overview</h3>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">₹278,980 period total · Avg ₹39.8k/day</span>
              </div>
              <div class="tabs-pill">
                <span class="tab-pill active" data-range="7d">7D</span>
                <span class="tab-pill" data-range="30d">30D</span>
                <span class="tab-pill" data-range="90d">90D</span>
              </div>
            </div>
            <div class="card-body" style="height:250px">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Operations Snapshot</h3>
              <span class="badge badge-success badge-dot">Live Shift</span>
            </div>
            <div class="card-body">
              <div class="ops-snapshot-list">
                <div class="ops-snapshot-row">
                  <span class="ops-snapshot-label"><span class="ops-dot amber"></span> Occupied Tables</span>
                  <span class="ops-snapshot-val">${occupiedTables.length} / ${tables.length}</span>
                </div>
                <div class="ops-snapshot-row">
                  <span class="ops-snapshot-label"><span class="ops-dot green"></span> Available Tables</span>
                  <span class="ops-snapshot-val">${availableTables.length}</span>
                </div>
                <div class="ops-snapshot-row">
                  <span class="ops-snapshot-label"><span class="ops-dot blue"></span> Reserved Tables</span>
                  <span class="ops-snapshot-val">${reservedTables.length}</span>
                </div>
                <div class="ops-snapshot-row">
                  <span class="ops-snapshot-label"><span class="ops-dot amber"></span> Kitchen In-Progress</span>
                  <span class="ops-snapshot-val">${activeOrders.length} orders</span>
                </div>
                <div class="ops-snapshot-row">
                  <span class="ops-snapshot-label"><span class="ops-dot red"></span> Delayed Orders (&gt;20m)</span>
                  <span class="ops-snapshot-val" style="color:var(--color-error)">${kDelayed}</span>
                </div>
                <div class="ops-snapshot-row">
                  <span class="ops-snapshot-label"><span class="ops-dot gray"></span> Active Staff On Duty</span>
                  <span class="ops-snapshot-val">7 / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Recent Orders Enterprise Table (62%) + Top Selling Items (38%) -->
        <div class="grid-row-orders-top">
          <div class="card">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:var(--space-3)">
                <h3 class="card-title">Recent Orders</h3>
                <input type="text" placeholder="Search orders..." id="dashOrderSearch" class="form-input form-input-sm" style="width:170px;height:30px;font-size:var(--font-size-xs)">
              </div>
              <button class="btn btn-ghost btn-sm" onclick="navigate('orders')">View All →</button>
            </div>
            <div class="card-body" style="padding:0;overflow-x:auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody id="dashOrdersTbody">
                  ${orders.slice(0, 6).map(o => {
                    const cust = o.customerId ? store.state.customers.find(c => c.id === o.customerId) : null;
                    const tbl = o.tableId ? store.state.tables.find(t => t.id === o.tableId) : null;
                    return `
                      <tr>
                        <td style="font-weight:var(--font-weight-semibold);font-family:var(--dd-font-mono);font-size:12px">${o.id}</td>
                        <td style="color:var(--color-text-primary);font-weight:var(--font-weight-medium)">${cust ? escapeHtml(cust.name) : 'Walk-in'}</td>
                        <td><span class="badge badge-neutral">${tbl ? tbl.number : o.orderType}</span></td>
                        <td>${o.itemCount || (o.items ? o.items.reduce((s,i)=>s+i.quantity,0) : 1)} items</td>
                        <td style="font-weight:var(--font-weight-semibold)">${formatINR(o.total)}</td>
                        <td><span class="badge ${o.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${o.paymentStatus}</span></td>
                        <td><span class="badge ${statusBadgeClass(o.status)}">${o.status}</span></td>
                        <td style="font-size:var(--font-size-xs);color:var(--color-text-tertiary)">${timeAgo(o.createdAt)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Top Selling Items</h3>
              <span style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">Ranked by Volume</span>
            </div>
            <div class="card-body">
              <div class="ranked-items-list">
                ${rankedItems.map(item => `
                  <div class="ranked-item-row">
                    <div class="ranked-item-meta">
                      <span class="ranked-item-name"><span class="ranked-badge">${item.rank}</span> ${item.name}</span>
                      <span class="ranked-item-stats">${item.orders} orders · ${formatINR(item.revenue)}</span>
                    </div>
                    <div class="ranked-progress-track">
                      <div class="ranked-progress-fill" style="width:${item.pct}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Row 3: Low Stock Alerts + Kitchen Status + Table Occupancy by Floor -->
        <div class="grid-row-bottom-3">
          <!-- Low Stock Actionable Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title" style="display:flex;align-items:center;gap:var(--space-1-5)">
                ${icon('alertCircle', 16)} Low Stock Alerts
              </h3>
              <button class="btn btn-ghost btn-sm" onclick="navigate('inventory')">Inventory →</button>
            </div>
            <div class="card-body">
              <div class="low-stock-list">
                ${lowStockItems.slice(0, 3).map(i => `
                  <div class="low-stock-item">
                    <div class="low-stock-info">
                      <span class="low-stock-name">${escapeHtml(i.name)}</span>
                      <span class="low-stock-meta"><span style="color:var(--color-warning);font-weight:var(--font-weight-semibold)">${i.currentStock} ${i.unit} left</span> · Min ${i.reorderLevel} ${i.unit}</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" style="font-size:11px;padding:3px 8px" onclick="store.adjustStock('${i.id}', ${i.reorderLevel * 2});showToast('Reordered 2x stock for ${escapeHtml(i.name)}','success');renderDashboard(document.getElementById('pageContent'))">
                      Reorder
                    </button>
                  </div>
                `).join('')}
                ${lowStockItems.length === 0 ? '<div class="empty-state" style="padding:var(--space-4)"><div class="empty-state-text">All items sufficiently stocked</div></div>' : ''}
              </div>
            </div>
          </div>

          <!-- Kitchen Status Operational Blocks -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title" style="display:flex;align-items:center;gap:var(--space-1-5)">
                ${icon('chefHat', 16)} Kitchen Status
              </h3>
              <button class="btn btn-ghost btn-sm" onclick="navigate('kitchen')">Display →</button>
            </div>
            <div class="card-body">
              <div class="kitchen-status-grid">
                <div class="kitchen-status-tile" onclick="navigate('kitchen')">
                  <span class="kitchen-status-tile-title"><span class="ops-dot amber"></span> New</span>
                  <span class="kitchen-status-tile-count">${kNew}</span>
                </div>
                <div class="kitchen-status-tile" onclick="navigate('kitchen')">
                  <span class="kitchen-status-tile-title"><span class="ops-dot blue"></span> Preparing</span>
                  <span class="kitchen-status-tile-count">${kPrep}</span>
                </div>
                <div class="kitchen-status-tile" onclick="navigate('kitchen')">
                  <span class="kitchen-status-tile-title"><span class="ops-dot green"></span> Ready</span>
                  <span class="kitchen-status-tile-count">${kReady}</span>
                </div>
                <div class="kitchen-status-tile" onclick="navigate('kitchen')">
                  <span class="kitchen-status-tile-title"><span class="ops-dot red"></span> Delayed</span>
                  <span class="kitchen-status-tile-count" style="color:var(--color-error)">${kDelayed}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Occupancy by Floor -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title" style="display:flex;align-items:center;gap:var(--space-1-5)">
                ${icon('grid', 16)} Floor Breakdown
              </h3>
              <button class="btn btn-ghost btn-sm" onclick="navigate('tables')">Tables →</button>
            </div>
            <div class="card-body">
              <div class="floor-occupancy-list">
                ${floorStats.map(f => `
                  <div class="floor-occupancy-item">
                    <div class="floor-occupancy-header">
                      <span class="floor-name">${f.floor} Floor</span>
                      <span class="floor-stat">${f.occupied} / ${f.total} occupied (${f.pct}%)</span>
                    </div>
                    <div class="floor-bar-track">
                      <div class="floor-bar-fill" style="width:${f.pct}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Dashboard Events
  document.getElementById('dashRefreshBtn')?.addEventListener('click', () => {
    showToast('Dashboard metrics refreshed', 'success');
    renderDashboard(container);
  });

  document.getElementById('dashOrderSearch')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#dashOrdersTbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 150));

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
    primary: '#15803D',
    primaryLight: '#22C55E',
    info: '#0284C7',
    warning: '#D97706',
    error: '#DC2626',
    grid: 'rgba(15, 23, 42, 0.05)'
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
          backgroundColor: 'rgba(21, 128, 61, 0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: chartColors.primary
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Revenue: ${formatINR(ctx.raw)}`
            }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: chartColors.grid }, ticks: { callback: v => formatINRShort(v) } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Dashboard events
  document.getElementById('dashRefreshBtn')?.addEventListener('click', () => {
    renderDashboard(container);
    showToast('Dashboard metrics refreshed', 'info');
  });

  document.getElementById('dashDateRange')?.addEventListener('change', (e) => {
    showToast(`Date filter updated: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    renderDashboard(container);
  });
}

// ==========================================
// PAGE: Order Entry (POS)
// ==========================================
function renderPOS(container) {
  const state = store.state;
  const cart = state.cart;
  const activeCategory = window._posCategory || 'all';
  const activeDiet = window._posDietFilter || 'all';
  const searchQuery = (window._posSearchQuery || '').toLowerCase().trim();

  let filteredItems = activeCategory === 'all'
    ? state.menuItems.filter(i => i.available)
    : state.menuItems.filter(i => i.category === activeCategory && i.available);

  // Apply dietary filter
  if (activeDiet === 'veg') {
    filteredItems = filteredItems.filter(i => i.isVeg || ['Salads', 'Desserts', 'Beverages'].includes(i.category));
  } else if (activeDiet === 'nonveg') {
    filteredItems = filteredItems.filter(i => !i.isVeg && !['Desserts', 'Beverages'].includes(i.category));
  } else if (activeDiet === 'popular') {
    filteredItems = filteredItems.filter(i => i.rating >= 4.7 || i.ordersCount > 50);
  }

  if (searchQuery) {
    filteredItems = filteredItems.filter(i => 
      i.name.toLowerCase().includes(searchQuery) || 
      i.category.toLowerCase().includes(searchQuery)
    );
  }

  const calc = calculateOrder(cart.items, cart.discount);
  const totalCartQty = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAvailableCount = state.menuItems.filter(i => i.available).length;

  const selectedCustomer = cart.customerId ? state.customers.find(c => c.id === cart.customerId) : null;
  const selectedTable = cart.tableId ? state.tables.find(t => t.id === cart.tableId) : null;

  container.innerHTML = `
    <div class="pos-layout">
      <!-- 1. Category Sidebar Rail (Left) -->
      <div class="pos-categories">
        <div class="pos-categories-header">
          <span class="pos-categories-title">CATEGORIES</span>
          <span class="pos-categories-total-count">${totalAvailableCount}</span>
        </div>
        <div class="pos-categories-list">
          ${CATEGORIES.map(c => {
            const count = c.id === 'all' 
              ? totalAvailableCount
              : state.menuItems.filter(i => i.category === c.id && i.available).length;
            const isActive = activeCategory === c.id;
            return `
              <div class="pos-category-item ${isActive ? 'active' : ''}" data-category="${c.id}">
                <span class="pos-category-emoji-box">${c.emoji}</span>
                <span class="pos-category-name">${c.name}</span>
                <span class="pos-category-count">${count}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 2. Menu Items Canvas (Center - Flex Expanding) -->
      <div class="pos-products">
        <!-- Integrated Menu Workspace Toolbar -->
        <div class="pos-menu-toolbar">
          <div class="pos-menu-toolbar-top">
            <div class="pos-menu-search-wrap">
              ${icon('search', 15)}
              <input type="text" placeholder="Search menu items (e.g. Pizza, Biryani, Coffee)..." id="posSearchInput" value="${escapeHtml(window._posSearchQuery || '')}" autocomplete="off">
              ${window._posSearchQuery ? `<button class="pos-search-clear" id="posClearSearchBtn" title="Clear search">✕</button>` : ''}
            </div>
            <div class="pos-results-counter">
              Showing <strong>${filteredItems.length}</strong> items
            </div>
          </div>

          <!-- Quick Dietary Filter Chips -->
          <div class="pos-diet-bar">
            <button class="pos-diet-chip ${activeDiet === 'all' ? 'active' : ''}" data-diet="all">All Dishes</button>
            <button class="pos-diet-chip ${activeDiet === 'veg' ? 'active' : ''}" data-diet="veg">
              <span class="pos-diet-dot veg"></span> Pure Veg
            </button>
            <button class="pos-diet-chip ${activeDiet === 'nonveg' ? 'active' : ''}" data-diet="nonveg">
              <span class="pos-diet-dot nonveg"></span> Non-Veg
            </button>
            <button class="pos-diet-chip ${activeDiet === 'popular' ? 'active' : ''}" data-diet="popular">
              ⭐ Chef's Specials
            </button>
          </div>
        </div>

        <!-- Responsive Product Cards Grid -->
        <div class="pos-product-grid" id="posProductGrid">
          ${filteredItems.map(item => {
            const inCart = cart.items.find(i => i.id === item.id);
            const isVeg = item.isVeg || ['Salads', 'Desserts', 'Beverages'].includes(item.category);

            return `
              <div class="pos-product-card ${inCart ? 'in-ticket' : ''}" data-product-id="${item.id}">
                ${inCart ? `<span class="pos-cart-qty-badge">✓ ${inCart.quantity} in ticket</span>` : ''}
                
                <div class="pos-product-image">
                  <span class="pos-diet-badge ${isVeg ? 'veg' : 'nonveg'}">
                    <span class="pos-diet-dot ${isVeg ? 'veg' : 'nonveg'}"></span>
                    ${isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                  <img src="${item.image}" alt="${escapeHtml(item.name)}" class="pos-product-img" loading="lazy">
                </div>

                <div class="pos-product-info">
                  <div class="pos-product-category-tag">${escapeHtml(item.category)}</div>
                  <div class="pos-product-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                </div>

                <div class="pos-product-bottom">
                  <div class="pos-product-price-wrap">
                    <span class="pos-product-price">${formatINR(item.price)}</span>
                  </div>
                  <button class="pos-product-add-btn ${inCart ? 'active' : ''}" aria-label="Add item">
                    +
                  </button>
                </div>
              </div>
            `;
          }).join('')}

          ${filteredItems.length === 0 ? `
            <div class="empty-state" style="grid-column:1/-1;padding:var(--space-12)">
              <div class="empty-state-icon">${icon('coffee', 32)}</div>
              <div class="empty-state-title">No menu items found</div>
              <div class="empty-state-text">No dishes match your active category, dietary filter, or search keywords.</div>
              <button class="btn btn-secondary btn-sm" id="posResetFilterBtn" style="margin-top:var(--space-3)">${icon('refreshCw', 14)} Reset All Filters</button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- 3. Active Order Ticket Panel (Right - Sticky Workflow) -->
      <div class="pos-order-panel">
        <!-- Sticky Ticket Header & Session Controls -->
        <div class="pos-order-header">
          <div class="pos-ticket-title-row">
            <div class="pos-ticket-title">
              ${icon('shoppingCart', 16)}
              <span>Active Ticket</span>
            </div>
            ${cart.items.length > 0 ? `
              <button class="btn btn-ghost btn-sm pos-clear-ticket-btn" id="posClearCartBtn" title="Clear all items">
                ${icon('trash2', 13)} Clear
              </button>
            ` : ''}
          </div>

          <!-- Order Type Segmented Tabs -->
          <div class="pos-order-type-tabs">
            ${[
              { id: 'Dine In', label: 'Dine In' },
              { id: 'Takeaway', label: 'Takeaway' },
              { id: 'Delivery', label: 'Delivery' }
            ].map(t => `
              <div class="pos-order-type-tab ${cart.orderType === t.id ? 'active' : ''}" data-order-type="${t.id}">
                ${t.label}
              </div>
            `).join('')}
          </div>

          <!-- Customer & Table Quick Selectors -->
          <div class="pos-order-selectors">
            <div class="pos-order-selector ${selectedCustomer ? 'has-value' : ''}" id="selectCustomer">
              <span class="pos-sel-icon">${icon('user', 13)}</span>
              <div class="pos-sel-info">
                <span class="pos-sel-label">Customer</span>
                <span class="pos-sel-val">${selectedCustomer ? escapeHtml(selectedCustomer.name) : 'Walk-in Guest'}</span>
              </div>
              <span class="pos-sel-arrow">▾</span>
            </div>

            <div class="pos-order-selector ${selectedTable ? 'has-value' : ''}" id="selectTable">
              <span class="pos-sel-icon">${icon('grid', 13)}</span>
              <div class="pos-sel-info">
                <span class="pos-sel-label">Table</span>
                <span class="pos-sel-val">${selectedTable ? `Table ${selectedTable.number}` : 'Select Table'}</span>
              </div>
              <span class="pos-sel-arrow">▾</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Ticket Items List -->
        <div class="pos-order-items" id="posOrderItems">
          ${cart.items.length === 0 ? `
            <div class="pos-empty-cart">
              <div class="pos-empty-cart-icon">🛒</div>
              <div class="pos-empty-cart-title">Ticket is Empty</div>
              <div class="pos-empty-cart-desc">Add dishes from the menu to start building this order.</div>
            </div>
          ` : cart.items.map(item => `
            <div class="pos-order-item">
              <div class="pos-order-item-main">
                <div class="pos-order-item-title">${escapeHtml(item.name)}</div>
                <div class="pos-order-item-unit">${formatINR(item.price)} each</div>
              </div>

              <div class="pos-qty-control">
                <button class="pos-qty-btn" data-qty-action="dec" data-item-id="${item.id}" title="Decrease">−</button>
                <span class="pos-qty-value">${item.quantity}</span>
                <button class="pos-qty-btn" data-qty-action="inc" data-item-id="${item.id}" title="Increase">+</button>
              </div>

              <div class="pos-order-item-total">${formatINR(item.price * item.quantity)}</div>
              <button class="pos-remove-btn" data-remove-id="${item.id}" aria-label="Remove item" title="Remove">${icon('x', 13)}</button>
            </div>
          `).join('')}
        </div>

        <!-- Sticky Summary & Payment CTA -->
        <div class="pos-order-summary">
          <div class="pos-summary-row">
            <span>Subtotal (${totalCartQty} items)</span>
            <span class="pos-sum-val">${formatINR(calc.subtotal)}</span>
          </div>

          <div class="pos-summary-row">
            <span>Discount</span>
            <div class="pos-discount-wrap">
              <span class="pos-discount-currency">₹</span>
              <input class="pos-discount-input" type="number" min="0" value="${cart.discount || ''}" id="posDiscount" placeholder="0">
            </div>
          </div>

          <div class="pos-summary-row">
            <span>GST (5%)</span>
            <span class="pos-sum-val">${formatINR(calc.tax)}</span>
          </div>

          <div class="pos-summary-row total">
            <span class="pos-total-label">Grand Total</span>
            <span class="pos-total-val" id="posGrandTotalDisplay">${formatINR(calc.grandTotal)}</span>
          </div>

          <button class="pos-pay-btn" id="posProceedPayBtn" ${cart.items.length === 0 ? 'disabled' : ''}>
            ${icon('creditCard', 16)} Pay Now · ${formatINR(calc.grandTotal)}
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

  // Dietary filter selection
  document.querySelectorAll('[data-diet]').forEach(el => {
    el.addEventListener('click', () => {
      window._posDietFilter = el.dataset.diet;
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
    el.addEventListener('click', (e) => {
      e.stopPropagation();
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
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      store.removeFromCart(el.dataset.removeId);
      renderPOS(document.getElementById('pageContent'));
    });
  });

  // Clear Cart
  document.getElementById('posClearCartBtn')?.addEventListener('click', () => {
    store.clearCart();
    renderPOS(document.getElementById('pageContent'));
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
    const calc = calculateOrder(store.state.cart.items, store.state.cart.discount);
    const taxEl = document.querySelector('.pos-summary-row:nth-child(3) .pos-sum-val');
    if (taxEl) taxEl.textContent = formatINR(calc.tax);
    const totalEl = document.getElementById('posGrandTotalDisplay');
    if (totalEl) totalEl.textContent = formatINR(calc.grandTotal);
    const payBtn = document.getElementById('posProceedPayBtn');
    if (payBtn) payBtn.innerHTML = `${icon('creditCard', 16)} Proceed to Payment · ${formatINR(calc.grandTotal)}`;
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
      showToast(`Order ${order.id} ticket created!`, 'success');
      navigate('billing');
    }
  });

  // Search
  document.getElementById('posSearchInput')?.addEventListener('input', debounce((e) => {
    window._posSearchQuery = e.target.value;
    renderPOS(document.getElementById('pageContent'));
  }, 180));

  // Clear Search
  document.getElementById('posClearSearchBtn')?.addEventListener('click', () => {
    window._posSearchQuery = '';
    renderPOS(document.getElementById('pageContent'));
  });

  // Reset Filters
  document.getElementById('posResetFilterBtn')?.addEventListener('click', () => {
    window._posCategory = 'all';
    window._posDietFilter = 'all';
    window._posSearchQuery = '';
    renderPOS(document.getElementById('pageContent'));
  });
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
// PAGE: Tables (Table Management Command Center)
// ==========================================
function renderTables(container) {
  const { tables, orders } = store.state;
  const floors = ['All', 'Ground', 'First', 'Terrace'];
  const currentFloor = window._tableFloor || 'All';
  const currentStatus = window._tableStatusFilter || 'All';
  const currentSearch = (window._tableSearchQuery || '').toLowerCase();
  const currentSort = window._tableSortOption || 'number';

  // Filter tables
  let filtered = tables.filter(t => {
    if (currentFloor !== 'All' && t.floor !== currentFloor) return false;
    if (currentStatus !== 'All' && t.status !== currentStatus) return false;
    if (currentSearch) {
      const matchNum = t.number.toLowerCase().includes(currentSearch);
      const matchFloor = t.floor.toLowerCase().includes(currentSearch);
      const order = t.currentOrderId ? orders.find(o => o.id === t.currentOrderId) : null;
      const matchOrder = order && order.id.toLowerCase().includes(currentSearch);
      if (!matchNum && !matchFloor && !matchOrder) return false;
    }
    return true;
  });

  // Sort tables
  filtered.sort((a, b) => {
    if (currentSort === 'number') {
      const numA = parseInt(a.number.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.number.replace(/\D/g, '')) || 0;
      return numA - numB;
    }
    if (currentSort === 'status') return a.status.localeCompare(b.status);
    if (currentSort === 'capacity') return b.capacity - a.capacity;
    if (currentSort === 'value') {
      const ordA = a.currentOrderId ? orders.find(o => o.id === a.currentOrderId) : null;
      const ordB = b.currentOrderId ? orders.find(o => o.id === b.currentOrderId) : null;
      return (ordB ? ordB.total : 0) - (ordA ? ordA.total : 0);
    }
    return 0;
  });

  // Count summaries
  const totalCount = tables.length;
  const availCount = tables.filter(t => t.status === 'Available').length;
  const occCount = tables.filter(t => t.status === 'Occupied').length;
  const resCount = tables.filter(t => t.status === 'Reserved').length;
  const cleanCount = tables.filter(t => t.status === 'Cleaning').length;

  container.innerHTML = `
    <div class="tables-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-content">
          <h2 class="page-header-title">Table Management</h2>
          <p class="page-header-desc">Monitor table occupancy, dining sessions, and seat availability in real-time.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary btn-sm" id="newReservationBtn">${icon('calendar', 14)} New Reservation</button>
          <button class="btn btn-primary btn-sm" id="openTableBtn">${icon('plus', 14)} Open Table</button>
        </div>
      </div>

      <!-- Operational Toolbar -->
      <div class="tables-toolbar">
        <div class="tables-toolbar-top">
          <div class="tables-toolbar-left-group">
            <!-- Search -->
            <div class="tables-search-wrap">
              ${icon('search', 14)}
              <input type="text" placeholder="Search table #, floor, order..." id="tablesSearchInput" value="${escapeHtml(window._tableSearchQuery || '')}">
            </div>

            <!-- Floor Segmented Tabs -->
            <div class="tabs-pill">
              ${floors.map(f => `<span class="tab-pill ${currentFloor === f ? 'active' : ''}" data-table-floor="${f}">${f}</span>`).join('')}
            </div>
          </div>

          <div class="tables-toolbar-right">
            <select class="form-select form-select-sm" id="tablesSortSelect" style="height:36px;font-size:var(--font-size-xs);min-width:140px">
              <option value="number" ${currentSort === 'number' ? 'selected' : ''}>Sort by Table #</option>
              <option value="status" ${currentSort === 'status' ? 'selected' : ''}>Sort by Status</option>
              <option value="capacity" ${currentSort === 'capacity' ? 'selected' : ''}>Sort by Capacity</option>
              <option value="value" ${currentSort === 'value' ? 'selected' : ''}>Sort by Order Value</option>
            </select>
          </div>
        </div>

        <div class="tables-toolbar-bottom">
          <!-- Status Filter Chips -->
          <div class="tables-status-filters">
            <span class="status-filter-chip ${currentStatus === 'All' ? 'active' : ''}" data-status-filter="All">All (${totalCount})</span>
            <span class="status-filter-chip ${currentStatus === 'Available' ? 'active' : ''}" data-status-filter="Available"><span class="ops-dot green"></span> Available (${availCount})</span>
            <span class="status-filter-chip ${currentStatus === 'Occupied' ? 'active' : ''}" data-status-filter="Occupied"><span class="ops-dot amber"></span> Occupied (${occCount})</span>
            <span class="status-filter-chip ${currentStatus === 'Reserved' ? 'active' : ''}" data-status-filter="Reserved"><span class="ops-dot blue"></span> Reserved (${resCount})</span>
            <span class="status-filter-chip ${currentStatus === 'Cleaning' ? 'active' : ''}" data-status-filter="Cleaning"><span class="ops-dot gray"></span> Cleaning (${cleanCount})</span>
          </div>
        </div>
      </div>

      <!-- Dense Operational Table Grid -->
      <div class="tables-grid-dense">
        ${filtered.map(t => {
          const order = t.currentOrderId ? orders.find(o => o.id === t.currentOrderId) : null;
          const statusLower = t.status.toLowerCase();

          return `
            <div class="table-tile" data-open-table-drawer="${t.id}">
              <div class="table-tile-top">
                <div class="table-tile-num-wrap">
                  <span class="table-tile-number">${t.number}</span>
                  <span class="table-tile-seats">${t.capacity} seats</span>
                </div>
                <span class="table-tile-status-tag ${statusLower}">
                  <span class="ops-dot ${statusLower === 'available' ? 'green' : statusLower === 'occupied' ? 'amber' : statusLower === 'reserved' ? 'blue' : 'gray'}" style="width:6px;height:6px"></span>
                  ${t.status}
                </span>
              </div>

              <div class="table-tile-body">
                ${t.status === 'Occupied' && order ? `
                  <div class="table-tile-row-main">
                    <span class="table-tile-amount">${formatINR(order.total)}</span>
                    <span class="table-tile-time">${icon('clock', 11)} ${elapsedTime(t.occupiedSince)}</span>
                  </div>
                  <div class="table-tile-row-sub">
                    <span>${order.id}</span>
                    <span>Waiter: Ravi</span>
                  </div>
                ` : t.status === 'Reserved' ? `
                  <div class="table-tile-row-main">
                    <span class="table-tile-res-guest">Aarav Sharma</span>
                    <span class="table-tile-time">${icon('clock', 11)} 19:30</span>
                  </div>
                  <div class="table-tile-row-sub">
                    <span>4 guests party</span>
                    <span style="color:var(--color-info)">Reserved</span>
                  </div>
                ` : t.status === 'Cleaning' ? `
                  <div class="table-tile-row-main">
                    <span>Under Sanitization</span>
                    <span class="table-tile-action-link">Ready soon</span>
                  </div>
                  <div class="table-tile-row-sub">
                    <span>Staff resetting</span>
                    <span>Cleaning</span>
                  </div>
                ` : `
                  <div class="table-tile-row-main">
                    <span>${t.floor} Floor</span>
                    <span class="table-tile-action-link">Click to Open →</span>
                  </div>
                  <div class="table-tile-row-sub">
                    <span>Ready for seating</span>
                    <span>Available</span>
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${filtered.length === 0 ? renderEmptyState({
        iconName: 'grid',
        title: 'No tables match filters',
        description: 'Try adjusting your search query, floor selection, or status filters.',
        actionText: 'Reset Filters',
        actionId: 'resetTableFiltersBtn'
      }) : ''}
    </div>
  `;

  // Bind Table Management Events
  document.querySelectorAll('[data-table-floor]').forEach(el => {
    el.addEventListener('click', () => {
      window._tableFloor = el.dataset.tableFloor;
      renderTables(container);
    });
  });

  document.querySelectorAll('[data-status-filter]').forEach(el => {
    el.addEventListener('click', () => {
      window._tableStatusFilter = el.dataset.statusFilter;
      renderTables(container);
    });
  });

  document.getElementById('tablesSearchInput')?.addEventListener('input', debounce((e) => {
    window._tableSearchQuery = e.target.value;
    renderTables(container);
  }, 150));

  document.getElementById('tablesSortSelect')?.addEventListener('change', (e) => {
    window._tableSortOption = e.target.value;
    renderTables(container);
  });

  document.getElementById('resetTableFiltersBtn')?.addEventListener('click', () => {
    window._tableFloor = 'All';
    window._tableStatusFilter = 'All';
    window._tableSearchQuery = '';
    renderTables(container);
  });

  document.getElementById('openTableBtn')?.addEventListener('click', () => {
    const avail = store.state.tables.find(t => t.status === 'Available');
    if (avail) {
      openTableDrawer(avail.id);
    } else {
      showToast('No available tables currently', 'warning');
    }
  });

  document.getElementById('newReservationBtn')?.addEventListener('click', () => {
    showModal('New Table Reservation', `
      <form id="resForm">
        <div class="form-group"><label class="form-label">Guest Name</label><input class="form-input" name="name" placeholder="Customer name" required></div>
        <div class="form-group"><label class="form-label">Contact Phone</label><input class="form-input" name="phone" placeholder="+91 98765 43210" required></div>
        <div class="form-group"><label class="form-label">Select Table</label>
          <select class="form-select" name="tableId">
            ${tables.filter(t => t.status === 'Available').map(t => `<option value="${t.id}">Table ${t.number} (${t.capacity} seats - ${t.floor})</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Reservation Time</label><input class="form-input" type="time" name="time" value="19:30" required></div>
        <div class="form-group"><label class="form-label">Special Notes</label><textarea class="form-textarea" name="notes" placeholder="e.g. Window preference, anniversary dinner"></textarea></div>
      </form>
    `, () => {
      const data = Object.fromEntries(new FormData(document.getElementById('resForm')));
      if (data.tableId) {
        store.updateTableStatus(data.tableId, 'Reserved');
        showToast(`Table reserved for ${data.name || 'Guest'}`, 'success');
        closeModal();
        renderTables(container);
      }
    });
  });

  // Table Drawer Click
  document.querySelectorAll('[data-open-table-drawer]').forEach(el => {
    el.addEventListener('click', () => {
      openTableDrawer(el.dataset.openTableDrawer);
    });
  });
}

function openTableDrawer(tableId) {
  const table = store.state.tables.find(t => t.id === tableId);
  if (!table) return;
  const order = table.currentOrderId ? store.state.orders.find(o => o.id === table.currentOrderId) : null;
  const customer = order?.customerId ? store.state.customers.find(c => c.id === order.customerId) : null;

  const statusClass = table.status.toLowerCase();

  let body = `
    <!-- Session Summary -->
    <div class="table-drawer-summary">
      <div>
        <div style="font-size:var(--font-size-lg);font-weight:var(--font-weight-bold);color:var(--color-text-primary)">Table ${table.number}</div>
        <div style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">${table.capacity} Seats · ${table.floor} Floor</div>
      </div>
      <span class="table-tile-status-tag ${statusClass}">
        <span class="ops-dot ${statusClass === 'available' ? 'green' : statusClass === 'occupied' ? 'amber' : statusClass === 'reserved' ? 'blue' : 'gray'}"></span>
        ${table.status}
      </span>
    </div>
  `;

  if (table.status === 'Occupied' && order) {
    body += `
      <div style="margin-bottom:var(--space-4)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">
          <span style="font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:var(--color-text-primary)">Active Dining Session</span>
          <span style="font-family:var(--dd-font-mono);font-size:var(--font-size-xs);color:var(--color-text-secondary)">${order.id}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);background:var(--color-surface-hover);padding:var(--space-3);border-radius:var(--radius-md);font-size:var(--font-size-xs);color:var(--color-text-secondary)">
          <div><strong>Guest:</strong> ${customer ? escapeHtml(customer.name) : 'Walk-in'}</div>
          <div><strong>Started:</strong> ${formatTime(order.createdAt)} (${elapsedTime(table.occupiedSince)})</div>
          <div><strong>Waiter:</strong> Ravi Shankar</div>
          <div><strong>Status:</strong> ${order.status}</div>
        </div>
      </div>

      <!-- Itemized List -->
      <div style="font-size:var(--font-size-xs);font-weight:var(--font-weight-semibold);text-transform:uppercase;color:var(--color-text-secondary);letter-spacing:0.04em;margin-bottom:var(--space-2)">
        Ordered Items (${order.items.reduce((s,i)=>s+i.quantity,0)})
      </div>
      <div class="table-drawer-order-list">
        ${order.items.map(item => `
          <div class="table-drawer-order-item">
            <div>
              <span style="font-weight:var(--font-weight-medium);color:var(--color-text-primary)">${item.quantity}x</span>
              <span style="color:var(--color-text-primary)">${escapeHtml(item.name)}</span>
            </div>
            <span style="font-weight:var(--font-weight-semibold);font-family:var(--dd-font-mono)">${formatINR(item.price * item.quantity)}</span>
          </div>
        `).join('')}
      </div>

      <!-- Order Totals -->
      <div class="table-drawer-totals">
        <div class="table-drawer-totals-row"><span>Subtotal</span><span>${formatINR(order.subtotal)}</span></div>
        <div class="table-drawer-totals-row"><span>Tax (5% GST)</span><span>${formatINR(order.tax)}</span></div>
        ${order.discount > 0 ? `<div class="table-drawer-totals-row" style="color:var(--color-success)"><span>Discount</span><span>-${formatINR(order.discount)}</span></div>` : ''}
        <div class="table-drawer-totals-row grand-total"><span>Total Bill</span><span>${formatINR(order.total)}</span></div>
      </div>
    `;
  } else if (table.status === 'Reserved') {
    body += `
      <div style="background:var(--color-surface-hover);padding:var(--space-4);border-radius:var(--radius-md);margin-bottom:var(--space-4);font-size:var(--font-size-sm)">
        <div style="font-weight:var(--font-weight-semibold);color:var(--color-text-primary);margin-bottom:var(--space-2)">Reservation Information</div>
        <div style="color:var(--color-text-secondary);display:flex;flex-direction:column;gap:var(--space-1);font-size:var(--font-size-xs)">
          <div><strong>Guest Name:</strong> Aarav Sharma</div>
          <div><strong>Party Size:</strong> 4 Guests</div>
          <div><strong>Time:</strong> 19:30 PM (Today)</div>
          <div><strong>Phone:</strong> +91 98765 43210</div>
          <div><strong>Notes:</strong> Window corner preference</div>
        </div>
      </div>
    `;
  } else if (table.status === 'Cleaning') {
    body += `
      <div style="background:var(--color-surface-hover);padding:var(--space-4);border-radius:var(--radius-md);margin-bottom:var(--space-4);font-size:var(--font-size-sm);text-align:center">
        <div style="font-weight:var(--font-weight-semibold);color:var(--color-text-primary);margin-bottom:var(--space-1)">Table Undergoing Sanitization</div>
        <p style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">Staff is cleaning and resetting Table ${table.number}. Mark as available when ready for guests.</p>
      </div>
    `;
  } else {
    body += `
      <div style="background:var(--color-surface-hover);padding:var(--space-4);border-radius:var(--radius-md);margin-bottom:var(--space-4);font-size:var(--font-size-sm)">
        <div style="font-weight:var(--font-weight-semibold);color:var(--color-text-primary);margin-bottom:var(--space-1)">Table Ready for Dining</div>
        <p style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">Open this table to start a new dining session or place an order from Order Entry.</p>
      </div>
    `;
  }

  // Footer Actions
  let footer = '<div class="table-drawer-actions" style="width:100%">';

  if (table.status === 'Occupied' && order) {
    footer += `
      <button class="btn btn-secondary btn-sm" onclick="closeDrawer();store.state.cart.tableId='${table.id}';navigate('pos')">
        ${icon('plus', 14)} Add Items
      </button>
      <button class="btn btn-primary btn-sm" onclick="closeDrawer();store.state.currentBillingOrder=store.state.orders.find(o=>o.id==='${order.id}');navigate('billing')">
        ${icon('receipt', 14)} Print Bill & Pay
      </button>
      <button class="btn btn-secondary btn-sm" onclick="showTransferTableModal('${table.id}')">
        ${icon('arrowRight', 14)} Move Table
      </button>
      <button class="btn btn-secondary btn-sm" onclick="showMergeTableModal('${table.id}')">
        ${icon('layers', 14)} Merge
      </button>
      <button class="btn btn-secondary btn-sm" style="grid-column:span 2" onclick="store.updateTableStatus('${table.id}','Cleaning');closeDrawer();renderTables(document.getElementById('pageContent'));showToast('Table ${table.number} set to Cleaning','info')">
        Close Session & Mark Cleaning
      </button>
    `;
  } else if (table.status === 'Available') {
    footer += `
      <button class="btn btn-primary btn-sm" style="grid-column:span 2" onclick="closeDrawer();store.state.cart.tableId='${table.id}';store.updateTableStatus('${table.id}','Occupied');navigate('pos');showToast('Table ${table.number} opened for new session','success')">
        ${icon('plus', 14)} Open New Session
      </button>
      <button class="btn btn-secondary btn-sm" onclick="store.updateTableStatus('${table.id}','Reserved');closeDrawer();renderTables(document.getElementById('pageContent'));showToast('Table ${table.number} reserved','success')">
        Reserve
      </button>
      <button class="btn btn-secondary btn-sm" onclick="store.updateTableStatus('${table.id}','Cleaning');closeDrawer();renderTables(document.getElementById('pageContent'));showToast('Table ${table.number} marked for cleaning','info')">
        Clean
      </button>
    `;
  } else if (table.status === 'Reserved') {
    footer += `
      <button class="btn btn-primary btn-sm" style="grid-column:span 2" onclick="closeDrawer();store.state.cart.tableId='${table.id}';store.updateTableStatus('${table.id}','Occupied');navigate('pos');showToast('Seated reservation at Table ${table.number}','success')">
        Seat Guests & Open Order
      </button>
      <button class="btn btn-secondary btn-sm" style="grid-column:span 2" onclick="store.updateTableStatus('${table.id}','Available');closeDrawer();renderTables(document.getElementById('pageContent'));showToast('Reservation cancelled, table available','info')">
        Cancel Reservation
      </button>
    `;
  } else if (table.status === 'Cleaning') {
    footer += `
      <button class="btn btn-primary btn-sm" style="grid-column:span 2" onclick="store.updateTableStatus('${table.id}','Available');closeDrawer();renderTables(document.getElementById('pageContent'));showToast('Table ${table.number} is now Available','success')">
        Mark Ready & Available
      </button>
    `;
  }

  footer += '</div>';

  showDrawer(`Table Details · Table ${table.number}`, body, footer);
}

function showTransferTableModal(fromTableId) {
  const fromTable = store.state.tables.find(t => t.id === fromTableId);
  const availableTables = store.state.tables.filter(t => t.status === 'Available' && t.id !== fromTableId);

  showModal('Transfer / Move Table', `
    <div style="margin-bottom:var(--space-4)">
      <p style="font-size:var(--font-size-sm);color:var(--color-text-secondary);margin-bottom:var(--space-3)">
        Move active order from <strong>Table ${fromTable?.number}</strong> to another available table:
      </p>
      <div class="form-group">
        <label class="form-label">Select Target Table</label>
        <select class="form-select" id="targetTableSelect">
          ${availableTables.map(t => `<option value="${t.id}">Table ${t.number} (${t.capacity} seats · ${t.floor} Floor)</option>`).join('')}
        </select>
        ${availableTables.length === 0 ? '<div class="form-hint" style="color:var(--color-error)">No available tables to move to.</div>' : ''}
      </div>
    </div>
  `, () => {
    const targetTableId = document.getElementById('targetTableSelect')?.value;
    if (!targetTableId) return;
    const targetTable = store.state.tables.find(t => t.id === targetTableId);
    
    // Transfer order
    targetTable.currentOrderId = fromTable.currentOrderId;
    targetTable.occupiedSince = fromTable.occupiedSince;
    targetTable.status = 'Occupied';

    fromTable.currentOrderId = null;
    fromTable.occupiedSince = null;
    fromTable.status = 'Cleaning';

    closeModal();
    closeDrawer();
    renderTables(document.getElementById('pageContent'));
    showToast(`Order transferred from Table ${fromTable.number} → Table ${targetTable.number}`, 'success');
  });
}

function showMergeTableModal(primaryTableId) {
  const primaryTable = store.state.tables.find(t => t.id === primaryTableId);
  const otherTables = store.state.tables.filter(t => t.id !== primaryTableId);

  showModal('Merge Tables', `
    <div style="margin-bottom:var(--space-4)">
      <p style="font-size:var(--font-size-sm);color:var(--color-text-secondary);margin-bottom:var(--space-3)">
        Combine Table <strong>${primaryTable?.number}</strong> with another table for larger parties:
      </p>
      <div class="form-group">
        <label class="form-label">Select Table to Merge With</label>
        <select class="form-select" id="mergeTableSelect">
          ${otherTables.map(t => `<option value="${t.id}">Table ${t.number} (${t.status} · ${t.capacity} seats)</option>`).join('')}
        </select>
      </div>
    </div>
  `, () => {
    const mergeId = document.getElementById('mergeTableSelect')?.value;
    const mergedTbl = store.state.tables.find(t => t.id === mergeId);
    if (mergedTbl) {
      mergedTbl.status = 'Occupied';
      mergedTbl.currentOrderId = primaryTable.currentOrderId;
      closeModal();
      closeDrawer();
      renderTables(document.getElementById('pageContent'));
      showToast(`Merged Table ${primaryTable.number} with Table ${mergedTbl.number}`, 'success');
    }
  });
}

function showTableDetail(tableId) {
  openTableDrawer(tableId);
}

// ==========================================
// PAGE: Kitchen Display System (KDS)
// ==========================================
function renderKitchen(container) {
  const orders = store.state.orders;
  const activeTab = window._kitchenTab || 'all';

  // Compute live elapsed times & states
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  const readyOrders = orders.filter(o => o.status === 'Ready');

  const delayedOrders = orders.filter(o => {
    if (o.status !== 'Pending' && o.status !== 'Preparing') return false;
    const mins = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
    return mins > 20;
  });

  container.innerHTML = `
    <div class="kitchen-page">
      <!-- KDS Header Bar -->
      <div class="kitchen-header-card">
        <div class="kitchen-header-left">
          <div class="kitchen-header-title-wrap">
            <h1 class="kitchen-header-title">Kitchen Display</h1>
            <span class="badge badge-success badge-dot">Live Ticket Feed</span>
          </div>
          <p class="kitchen-header-subtitle">Real-time order preparation & station routing</p>
        </div>

        <div class="kitchen-header-right">
          <!-- KDS Filter Tabs -->
          <div class="tabs-pill">
            <span class="tab-pill ${activeTab === 'all' ? 'active' : ''}" data-kitchen-tab="all">All (${orders.filter(o=>['Pending','Preparing','Ready'].includes(o.status)).length})</span>
            <span class="tab-pill ${activeTab === 'Pending' ? 'active' : ''}" data-kitchen-tab="Pending">New (${pendingOrders.length})</span>
            <span class="tab-pill ${activeTab === 'Preparing' ? 'active' : ''}" data-kitchen-tab="Preparing">Preparing (${preparingOrders.length})</span>
            <span class="tab-pill ${activeTab === 'Ready' ? 'active' : ''}" data-kitchen-tab="Ready">Ready (${readyOrders.length})</span>
            <span class="tab-pill ${activeTab === 'Delayed' ? 'active' : ''}" data-kitchen-tab="Delayed" style="color:var(--color-error)">Delayed (${delayedOrders.length})</span>
          </div>

          <button class="btn btn-secondary btn-sm" id="kdsRefreshBtn" title="Refresh Tickets">
            ${icon('refreshCw', 13)} Refresh
          </button>
        </div>
      </div>

      <!-- 4-Column Operational KDS Layout -->
      <div class="kitchen-layout-4col">
        ${(activeTab === 'all' || activeTab === 'Pending') ? kitchenKdsColumn('New Orders', pendingOrders, 'amber', 'Pending') : ''}
        ${(activeTab === 'all' || activeTab === 'Preparing') ? kitchenKdsColumn('Preparing', preparingOrders, 'blue', 'Preparing') : ''}
        ${(activeTab === 'all' || activeTab === 'Ready') ? kitchenKdsColumn('Ready for Service', readyOrders, 'green', 'Ready') : ''}
        ${(activeTab === 'all' || activeTab === 'Delayed') ? kitchenKdsColumn('Delayed (>20m)', delayedOrders, 'red', 'Delayed') : ''}
      </div>
    </div>
  `;

  bindKitchenEvents();
}

function kitchenKdsColumn(title, orders, statusColor, columnType) {
  return `
    <div class="kitchen-column ${columnType === 'Delayed' ? 'delayed-column' : ''}">
      <div class="kitchen-column-header">
        <div class="kitchen-column-title">
          <span class="ops-dot ${statusColor}"></span>
          <span>${title}</span>
        </div>
        <span class="kitchen-column-count">${orders.length}</span>
      </div>

      <div class="kitchen-column-body">
        ${orders.length === 0 ? `
          <div class="empty-state glass" style="padding:var(--space-6);margin:var(--space-3) 0">
            <div class="empty-state-icon" style="width:36px;height:36px;margin-bottom:var(--space-2)">${icon('checkCircle', 18)}</div>
            <div class="empty-state-title" style="font-size:12.5px">No ${title.toLowerCase()}</div>
            <div class="empty-state-text" style="font-size:11px;margin-bottom:0">Station is all caught up.</div>
          </div>
        ` : ''}

        ${orders.map(o => {
          const minsSinceCreate = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
          const isDelayed = minsSinceCreate > 20;
          const customer = o.customerId ? store.state.customers.find(c => c.id === o.customerId) : null;
          const table = o.tableId ? store.state.tables.find(t => t.id === o.tableId) : null;
          const totalQty = o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 0;

          return `
            <div class="kitchen-ticket-card ${isDelayed ? 'urgent-ticket' : ''}" data-order-id="${o.id}">
              <!-- Card Header -->
              <div class="kitchen-ticket-top">
                <div class="kitchen-ticket-id-wrap">
                  <span class="kitchen-ticket-num">#${o.id}</span>
                  ${table ? `<span class="kitchen-ticket-table-badge">Table ${table.number}</span>` : `<span class="badge badge-neutral">${o.orderType}</span>`}
                </div>
                <div class="kitchen-ticket-timer ${isDelayed ? 'timer-delayed' : ''}">
                  ${icon('clock', 11)} ${minsSinceCreate}m ago
                </div>
              </div>

              <!-- Card Sub-meta -->
              <div class="kitchen-ticket-meta">
                <span>${customer ? escapeHtml(customer.name) : 'Walk-in'}</span>
                <span>${totalQty} items</span>
              </div>

              <!-- Itemized List with modifiers -->
              <div class="kitchen-ticket-items">
                ${o.items.map(item => `
                  <div class="kitchen-ticket-item-row">
                    <span class="kitchen-ticket-item-qty">${item.quantity}×</span>
                    <span class="kitchen-ticket-item-name">${escapeHtml(item.name)}</span>
                  </div>
                `).join('')}
              </div>

              ${o.notes ? `
                <div class="kitchen-ticket-instruction">
                  <span>📝 Instruction:</span> ${escapeHtml(o.notes)}
                </div>
              ` : ''}

              <!-- Actions -->
              <div class="kitchen-ticket-actions">
                ${o.status === 'Pending' ? `
                  <button class="btn btn-primary btn-sm kitchen-act-btn" data-kitchen-action="Preparing" data-order-id="${o.id}">
                    Start Preparing
                  </button>
                ` : o.status === 'Preparing' ? `
                  <button class="btn btn-success btn-sm kitchen-act-btn" data-kitchen-action="Ready" data-order-id="${o.id}">
                    ${icon('check', 13)} Mark Ready
                  </button>
                ` : o.status === 'Ready' ? `
                  <button class="btn btn-primary btn-sm kitchen-act-btn" data-kitchen-action="Completed" data-order-id="${o.id}">
                    ${icon('checkCircle', 13)} Complete / Served
                  </button>
                ` : ''}

                <button class="btn btn-ghost btn-sm" data-kitchen-detail="${o.id}" title="View Ticket Details">
                  ${icon('eye', 13)}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function bindKitchenEvents() {
  // Tab filtering
  document.querySelectorAll('[data-kitchen-tab]').forEach(el => {
    el.addEventListener('click', () => {
      window._kitchenTab = el.dataset.kitchenTab;
      renderKitchen(document.getElementById('pageContent'));
    });
  });

  // Refresh
  document.getElementById('kdsRefreshBtn')?.addEventListener('click', () => {
    renderKitchen(document.getElementById('pageContent'));
    showToast('Kitchen tickets refreshed', 'info');
  });

  // Action status transitions
  document.querySelectorAll('[data-kitchen-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = el.dataset.kitchenAction;
      const orderId = el.dataset.orderId;
      store.updateOrderStatus(orderId, action);
      showToast(`Ticket #${orderId} marked as ${action}`, 'success');
      renderKitchen(document.getElementById('pageContent'));
    });
  });

  // Ticket Detail View
  document.querySelectorAll('[data-kitchen-detail]').forEach(el => {
    el.addEventListener('click', () => {
      const orderId = el.dataset.kitchenDetail;
      const order = store.state.orders.find(o => o.id === orderId);
      if (!order) return;
      const table = order.tableId ? store.state.tables.find(t => t.id === order.tableId) : null;
      const customer = order.customerId ? store.state.customers.find(c => c.id === order.customerId) : null;

      showModal(`Ticket #${order.id} · Details`, `
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);background:var(--color-surface-hover);padding:var(--space-3);border-radius:var(--radius-md);font-size:var(--font-size-xs)">
            <div><strong>Session:</strong> ${order.orderType} ${table ? `(Table ${table.number})` : ''}</div>
            <div><strong>Customer:</strong> ${customer ? escapeHtml(customer.name) : 'Walk-in'}</div>
            <div><strong>Created:</strong> ${formatTime(order.createdAt)}</div>
            <div><strong>Status:</strong> <span class="badge ${statusBadgeClass(order.status)}">${order.status}</span></div>
          </div>

          <div style="font-weight:600;font-size:var(--font-size-sm);margin-top:var(--space-2)">Items to Prepare</div>
          <div style="border:1px solid var(--color-border);border-radius:var(--radius-md);overflow:hidden">
            ${order.items.map(i => `
              <div style="display:flex;justify-content:space-between;padding:var(--space-2) var(--space-3);border-bottom:1px solid var(--color-border-light);font-size:var(--font-size-sm)">
                <span><strong>${i.quantity}×</strong> ${escapeHtml(i.name)}</span>
                <span style="font-family:var(--dd-font-mono)">${formatINR(i.price * i.quantity)}</span>
              </div>
            `).join('')}
          </div>

          ${order.notes ? `
            <div style="padding:var(--space-2-5,10px);background:rgba(217, 119, 6, 0.08);border-left:3px solid var(--color-warning);border-radius:var(--radius-sm);font-size:var(--font-size-xs)">
              <strong>Special Instructions:</strong> ${escapeHtml(order.notes)}
            </div>
          ` : ''}
        </div>
      `);
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
        <div class="empty-state-text">Create an order from Order Entry or select from Orders to bill</div>
        <button class="btn btn-primary" onclick="navigate('pos')" style="margin-top:var(--space-4)">Go to Order Entry</button>
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
              ${customer ? `<div style="font-weight:600;font-size:14px;color:var(--dd-text)">${escapeHtml(customer.name)}</div><div style="font-size:12.5px;color:var(--dd-text-muted)">${customer.phone}</div>` : ''}
              <div style="margin-top:6px;display:flex;justify-content:flex-end;gap:4px">
                ${table ? `<span class="badge badge-loyalty">Table ${table.number}</span>` : ''}
                <span class="badge badge-channel">${order.orderType}</span>
              </div>
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
}

// ==========================================
// PAGE: Orders (Screenshot 06 Specification)
// ==========================================
function renderOrders(container) {
  const orders = store.state.orders;
  const statusFilter = window._orderStatusFilter || 'All';
  const filtered = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter || o.paymentStatus === statusFilter);

  container.innerHTML = `
    <div class="page-header" style="margin-bottom:16px">
      <h2 class="page-title">Orders</h2>
    </div>
    <div class="data-table-container">
      <div class="data-table-header" style="padding:16px 20px">
        <div class="pill-search-wrap">
          ${icon('search', 15)}
          <input type="text" class="pill-search-input" placeholder="Search orders..." id="orderSearchInput">
        </div>
        <div class="data-table-actions">
          <select class="form-select" style="width:auto;height:38px;font-size:13px;border-radius:8px;border-color:var(--dd-border-strong)" id="orderStatusFilter">
            <option ${statusFilter==='All'?'selected':''}>All statuses</option>
            <option ${statusFilter==='Pending'?'selected':''}>Pending</option>
            <option ${statusFilter==='Preparing'?'selected':''}>Preparing</option>
            <option ${statusFilter==='Ready'?'selected':''}>Ready</option>
            <option ${statusFilter==='Completed'?'selected':''}>Completed</option>
            <option ${statusFilter==='Unpaid'?'selected':''}>Unpaid</option>
            <option ${statusFilter==='Paid'?'selected':''}>Paid</option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>CUSTOMER</th>
            <th>TYPE</th>
            <th>ITEMS</th>
            <th>AMOUNT</th>
            <th>PAYMENT</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `<tr><td colspan="9">${renderEmptyState({ iconName: 'clipboardList', title: 'No orders found', description: 'No orders match your active filter criteria.', actionText: 'Create Order', actionNav: 'pos' })}</td></tr>` : ''}
          ${filtered.map(o => {
            const customer = o.customerId ? store.state.customers.find(c => c.id === o.customerId) : null;
            const payClass = o.paymentStatus === 'Paid' ? 'badge-order-paid' : 'badge-order-unpaid';
            const statClass = o.status === 'Preparing' ? 'badge-order-preparing' : o.status === 'Pending' ? 'badge-order-pending' : o.status === 'Ready' ? 'badge-order-ready' : 'badge-order-completed';

            return `<tr>
              <td style="font-weight:700;color:var(--dd-text)">${o.id}</td>
              <td style="color:var(--dd-text-secondary);font-weight:500">${customer ? escapeHtml(customer.name) : 'Walk-in'}</td>
              <td><span class="badge badge-channel">${o.orderType}</span></td>
              <td style="color:var(--dd-text-secondary)">${o.itemCount || (o.items ? o.items.reduce((s,i)=>s+i.quantity,0) : 1)}</td>
              <td style="font-weight:700;font-family:var(--dd-font-mono);color:var(--dd-text)">${formatINR(o.total)}</td>
              <td><span class="badge ${payClass}">${o.paymentStatus.toUpperCase()}</span></td>
              <td><span class="badge ${statClass}">${o.status.toUpperCase()}</span></td>
              <td style="font-size:12.5px;color:var(--dd-text-muted)">${formatTime(o.createdAt)}</td>
              <td style="text-align:right">
                ${o.paymentStatus === 'Unpaid' ? `<a href="#billing" onclick="store.state.currentBillingOrder=store.state.orders.find(o=>o.id==='${o.id}');navigate('billing');return false;" style="color:var(--dd-primary);font-weight:600;font-size:13px;text-decoration:none">Bill</a>` : ''}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="data-table-footer" style="padding:12px 20px;font-size:12px;color:var(--dd-text-muted)">
        <span>Showing ${filtered.length} of ${orders.length} orders</span>
      </div>
    </div>
  `;

  document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
    window._orderStatusFilter = e.target.value === 'All statuses' ? 'All' : e.target.value;
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
// PAGE: Menu Management (Screenshot 08 Specification)
// ==========================================
function renderMenu(container) {
  const items = store.state.menuItems;
  const catFilter = window._menuCatFilter || 'all';
  const filtered = catFilter === 'all' ? items : items.filter(i => i.category === catFilter);

  container.innerHTML = `
    <div class="menu-page" style="display:flex;flex-direction:column;gap:16px;width:100%;min-width:0">
      <!-- Page Header -->
      <div class="page-header" style="margin-bottom:0">
        <div class="page-header-content">
          <h2 class="page-title">Menu Management</h2>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="addMenuItemBtn" style="border-radius:var(--radius-full);padding:0 18px;height:38px">
            ${icon('plus', 14)} Add Item
          </button>
        </div>
      </div>

      <!-- Category Outline Pills Bar -->
      <div class="category-pills-bar">
        <button class="category-pill-btn ${catFilter === 'all' ? 'active' : ''}" data-menu-cat="all">
          <span>🍽️</span> All Items
        </button>
        ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
          <button class="category-pill-btn ${catFilter === c.id ? 'active' : ''}" data-menu-cat="${c.id}">
            <span>${c.emoji}</span> ${c.name}
          </button>
        `).join('')}
      </div>

      <!-- Main Data Table Container -->
      <div class="data-table-container">
        <div class="data-table-header" style="padding:16px 20px">
          <div class="pill-search-wrap">
            ${icon('search', 15)}
            <input type="text" class="pill-search-input" placeholder="Search menu items..." id="menuSearchInput">
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>PREP TIME</th>
              <th>AVAILABLE</th>
              <th style="text-align:right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(i => `
              <tr data-menu-id="${i.id}">
                <td>
                  <div style="display:flex;align-items:center;gap:12px">
                    <img src="${i.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}" alt="${escapeHtml(i.name)}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;border:1px solid var(--dd-border)">
                    <span style="font-weight:600;color:var(--dd-text);font-size:13.5px">${escapeHtml(i.name)}</span>
                  </div>
                </td>
                <td><span class="badge badge-channel" style="text-transform:capitalize">${i.category}</span></td>
                <td style="font-weight:700;font-family:var(--dd-font-mono);color:var(--dd-text)">${formatINR(i.price)}</td>
                <td style="color:var(--dd-text-secondary);font-size:13px">${i.prepTime || 15} min</td>
                <td>
                  <label class="toggle-switch">
                    <input type="checkbox" class="menu-available-toggle" data-item-id="${i.id}" ${i.available !== false ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                  </label>
                </td>
                <td style="text-align:right">
                  <button class="btn btn-ghost btn-icon btn-sm" onclick="showMenuItemForm(store.state.menuItems.find(x=>x.id==='${i.id}'))" title="Edit Item" style="color:var(--dd-text-muted)">${icon('edit', 14)}</button>
                  <button class="btn btn-ghost btn-icon btn-sm" onclick="store.deleteMenuItem('${i.id}');renderMenu(document.getElementById('pageContent'));showToast('Item deleted','info')" title="Delete Item" style="color:#DC2626">${icon('trash', 14)}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Bind category clicks
  document.querySelectorAll('[data-menu-cat]').forEach(el => {
    el.addEventListener('click', () => {
      window._menuCatFilter = el.dataset.menuCat;
      renderMenu(container);
    });
  });

  // Toggle availability
  document.querySelectorAll('.menu-available-toggle').forEach(el => {
    el.addEventListener('change', (e) => {
      const id = e.target.dataset.itemId;
      store.toggleMenuItemAvailability(id);
      showToast('Menu item availability updated', 'info');
    });
  });

  document.getElementById('addMenuItemBtn')?.addEventListener('click', () => showMenuItemForm());

  document.getElementById('menuSearchInput')?.addEventListener('input', debounce((e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 200));
}

// ==========================================
// PAGE: Customers (Screenshot 09 Specification)
// ==========================================
function renderCustomers(container) {
  const customers = store.state.customers;

  container.innerHTML = `
    <div class="page-header" style="margin-bottom:16px">
      <h2 class="page-title">Customers</h2>
      <button class="btn btn-primary" id="addCustomerBtn" style="border-radius:var(--radius-full);padding:0 18px;height:38px">
        ${icon('plus', 14)} Add Customer
      </button>
    </div>
    <div class="data-table-container">
      <div class="data-table-header" style="padding:16px 20px">
        <div class="pill-search-wrap">
          ${icon('search', 15)}
          <input type="text" class="pill-search-input" placeholder="Search customers..." id="custSearchInput">
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>PHONE</th>
            <th>ORDERS</th>
            <th>TOTAL SPEND</th>
            <th>LOYALTY</th>
            <th>LAST VISIT</th>
            <th>PREFERRED</th>
          </tr>
        </thead>
        <tbody>
          ${customers.map(c => `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:12px">
                  <div class="avatar-circle-init">${getInitials(c.name)}</div>
                  <span style="font-weight:700;color:var(--dd-text);font-size:13.5px">${escapeHtml(c.name)}</span>
                </div>
              </td>
              <td style="color:var(--dd-text-secondary);font-size:13px">${c.phone}</td>
              <td style="color:var(--dd-text-secondary);font-size:13px">${c.orderCount}</td>
              <td style="font-weight:700;font-family:var(--dd-font-mono);color:var(--dd-text)">${formatINR(c.totalSpend)}</td>
              <td><span class="badge badge-loyalty">${c.loyaltyPoints} pts</span></td>
              <td style="font-size:12.5px;color:var(--dd-text-secondary)">${formatDate(c.lastVisit)}</td>
              <td><span class="badge badge-channel">${c.preferredOrderType}</span></td>
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
// PAGE: Reports & Analytics
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
        data: { labels: hourlyRevenueData.labels, datasets: [{ label: 'Revenue', data: hourlyRevenueData.values, backgroundColor: '#4F46E5', borderRadius: 4, barThickness: 24 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => formatINRShort(v) } }, x: { grid: { display: false } } } }
      });
    }
    const pmCtx = document.getElementById('paymentMethodChart')?.getContext('2d');
    if (pmCtx) {
      chartInstances.payment = new Chart(pmCtx, {
        type: 'doughnut',
        data: { labels: ['Cash', 'Card', 'UPI'], datasets: [{ data: [35, 28, 37], backgroundColor: ['#10B981', '#4F46E5', '#F59E0B'], borderWidth: 0 }] },
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
// PAGE: Inventory (Screenshot 10 Specification)
// ==========================================
function renderInventory(container) {
  const items = store.state.inventory;
  const lowCount = items.filter(i => i.status === 'Low Stock').length;
  const outCount = items.filter(i => i.status === 'Out of Stock').length;

  container.innerHTML = `
    <div class="page-header" style="margin-bottom:16px">
      <h2 class="page-title">Inventory</h2>
      <button class="btn btn-primary" id="addInventoryBtn" style="border-radius:var(--radius-full);padding:0 18px;height:38px">
        ${icon('plus', 14)} Add Item
      </button>
    </div>
    <div class="data-table-container">
      <div class="data-table-header" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between">
        <div class="pill-search-wrap">
          ${icon('search', 15)}
          <input type="text" class="pill-search-input" placeholder="Search inventory..." id="invSearchInput">
        </div>
        <div class="data-table-actions" style="display:flex;gap:8px">
          <span class="badge-stock-low">● Low Stock: ${lowCount}</span>
          <span class="badge-stock-out">● Out of Stock: ${outCount}</span>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>CATEGORY</th>
            <th>STOCK UNIT</th>
            <th>REORDER LEVEL SUPPLIER</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td style="font-weight:700;color:var(--dd-text);font-size:13.5px">${escapeHtml(i.name)}</td>
              <td><span class="badge badge-channel">${i.category}</span></td>
              <td><strong style="font-size:14px;color:var(--dd-text)">${i.currentStock}</strong><span style="font-size:12px;color:var(--dd-text-secondary)">${i.unit}</span></td>
              <td style="color:var(--dd-text-secondary);font-size:13px">${i.reorderLevel}${i.supplier}</td>
              <td>
                <span class="badge ${i.status==='In Stock' ? 'badge-order-paid' : i.status==='Low Stock' ? 'badge-stock-low' : 'badge-stock-out'}" style="font-weight:600;font-size:11px">
                  ${i.status}
                </span>
              </td>
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
// PAGE: Settings (Figma Node 21:14281)
// ==========================================
function renderSettings(container) {
  const s = store.state.settings;

  container.innerHTML = `
    <!-- Page Header & Breadcrumbs -->
    <div class="page-header" style="margin-bottom:var(--dd-space-5)">
      <div class="page-header-content">
        <div class="breadcrumb" style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dd-text-muted);margin-bottom:4px">
          <span>Settings</span>
          <span>/</span>
          <span style="color:var(--dd-primary);font-weight:600">Restaurant Info</span>
        </div>
        <h2 class="page-title" style="font-size:24px;font-weight:700;letter-spacing:-0.4px">Settings</h2>
      </div>
    </div>

    <!-- 2-Column Settings Layout (Figma Node 21:14281) -->
    <div class="settings-layout">
      <!-- Left: Settings Sub-Navigation Column -->
      <div class="settings-nav">
        <div class="settings-nav-header">
          <span>PREFERENCES</span>
        </div>
        <div class="settings-nav-list">
          <button class="settings-nav-item active" data-settings-tab="restaurant-info">
            <span class="settings-nav-icon">${icon('store', 16)}</span>
            <span class="settings-nav-label">Restaurant Info</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="tax-billing">
            <span class="settings-nav-icon">${icon('receipt', 16)}</span>
            <span class="settings-nav-label">Tax & Billing</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="payment-methods">
            <span class="settings-nav-icon">${icon('creditCard', 16)}</span>
            <span class="settings-nav-label">Payment Methods</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="tables">
            <span class="settings-nav-icon">${icon('grid', 16)}</span>
            <span class="settings-nav-label">Tables</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="kitchen">
            <span class="settings-nav-icon">${icon('chefHat', 16)}</span>
            <span class="settings-nav-label">Kitchen</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="notifications">
            <span class="settings-nav-icon">${icon('bell', 16)}</span>
            <span class="settings-nav-label">Notifications</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="staff-roles">
            <span class="settings-nav-icon">${icon('users', 16)}</span>
            <span class="settings-nav-label">Staff & Roles</span>
          </button>
          <button class="settings-nav-item" data-settings-tab="profile">
            <span class="settings-nav-icon">${icon('user', 16)}</span>
            <span class="settings-nav-label">Profile</span>
          </button>
        </div>
      </div>

      <!-- Right: Main Card Content -->
      <div class="settings-content-card">
        <div class="settings-card-header">
          <div>
            <h3 class="settings-card-title">Restaurant Information</h3>
            <p class="settings-card-subtitle">Manage your restaurant brand identity, contact information, GST registration, and currency settings.</p>
          </div>
        </div>

        <div class="settings-card-divider"></div>

        <form id="restaurantSettingsForm" class="settings-form">
          <div class="form-grid-2col">
            <div class="form-group">
              <label class="form-label" for="settingRestName">Restaurant Name</label>
              <input class="form-input" id="settingRestName" name="restaurantName" value="${escapeHtml(s.restaurantName)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="settingPhone">Phone Number</label>
              <input class="form-input" id="settingPhone" name="phone" value="${escapeHtml(s.phone)}" required>
            </div>
          </div>

          <div class="form-grid-2col">
            <div class="form-group">
              <label class="form-label" for="settingEmail">Email Address</label>
              <input class="form-input" type="email" id="settingEmail" name="email" value="${escapeHtml(s.email)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="settingGst">GST Number / Tax ID</label>
              <input class="form-input" id="settingGst" name="gstNumber" value="${escapeHtml(s.gstNumber)}" placeholder="e.g. 29AABCD1234E1Z5">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="settingAddress">Physical Address</label>
            <textarea class="form-textarea" id="settingAddress" name="address" rows="2">${escapeHtml(s.address)}</textarea>
          </div>

          <div class="form-grid-2col">
            <div class="form-group">
              <label class="form-label" for="settingTaxRate">Default Tax Rate (%)</label>
              <div class="input-with-suffix">
                <input class="form-input" type="number" id="settingTaxRate" name="taxRate" value="${s.taxRate * 100}" step="0.5" min="0" max="30">
                <span class="input-suffix">%</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="settingCurrency">Primary Currency</label>
              <select class="form-select" id="settingCurrency" name="currency">
                <option value="INR" ${s.currency==='INR'?'selected':''}>INR (₹) — Indian Rupee</option>
                <option value="USD" ${s.currency==='USD'?'selected':''}>USD ($) — US Dollar</option>
                <option value="EUR" ${s.currency==='EUR'?'selected':''}>EUR (€) — Euro</option>
                <option value="GBP" ${s.currency==='GBP'?'selected':''}>GBP (£) — British Pound</option>
              </select>
            </div>
          </div>

          <div class="settings-form-actions">
            <button type="submit" class="btn btn-primary" id="saveSettingsBtn">
              ${icon('save', 16)} Save Changes
            </button>
            <button type="button" class="btn btn-secondary" id="cancelSettingsBtn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Settings sub-navigation click handling
  document.querySelectorAll('.settings-nav-item').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      const tabName = el.querySelector('.settings-nav-label')?.textContent || 'Restaurant Info';
      const breadcrumbCurrent = document.querySelector('.breadcrumb span:last-child');
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = tabName;
      showToast(`Switched to ${tabName} settings`, 'info');
    });
  });

  // Settings form submission
  document.getElementById('restaurantSettingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      restaurantName: formData.get('restaurantName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      gstNumber: formData.get('gstNumber'),
      address: formData.get('address'),
      taxRate: (parseFloat(formData.get('taxRate')) || 5) / 100,
      currency: formData.get('currency')
    };

    store.updateSettings(updates);
    showToast('Restaurant settings updated successfully!', 'success');
  });

  // Cancel button
  document.getElementById('cancelSettingsBtn')?.addEventListener('click', () => {
    renderSettings(container);
    showToast('Settings changes reverted', 'info');
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

// ==========================================
// Global Slide Drawer & Empty State Helpers
// ==========================================
function showDrawer(title, bodyContent, footerContent = '') {
  closeDrawer();
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'globalDrawerOverlay';

  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.id = 'globalDrawer';

  drawer.innerHTML = `
    <div class="drawer-header">
      <h3 class="drawer-title">${title}</h3>
      <button class="drawer-close" id="drawerCloseBtn" aria-label="Close drawer">${icon('x', 18)}</button>
    </div>
    <div class="drawer-body">${bodyContent}</div>
    ${footerContent ? `<div class="drawer-footer">${footerContent}</div>` : ''}
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  requestAnimationFrame(() => {
    overlay.classList.add('active');
    drawer.classList.add('active');
  });

  overlay.addEventListener('click', closeDrawer);
  drawer.querySelector('#drawerCloseBtn')?.addEventListener('click', closeDrawer);
}

function closeDrawer() {
  const overlay = document.getElementById('globalDrawerOverlay');
  const drawer = document.getElementById('globalDrawer');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 250);
  }
  if (drawer) {
    drawer.classList.remove('active');
    setTimeout(() => drawer.remove(), 250);
  }
}

function renderEmptyState(options = {}) {
  const {
    iconName = 'package',
    title = 'No items found',
    description = 'There are no items to display right now.',
    actionText = '',
    actionNav = '',
    actionId = '',
    glass = true
  } = options;

  return `
    <div class="empty-state ${glass ? 'glass' : ''}">
      <div class="empty-state-icon">${icon(iconName, 24)}</div>
      <h3 class="empty-state-title">${escapeHtml(title)}</h3>
      <div class="empty-state-text">${escapeHtml(description)}</div>
      ${actionText ? `
        <div class="empty-state-action">
          <button class="btn btn-primary btn-sm" ${actionId ? `id="${actionId}"` : ''} ${actionNav ? `onclick="navigate('${actionNav}')"` : ''}>
            ${icon('plus', 14)} ${escapeHtml(actionText)}
          </button>
        </div>
      ` : ''}
    </div>
  `;
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
    <div class="card" style="padding:var(--space-8)">
      ${renderEmptyState({
        iconName: 'banknote',
        title: 'Expense Management Module',
        description: 'Vendor expense tracking, recurring cost allocations, and automated GST ledger integration will be accessible here.',
        actionText: 'Back to Dashboard',
        actionNav: 'dashboard',
        glass: true
      })}
    </div>
  `;
}

// ==========================================
// Make functions global for onclick handlers
// ==========================================
window.navigate = navigate;
window.store = store;
window.closeModal = closeModal;
window.showModal = showModal;
window.showToast = showToast;
window.formatINR = formatINR;
window.showDrawer = showDrawer;
window.closeDrawer = closeDrawer;
window.openTableDrawer = openTableDrawer;
window.showTableDetail = showTableDetail;
window.renderTables = renderTables;
window.renderDashboard = renderDashboard;
window.renderKitchen = renderKitchen;
window.renderPOS = renderPOS;
window.renderOrders = renderOrders;

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
