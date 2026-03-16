import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Library, FileText,
  Users, MessageSquare, GraduationCap, Menu, X,
  LogOut, User, Globe, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import logo from '../../assets/quran_o_itrat_logo.png';

const NAV = [
  { name: 'Dashboard',      href: '/admin/dashboard',       Icon: LayoutDashboard, desc: 'Overview & stats' },
  { name: 'Courses',        href: '/admin/courses',          Icon: BookOpen,        desc: 'Manage courses' },
  { name: 'Library',        href: '/admin/library',          Icon: Library,         desc: 'Digital resources' },
  { name: 'Study Materials',href: '/admin/study-materials',  Icon: FileText,        desc: 'Learning files' },
  { name: 'Articles',       href: '/admin/articles',         Icon: FileText,        desc: 'Blog & articles' },
  { name: 'Contact Forms',  href: '/admin/contacts',         Icon: MessageSquare,   desc: 'User enquiries' },
  { name: 'Admissions',     href: '/admin/admissions',       Icon: GraduationCap,   desc: 'Applications' },
];

const S = {
  sidebar: {
    position: 'fixed', inset: '0 auto 0 0', width: 256, zIndex: 50,
    background: 'var(--forest)',
    display: 'flex', flexDirection: 'column',
    transition: 'transform .3s cubic-bezier(.22,1,.36,1)',
  },
  navLink: (active) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.65rem 1rem', borderRadius: 10, textDecoration: 'none',
    fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: active ? 600 : 400,
    color: active ? 'var(--forest)' : 'rgba(255,255,255,0.65)',
    background: active ? 'white' : 'transparent',
    transition: 'all .2s',
    position: 'relative',
  }),
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const active = (href) => location.pathname === href;
  const currentPage = NAV.find(n => active(n.href));

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}>
          <img src={logo} alt="Logo" style={{ height: 38, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
              Quran O Itrat
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.875rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {NAV.map(({ name, href, Icon, desc }) => {
          const isActive = active(href);
          return (
            <Link key={href} to={href} onClick={() => setSidebarOpen(false)}
              style={S.navLink(isActive)}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: isActive ? 'rgba(20,122,84,0.15)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={isActive ? 'var(--jade)' : 'rgba(255,255,255,0.6)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ lineHeight: 1.2 }}>{name}</div>
                <div style={{ fontSize: '0.7rem', color: isActive ? 'var(--stone)' : 'rgba(255,255,255,0.35)', marginTop: 1 }}>{desc}</div>
              </div>
              {isActive && <div style={{ width: 3, height: 20, background: 'var(--gold)', borderRadius: 2, position: 'absolute', right: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '1rem 0.875rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.06)', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--jade),var(--mint))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={16} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Admin'}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{user?.role || 'Administrator'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/" target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)', fontSize: '0.775rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', padding: '0.5rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
          >
            <Globe size={12} /> Site
          </Link>
          <button onClick={handleLogout} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#ffaaaa', background: 'rgba(180,40,40,0.12)', border: '1px solid rgba(180,40,40,0.2)', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(180,40,40,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(180,40,40,0.12)'; }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex' }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:block" style={{ ...S.sidebar, position: 'fixed' }}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49, backdropFilter: 'blur(2px)' }} />
      )}

      {/* Mobile sidebar */}
      <div className="lg:hidden" style={{ ...S.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: 16, right: 14, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 1 }}>
          <X size={16} />
        </button>
        <SidebarContent />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="lg:ml-64">

        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid rgba(10,61,46,0.08)', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 12px rgba(10,61,46,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile menu toggle */}
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: '1.5px solid rgba(10,61,46,0.15)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--charcoal)' }}>
              <Menu size={16} />
            </button>

            {/* Breadcrumb */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.1rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Admin</span>
                <ChevronRight size={10} color="var(--mist)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--jade)', fontWeight: 500 }}>{currentPage?.name || 'Dashboard'}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--forest)', margin: 0 }}>
                {currentPage?.name || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: 100, background: 'rgba(20,122,84,0.07)', border: '1px solid rgba(20,122,84,0.15)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sage)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--jade)', fontWeight: 500 }}>Online</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--jade),var(--mint))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={14} color="white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.75rem 1.5rem', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>

      <style>{`
        .lg\\:block { display: none; }
        .lg\\:ml-64 { margin-left: 0; }
        .hidden { display: none !important; }
        @media(min-width:1024px) {
          .lg\\:block { display: block !important; }
          .lg\\:hidden { display: none !important; }
          .lg\\:ml-64 { margin-left: 256px !important; }
        }
      `}</style>
    </div>
  );
}
