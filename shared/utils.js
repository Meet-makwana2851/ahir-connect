/* ---------------- Small utilities shared by every page ---------------- */

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function defaultAvatar(name) {
    const initial = (name || 'A').charAt(0).toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initial)}&backgroundColor=4F46E5&textColor=ffffff`;
}

function chatIdFor(uidA, uidB) { return [uidA, uidB].sort().join('_'); }

/* Relative time helper */
function timeAgo(dateStr) {
    const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (s < 60) return 'now';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h';
    const d = Math.floor(h / 24);
    if (d < 7) return d + 'd';
    const w = Math.floor(d / 7);
    return w + 'w';
}

/* ---- SVG icons (Lucide / Instagram line style) ---- */
const ICONS = {
    home: `<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    homeFill: `<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill="currentColor"/><rect x="9" y="12" width="6" height="10" fill="white"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    messages: `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartFill: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/></svg>`,
    create: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    profile: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    more: `<svg viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>`,
    comment: `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    share: `<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    logout: `<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    grid: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
};

/* Heart SVG for double-tap animation */
const HEART_SVG = `<svg viewBox="0 0 24 24" width="80" height="80"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill="#fff"/></svg>`;

/* ---------------- Auth guard ---------------- */
async function requireAuth() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session || !session.user) {
        window.location.href = 'login.html';
        return null;
    }
    const user = session.user;
    const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
    return { user, profile };
}

/* ---------------- Sidebar ----------------
   Instagram-style: logo + icon + label nav items.
   activePage: home | search | messages | notifications | profile | more */
function renderSidebar(activePage, user, profile) {
    const mount = document.getElementById('sidebarMount');
    if (!mount) return;

    const navItems = [
        { page: 'home', href: 'home.html', icon: 'home', label: 'Home' },
        { page: 'search', href: 'friends.html', icon: 'search', label: 'Search' },
        { page: 'messages', href: 'chat.html', icon: 'messages', label: 'Messages', dotId: 'chatDot' },
        { page: 'notifications', href: 'requests.html', icon: 'heart', label: 'Notifications', dotId: 'reqDot' },
        { page: 'profile', href: 'profile.html', icon: 'profile', label: 'Profile' },
    ];

    const navHtml = navItems.map(item => {
                const isActive = item.page === activePage;
                return `
    <a class="nav-item ${isActive ? 'active' : ''}"
       href="${item.href}">
      ${isActive && ICONS[item.icon + 'Fill'] ? ICONS[item.icon + 'Fill'] : ICONS[item.icon]}
      <span class="nav-label">${item.label}</span>
      ${item.dotId ? `<span class="nav-dot" id="${item.dotId}" style="display:none;"></span>` : ''}
    </a>`;
  }).join('');

  mount.innerHTML = `
    <div class="sidebar">

      <!-- Brand -->
      <div class="sidebar-brand">
        <a href="home.html" class="brand-text">Ahir<span>Connect</span></a>
        <div class="brand-icon">AC</div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        ${navHtml}

        <!-- Create post button -->
        <button class="nav-item" id="createPostBtn">
          ${ICONS.create}
          <span class="nav-label">Create</span>
        </button>
      </nav>

      <!-- Footer: More -->
      <div class="sidebar-footer">
        <a class="nav-item ${activePage === 'more' ? 'active' : ''}" href="more.html">
          ${ICONS.more}
          <span class="nav-label">More</span>
        </a>
      </div>

    </div>`;

  /* Create post modal trigger */
  document.getElementById('createPostBtn')?.addEventListener('click', () => {
    if (typeof openCreateModal === 'function') {
      openCreateModal();
    } else {
      window.location.href = 'home.html?create=1';
    }
  });

  /* Live notification dots */
  refreshRequestDot(user.id);
  refreshChatDot(user.id);
}

/* Red dot — pending friend requests */
async function refreshRequestDot(userId){
  const dot = document.getElementById('reqDot');
  if(!dot) return;
  const { count } = await sb
    .from('friend_requests')
    .select('*', { count: 'exact', head: true })
    .eq('to_id', userId)
    .eq('status', 'pending');
  dot.style.display = (count && count > 0) ? 'block' : 'none';
}

/* Red dot — unread messages */
async function refreshChatDot(userId){
  const dot = document.getElementById('chatDot');
  if(!dot) return;
  const key = `lastChatVisit_${userId}`;
  const lastVisit = localStorage.getItem(key) || new Date(0).toISOString();
  const { count } = await sb
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .gt('created_at', lastVisit);
  dot.style.display = (count && count > 0) ? 'block' : 'none';
}

function markChatSeen(userId){
  localStorage.setItem(`lastChatVisit_${userId}`, new Date().toISOString());
  const dot = document.getElementById('chatDot');
  if(dot) dot.style.display = 'none';
}

/* backward compat */
async function refreshRequestBadge(userId){ refreshRequestDot(userId); }
