/* ---------------- Small utilities shared by every page ---------------- */

function escapeHtml(str){
  return (str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function defaultAvatar(name){
  const initial = (name||'A').charAt(0).toUpperCase();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initial)}&backgroundColor=E3A33B&textColor=1F2A52`;
}

function chatIdFor(uidA, uidB){ return [uidA, uidB].sort().join('_'); }

/* ---------------- Auth guard ----------------
   Call this at the top of every logged-in page (home, friends, requests, chat, profile).
   Redirects to login.html if there's no active session, otherwise returns
   { user, profile } for the page to use. */
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
   Injects the nav sidebar into <div id="sidebarMount"></div> on every logged-in page.
   activePage should be one of: home, friends, requests, chat, profile */
function renderSidebar(activePage, user, profile){
  const mount = document.getElementById('sidebarMount');
  if(!mount) return;

  const navItems = [
    { page: 'home',     href: 'home.html',     icon: '🏠', label: 'Feed' },
    { page: 'friends',  href: 'friends.html',  icon: '🔍', label: 'Find Friends' },
    { page: 'requests', href: 'requests.html', icon: '🤝', label: 'Requests', badgeId: 'reqBadge' },
    { page: 'chat',     href: 'chat.html',     icon: '💬', label: 'Chat' },
    { page: 'profile',  href: 'profile.html',  icon: '👤', label: 'Profile' },
  ];

  const navHtml = navItems.map(item => `
    <a class="nav-item ${item.page === activePage ? 'active' : ''}" href="${item.href}">
      ${item.icon} ${item.label}
      ${item.badgeId ? `<span class="nav-badge" id="${item.badgeId}" style="display:none;">0</span>` : ''}
    </a>`).join('');

  mount.innerHTML = `
    <div class="sidebar">
      <div class="brand-row"><span class="brand">Ahir<span>Connect</span></span></div>
      ${navHtml}
      <div class="sidebar-footer">
        <div class="mini-profile">
          <img class="avatar" src="${profile.avatar_url || defaultAvatar(profile.name)}">
          <div class="name">${escapeHtml(profile.name || 'Member')}</div>
        </div>
        <div class="logout-link" id="logoutBtn">Log out</div>
      </div>
    </div>`;

  document.getElementById('logoutBtn').onclick = async () => {
    await sb.auth.signOut();
    window.location.href = 'login.html';
  };

  // Keep the Requests badge live on every page, not just the requests page
  refreshRequestBadge(user.id);
}

async function refreshRequestBadge(userId){
  const badge = document.getElementById('reqBadge');
  if(!badge) return;
  const { count } = await sb
    .from('friend_requests')
    .select('*', { count: 'exact', head: true })
    .eq('to_id', userId)
    .eq('status', 'pending');
  if(count && count > 0){ badge.style.display = 'inline'; badge.textContent = count; }
  else { badge.style.display = 'none'; }
}
