// ==========================================
// DineDesk — GitHub Version History & Release Data
// ==========================================

export const REPOSITORY_INFO = {
  name: 'dinedesk-pos',
  fullName: 'dinedesk/dinedesk-pos',
  branch: 'main',
  defaultBranch: 'main',
  url: 'https://github.com/dinedesk/dinedesk-pos',
  totalCommits: 28,
  totalReleases: 3,
  totalContributors: 4,
  stars: 142,
  forks: 38,
  openIssues: 2,
  license: 'MIT',
  latestVersion: 'v1.2.0'
};

export const RELEASES_DATA = [
  {
    id: 'rel-1.2.0',
    version: 'v1.2.0',
    title: 'v1.2.0 — GitHub Version History & Advanced Analytics Engine',
    tagType: 'Latest',
    tagColor: 'success',
    isLatest: true,
    publishedAt: '2026-08-24T21:40:00Z',
    author: {
      name: 'Rakshith V',
      username: 'rakshith',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Lead Architect'
    },
    summary: 'Major release introducing an interactive GitHub-styled Version History dashboard, system changelog timelines, enhanced billing receipts, print template customization, and real-time sales reporting analytics.',
    highlights: [
      '🚀 Added interactive GitHub Version History & Release Timeline dashboard view',
      '⚡ Introduced real-time Sales & Revenue Analytics with Chart.js charts',
      '📄 Thermal Receipt printing preview & customized Tax/GST breakdown',
      '🛡️ Enhanced Staff RBAC authorization rules for Manager & Cashier roles',
      '🎨 Glassmorphic UI redesign with dynamic dark mode contrast improvements'
    ],
    changelog: {
      features: [
        'Added Version History timeline UI accessible directly from main sidebar',
        'Implemented Commit SHA inspector modal with full side-by-side diff previews',
        'Added quick search & tag filter for releases (Features, Fixes, Analytics, POS)',
        'Integrated live copy-to-clipboard for Git commit hashes'
      ],
      improvements: [
        'Optimized POS order item addition state updates under heavy load',
        'Refactored currency helper utilities for clean Indian Rupee (₹) formatting',
        'Improved responsiveness for mobile POS view & tablet cashier layouts'
      ],
      fixes: [
        'Fixed order status badge alignment on Kitchen KDS cards',
        'Resolved table reservation timer reset bug on quick table reassignment',
        'Fixed chart canvas destruction error on rapid tab switching'
      ]
    },
    commits: [
      {
        sha: '9f82d1c',
        fullSha: '9f82d1c7a4b8e210f934751d8b02e9a310aef512',
        message: 'feat(version-history): add GitHub-styled Version History UI & system release timeline',
        author: 'Rakshith V',
        username: 'rakshith',
        date: '2026-08-24 21:40',
        additions: 420,
        deletions: 18,
        filesChanged: [
          { name: 'js/app.js', additions: 240, deletions: 12, status: 'modified' },
          { name: 'css/versionHistory.css', additions: 150, deletions: 0, status: 'added' },
          { name: 'js/data/versionHistoryData.js', additions: 30, deletions: 6, status: 'added' }
        ],
        diffSummary: `diff --git a/js/app.js b/js/app.js
index a12e9b0..9f82d1c 100644
--- a/js/app.js
+++ b/js/app.js
@@ +74,6 -74,7 @@ const routes = {
+  versionHistory: { title: 'Version History & Releases', render: renderVersionHistory },
};`
      },
      {
        sha: '7c41e8f',
        fullSha: '7c41e8f8103a4b98765e1289df3104c9e88aa101',
        message: 'feat(analytics): integrate Chart.js sales trends & hourly revenue breakdown',
        author: 'Priya Sharma',
        username: 'priya-sharma',
        date: '2026-08-24 18:15',
        additions: 198,
        deletions: 24,
        filesChanged: [
          { name: 'js/app.js', additions: 120, deletions: 18, status: 'modified' },
          { name: 'js/data/mockData.js', additions: 78, deletions: 6, status: 'modified' }
        ],
        diffSummary: `+ const hourlyRevenueData = { labels: ['11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'], values: [12400, 31200, 18500, 24600, 52100, 41000] };`
      },
      {
        sha: '3b09a4d',
        fullSha: '3b09a4d5e902b187654c3210987fecba12345678',
        message: 'fix(kds): resolve live order timer update frequency and card state sync',
        author: 'Arjun Mehta',
        username: 'arjun-m',
        date: '2026-08-24 14:30',
        additions: 45,
        deletions: 31,
        filesChanged: [
          { name: 'js/app.js', additions: 45, deletions: 31, status: 'modified' }
        ],
        diffSummary: `- setInterval(updateTimer, 500);\n+ setInterval(updateTimer, 1000); // reduced DOM re-render overhead`
      }
    ]
  },
  {
    id: 'rel-1.1.0',
    version: 'v1.1.0',
    title: 'v1.1.0 — Table Management, KDS & Instant Billing Engine',
    tagType: 'Stable',
    tagColor: 'primary',
    isLatest: false,
    publishedAt: '2026-08-20T14:30:00Z',
    author: {
      name: 'Arjun Mehta',
      username: 'arjun-m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'Core Systems Developer'
    },
    summary: 'Introduced Interactive Table Layout Grid, real-time Kitchen Display System (KDS) order sync, splits & billing modal with UPI QR integration.',
    highlights: [
      '🍽️ Interactive Table Layout with status tracking (Available, Occupied, Billed, Reserved)',
      '🍳 Kitchen Display System (KDS) with Prep Time indicators & Audio alerts',
      '💳 Billing & Checkout supporting Cash, Card, UPI QR Code, and Split Payments',
      '📋 Order History tracking with search, status filters, and reprint receipt options'
    ],
    changelog: {
      features: [
        'Created interactive Table Floor Map with seat capacity and active bill timer',
        'Built Kitchen Display Screen (KDS) with Quick Status toggle (Preparing -> Ready -> Delivered)',
        'Added payment checkout with automated change calculation & tip inputs',
        'Implemented order notes, item customizations (e.g. Extra Cheese, Medium Spicy)'
      ],
      improvements: [
        'Enhanced state management persistence in localStorage',
        'Added fast keyboard shortcuts for POS cashier line items (F2, Esc, Enter)'
      ],
      fixes: [
        'Fixed GST 5% & 18% calculation rounding discrepancies on multi-item bills',
        'Resolved order item quantity increment bug on double clicks'
      ]
    },
    commits: [
      {
        sha: '5a21e03',
        fullSha: '5a21e03b2189cd76543210fe2198a76543210987',
        message: 'feat(tables): add floor grid map, seat layout, and occupancy state management',
        author: 'Arjun Mehta',
        username: 'arjun-m',
        date: '2026-08-20 12:00',
        additions: 310,
        deletions: 15,
        filesChanged: [
          { name: 'js/app.js', additions: 220, deletions: 10, status: 'modified' },
          { name: 'css/pages.css', additions: 90, deletions: 5, status: 'modified' }
        ],
        diffSummary: `+ function renderTables() { /* Interactive floor layout rendering */ }`
      },
      {
        sha: '1b89c4f',
        fullSha: '1b89c4f901827364551029384756102938475610',
        message: 'feat(billing): implement UPI QR payment modal, cash change calculator & print invoice',
        author: 'Priya Sharma',
        username: 'priya-sharma',
        date: '2026-08-19 16:45',
        additions: 275,
        deletions: 42,
        filesChanged: [
          { name: 'js/app.js', additions: 190, deletions: 32, status: 'modified' },
          { name: 'js/utils/orderCalc.js', additions: 85, deletions: 10, status: 'modified' }
        ],
        diffSummary: `+ export function calculateChange(total, paid) { return Math.max(0, paid - total); }`
      }
    ]
  },
  {
    id: 'rel-1.0.0',
    version: 'v1.0.0',
    title: 'v1.0.0 — Initial Release: Core POS & Restaurant Management Architecture',
    tagType: 'Release',
    tagColor: 'neutral',
    isLatest: false,
    publishedAt: '2026-08-15T10:00:00Z',
    author: {
      name: 'Rakshith V',
      username: 'rakshith',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Lead Architect'
    },
    summary: 'The initial foundation release of DineDesk POS — complete with reactive state store, menu inventory catalog, authentication login flow, and modular design system.',
    highlights: [
      '🏗️ Built core vanilla JavaScript SPA framework with zero framework bloat',
      '🍔 Categorized Menu Catalog (Starters, Main Course, Drinks, Desserts)',
      '🔐 Multi-role Authentication System (Admin, Manager, Cashier, Kitchen Staff)',
      '🎨 Custom Dark/Light theme variable system with high contrast palette'
    ],
    changelog: {
      features: [
        'Initialized SPA architecture with clean ES Module router & reactive state store',
        'Created initial database mocks for menu items, staff profiles, and active orders',
        'Implemented Toast notification system and Modal manager'
      ],
      improvements: [
        'Established responsive flexbox & CSS grid layout foundation'
      ],
      fixes: []
    },
    commits: [
      {
        sha: '13ed0da',
        fullSha: '13ed0da71c890123456789abcdef0123456789ab',
        message: 'Initial DineDesk POS prototype architecture & design system foundation',
        author: 'Rakshith V',
        username: 'rakshith',
        date: '2026-08-15 10:00',
        additions: 1890,
        deletions: 0,
        filesChanged: [
          { name: 'index.html', additions: 46, deletions: 0, status: 'added' },
          { name: 'js/app.js', additions: 1400, deletions: 0, status: 'added' },
          { name: 'css/variables.css', additions: 150, deletions: 0, status: 'added' },
          { name: 'css/layout.css', additions: 200, deletions: 0, status: 'added' }
        ],
        diffSummary: `+ <!DOCTYPE html>\n+ <html lang="en">\n+ <head>...`
      }
    ]
  }
];
