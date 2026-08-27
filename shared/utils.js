/* ---------------- Small utilities shared by every page ---------------- */

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function defaultAvatar(name) {
    const initial = (name || 'A').charAt(0).toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initial)}&backgroundColor=0B2545&textColor=D4AF37`;
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

/* ---- SVG icons (Community style) ---- */
const ICONS = {
    home: `<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    homeFill: `<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill="currentColor"/><rect x="9" y="12" width="6" height="10" fill="white"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    directory: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    directoryFill: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="currentColor"/><circle cx="9" cy="7" r="4" fill="currentColor"/></svg>`,
    dayro: `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    dayroFill: `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2"/></svg>`,
    messages: `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartFill: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/></svg>`,
    create: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    profile: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    more: `<svg viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>`,
    settings: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
    comment: `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    share: `<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    logout: `<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    grid: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    feather: `<svg viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`
};

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
   Community Portal Nav: logo + icons + label nav items.
   activePage: home | search | dayro | messages | notifications | profile | more */
function renderSidebar(activePage, user, profile) {
    const mount = document.getElementById('sidebarMount');
    if (!mount) return;

    const navItems = [
        { page: 'home', href: 'home.html', icon: 'home', label: typeof t === 'function' ? t('navFeed') : 'Feed' },
        { page: 'search', href: 'friends.html', icon: 'directory', label: typeof t === 'function' ? t('navDirectory') : 'Directory' },
        { page: 'dayro', href: 'dayro.html', icon: 'dayro', label: typeof t === 'function' ? t('navDayro') : 'Culture & Dayro' },
        { page: 'messages', href: 'chat.html', icon: 'messages', label: typeof t === 'function' ? t('navMessages') : 'Messages', dotId: 'chatDot' },
        { page: 'notifications', href: 'requests.html', icon: 'heart', label: typeof t === 'function' ? t('navNotifications') : 'Notifications', dotId: 'reqDot' },
        { page: 'profile', href: 'profile.html', icon: 'profile', label: typeof t === 'function' ? t('navProfile') : 'Profile' },
    ];

    const navHtml = navItems.map(item => {
                const isActive = item.page === activePage;
                return `
    <a class="nav-item ${isActive ? 'active' : ''} ${item.page === 'profile' ? 'nav-profile' : ''}" href="${item.href}">
      ${isActive && ICONS[item.icon + 'Fill'] ? ICONS[item.icon + 'Fill'] : (ICONS[item.icon] || ICONS.home)}
      <span class="nav-label">${item.label}</span>
      ${item.dotId ? `<span class="nav-dot" id="${item.dotId}" style="display:none;"></span>` : ''}
    </a>`;
    }).join('');

    const spiritualGreeting = typeof t === 'function' ? t('spiritualGreeting') : 'Jai Muralidhar';

    mount.innerHTML = `
    <div class="sidebar">

      <!-- Brand -->
      <div class="sidebar-brand">
        <a href="home.html" class="brand-text">
          <span style="color:var(--text);">Ahir</span><span style="color:var(--accent);"> Connect</span>
        </a>
        <div class="brand-subtext">Connecting the Ahir Samaj</div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        ${navHtml}

        <!-- Create post button -->
        <button class="nav-item" id="createPostBtn">
          ${ICONS.create}
          <span class="nav-label">${typeof t === 'function' ? t('newPost') : 'New Post'}</span>
        </button>
                <button class="nav-item mobile-more-item ${activePage === 'more' || activePage === 'profile' ? 'active' : ''}" id="mobileMoreBtn" type="button" aria-expanded="false">
                    ${ICONS.more}
                    <span class="nav-label">More</span>
                </button>
      </nav>

      <!-- Footer: More -->
      <div class="sidebar-footer">
        <a class="nav-item ${activePage === 'more' ? 'active' : ''}" href="more.html">
          ${ICONS.more}
          <span class="nav-label">${typeof t === 'function' ? t('navSettings') : 'Settings'}</span>
        </a>
      </div>

        </div>
        <div class="mobile-more-backdrop" id="mobileMoreBackdrop" hidden>
            <section class="mobile-more-sheet" role="dialog" aria-modal="true" aria-labelledby="mobileMoreTitle">
                <div class="mobile-more-handle"></div>
                <div class="mobile-more-header"><strong id="mobileMoreTitle">More</strong><button type="button" class="mobile-more-close" id="mobileMoreClose" aria-label="Close menu">×</button></div>
                <nav class="mobile-more-links">
                    <button type="button" id="mobileCreatePostBtn">${ICONS.create}<span>New Post</span></button>
                    <a href="profile.html">${ICONS.profile}<span>Profile</span></a>
                    <a href="more.html">${ICONS.settings}<span>Settings</span></a>
                    <a href="about.html">${ICONS.more}<span>About AhirConnect</span></a>
                    <a href="contact.html">${ICONS.messages}<span>Contact Us</span></a>
                    <button type="button" id="mobileLogoutBtn">${ICONS.logout}<span>Log out</span></button>
                </nav>
            </section>
        </div>`;

    /* Create post modal trigger */
    document.getElementById('createPostBtn')?.addEventListener('click', () => {
        if (typeof openCreateModal === 'function') {
            openCreateModal();
        } else {
            window.location.href = 'home.html?create=1';
        }
    });

    const moreButton = document.getElementById('mobileMoreBtn');
    const moreBackdrop = document.getElementById('mobileMoreBackdrop');
    const closeMoreMenu = () => {
        if (!moreBackdrop) return;
        moreBackdrop.hidden = true;
        moreButton?.setAttribute('aria-expanded', 'false');
    };
    moreButton?.addEventListener('click', () => {
        moreBackdrop.hidden = false;
        moreButton.setAttribute('aria-expanded', 'true');
    });
    document.getElementById('mobileMoreClose')?.addEventListener('click', closeMoreMenu);
    moreBackdrop?.addEventListener('click', event => { if (event.target === moreBackdrop) closeMoreMenu(); });
    document.getElementById('mobileCreatePostBtn')?.addEventListener('click', () => {
        closeMoreMenu();
        if (typeof openCreateModal === 'function') openCreateModal();
        else window.location.href = 'home.html?create=1';
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMoreMenu(); });
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', async () => {
        await sb.auth.signOut();
        window.location.href = 'login.html';
    });

    /* Live notification dots */
    refreshRequestDot(user.id);
    refreshChatDot(user.id);
}

/* Red dot — pending friend requests */
async function refreshRequestDot(userId){
    const dot = document.getElementById('reqDot');
    if(!dot) return;
    const [requestsRes, notificationsRes] = await Promise.all([
        sb.from('friend_requests')
            .select('*', { count: 'exact', head: true })
            .eq('to_id', userId)
            .eq('status', 'pending'),
        sb.from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', userId)
    ]);
    const count = (requestsRes.count || 0) + (notificationsRes.count || 0);
    dot.style.display = count > 0 ? 'block' : 'none';
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