import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Library, FlaskConical, Phone, LayoutDashboard } from 'lucide-react';
import logo from '../../assets/quran_o_itrat_logo.png';

const NAV = [
  { name: 'Courses',         href: '/courses' },
  { name: 'Library',         href: '/library' },
  { name: 'Study Materials', href: '/study-materials' },
  { name: 'Contact',         href: '/contact' },
];

export default function Header() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setOpen(false); }, [location]);

  const active = (href) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      {/* Gold-green top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(to right, var(--forest), var(--jade), var(--gold), var(--jade), var(--forest))', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51 }} />

      <header style={{
        position: 'fixed', top: 3, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(255,254,249,0.97)' : 'rgba(255,254,249,0.93)',
        backdropFilter: 'blur(16px)',
        boxShadow: scrolled ? '0 4px 28px rgba(10,61,46,0.09)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(10,61,46,0.10)' : 'transparent'}`,
        transition: 'background .3s, box-shadow .3s, border-color .3s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 68, gap: '1.5rem' }}>

            {/* ── Logo + full name ── */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
              <img src={logo} alt="Quran O Itrat Academy" style={{ height: 42, width: 'auto' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest)', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
                  Quran O Itrat Academy
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--stone)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                  Islamic Education
                </div>
              </div>
            </Link>

            {/* ── Pill nav ── */}
            <nav className="hidden md:flex" style={{ alignItems: 'center', background: 'rgba(10,61,46,0.04)', borderRadius: 100, padding: '4px', gap: 2, border: '1px solid rgba(10,61,46,0.07)', marginLeft: 'auto' }}>
              {[{ name: 'Home', href: '/' }, ...NAV].map(({ name, href }) => {
                const isActive = active(href);
                return (
                  <Link key={href} to={href} style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.8375rem', fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'white' : 'var(--charcoal)', textDecoration: 'none',
                    padding: '0.4rem 0.9rem', borderRadius: 100, whiteSpace: 'nowrap',
                    background: isActive ? 'var(--jade)' : 'transparent',
                    transition: 'all .2s',
                  }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(10,61,46,0.06)'; e.currentTarget.style.color = 'var(--jade)'; }}}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--charcoal)'; }}}
                  >{name}</Link>
                );
              })}
            </nav>

            {/* ── CTAs ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
              <Link to="/admin/login" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--stone)', textDecoration: 'none', padding: '0.42rem 0.9rem', borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.15)', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--jade)'; e.currentTarget.style.borderColor='var(--jade)'; e.currentTarget.style.background='rgba(20,122,84,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--stone)'; e.currentTarget.style.borderColor='rgba(10,61,46,0.15)'; e.currentTarget.style.background='transparent'; }}
              >
                <LayoutDashboard size={13} /> Admin
              </Link>
              <Link to="/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)', fontSize: '0.8375rem', fontWeight: 600, color: 'white', background: 'var(--jade)', textDecoration: 'none', padding: '0.48rem 1.1rem', borderRadius: 100, boxShadow: '0 2px 12px rgba(20,122,84,0.22)', transition: 'all .25s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--emerald)'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 5px 18px rgba(20,122,84,.32)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='var(--jade)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(20,122,84,.22)'; }}
              >
                Enroll Now
              </Link>
            </div>

            {/* ── Mobile burger ── */}
            <button className="md:hidden" onClick={() => setOpen(o => !o)} style={{ marginLeft: 'auto', background: 'none', border: '1.5px solid rgba(10,61,46,0.15)', borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--charcoal)', flexShrink: 0 }}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className="md:hidden" style={{ overflow: 'hidden', maxHeight: open ? 480 : 0, opacity: open ? 1 : 0, transition: 'max-height .35s ease, opacity .3s ease' }}>
          <div style={{ borderTop: '1px solid rgba(10,61,46,0.08)', padding: '0.75rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', background: 'rgba(255,254,249,0.98)' }}>
            {[{ name: 'Home', href: '/' }, ...NAV].map(({ name, href }) => {
              const isActive = active(href);
              return (
                <Link key={href} to={href} style={{ fontFamily: 'var(--font-body)', fontWeight: isActive ? 600 : 400, fontSize: '0.9375rem', color: isActive ? 'var(--jade)' : 'var(--charcoal)', textDecoration: 'none', padding: '0.65rem 0.875rem', borderRadius: 10, background: isActive ? 'rgba(20,122,84,0.07)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {name}
                  {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'block' }} />}
                </Link>
              );
            })}
            <div style={{ borderTop: '1px solid rgba(10,61,46,0.08)', marginTop: '0.5rem', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <Link to="/admin/login" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.18)', color: 'var(--stone)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', textDecoration: 'none' }}>Admin</Link>
              <Link to="/courses" style={{ flex: 2, textAlign: 'center', padding: '0.6rem', borderRadius: 100, background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Enroll Now</Link>
            </div>
          </div>
        </div>
      </header>

      <div style={{ height: 71 }} />
    </>
  );
}
