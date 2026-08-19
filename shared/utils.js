/* ---------------- Small utilities shared by every page ---------------- */

function escapeHtml(str){
  return (str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function defaultAvatar(name){
  const initial = (name||'A').charAt(0).toUpperCase();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initial)}&backgroundColor=4F46E5&textColor=ffffff`;
}

function chatIdFor(uidA, uidB){ return [uidA, uidB].sort().join('_'); }

/* ---- SVG icons (Lucide line style) ---- */
const ICONS = {
  home:     `<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  search:   `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  requests: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  chat:     `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  profile:  `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  more:     `<svg viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>`,
  logout:   `<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
};

/* ---------------- Auth guard ---------------- */
async function requireAuth(){
  const { data: { session } } = await sb.auth.getSession();
  if(!session || !session.user){
    window.location.href = 'login.html';
    return null;
  }
  const user = session.user;
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return { user, profile };
}

/* ---------------- Sidebar ----------------
   Icon-only sidebar. Brand icon top, nav items centered, "More" at bottom.
   activePage: home | friends | requests | chat | profile */
function renderSidebar(activePage, user, profile){
  const mount = document.getElementById('sidebarMount');
  if(!mount) return;

  const navItems = [
    { page: 'home',     href: 'home.html',     icon: 'home',     label: 'Feed' },
    { page: 'friends',  href: 'friends.html',  icon: 'search',   label: 'Search',   dotId: '' },
    { page: 'requests', href: 'requests.html', icon: 'requests', label: 'Requests', dotId: 'reqDot' },
    { page: 'chat',     href: 'chat.html',     icon: 'chat',     label: 'Messages', dotId: 'chatDot' },
    { page: 'profile',  href: 'profile.html',  icon: 'profile',  label: 'Profile' },
  ];

  const navHtml = navItems.map(item => `
    <a class="nav-item ${item.page === activePage ? 'active' : ''}"
       href="${item.href}"
       data-label="${item.label}"
       title="${item.label}">
      ${ICONS[item.icon]}
      ${item.dotId ? `<span class="nav-dot" id="${item.dotId}" style="display:none;"></span>` : ''}
    </a>`).join('');

  mount.innerHTML = `
    <div class="sidebar">

      <!-- Brand icon — top left only -->
      <div class="sidebar-brand">
        <span class="brand-icon" title="AhirConnect">AC</span>
      </div>

      <!-- Nav items — pushed to vertical center -->
      <nav class="sidebar-nav">
        ${navHtml}
      </nav>

      <!-- More button — links to more.html -->
      <div class="sidebar-footer">
        <a class="nav-item ${activePage === 'more' ? 'active' : ''}"
           href="more.html"
           data-label="More"
           title="More">
          ${ICONS.more}
        </a>
      </div>

    </div>`;

  /* Live badges */
  refreshRequestDot(user.id);
  refreshChatDot(user.id);
}

/* Red dot — pending friend requests */
async function refreshRequestBadge(userId){ refreshRequestDot(userId); } // backward compat

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

/* Red dot — unread messages (newer than last chat visit) */
async function refreshChatDot(userId){
  const dot = document.getElementById('chatDot');
  if(!dot) return;

  // Store last visit timestamp in localStorage per user
  const key = `lastChatVisit_${userId}`;
  const lastVisit = localStorage.getItem(key) || new Date(0).toISOString();

  const { count } = await sb
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .gt('created_at', lastVisit);

  dot.style.display = (count && count > 0) ? 'block' : 'none';
}

/* Call this on the chat page load to clear the dot */
function markChatSeen(userId){
  localStorage.setItem(`lastChatVisit_${userId}`, new Date().toISOString());
  const dot = document.getElementById('chatDot');
  if(dot) dot.style.display = 'none';
}
