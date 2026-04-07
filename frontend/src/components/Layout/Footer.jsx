import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import logo from '../../assets/quran_o_itrat_logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Courses', href: '/courses' },
    { name: 'Library', href: '/library' },
    { name: 'Study Materials', href: '/study-materials' },
    { name: 'Contact', href: '/contact' },
  ];

  const courses = [
    { name: 'Quran Recitation', href: '/courses' },
    { name: 'Tajweed Course', href: '/courses' },
    { name: 'Islamic Studies', href: '/courses' },
    { name: 'Arabic Language', href: '/courses' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1CNyLo8tGY/' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/alquranoitratinstitute?igsh=aTdscG92bjc2bWMz' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer style={{ background: 'var(--forest)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Geometric pattern overlay */}
      <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
      
      {/* Gold accent top border */}
      <div style={{ height: 3, background: 'linear-gradient(to right, transparent, var(--gold), var(--gold-light), var(--gold), transparent)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>

        {/* Main content */}
        <div style={{ padding: '4rem 0 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <img src={logo} alt="Quran O Itrat Academy" style={{ height: 40, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, opacity: 0.95 }}>
                Quran O Itrat Academy
              </span>
            </div>

            {/* Arabic tagline */}
            <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.1rem', color: 'rgba(201,168,76,0.85)', marginBottom: '0.75rem', lineHeight: 1.8 }}>
              تعليم القرآن والعلوم الإسلامية
            </p>

            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', maxWidth: 280 }}>
              Dedicated to providing authentic Islamic education through comprehensive courses in Quran, Tajweed, and Islamic sciences.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'all .2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = 'var(--gold-light)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              Quick Links
            </h4>
            <div style={{ width: 28, height: 1.5, background: 'var(--gold)', borderRadius: 2, marginBottom: '1.25rem', opacity: 0.7 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color .2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.95)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', opacity: 0.5, flexShrink: 0 }} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              Our Courses
            </h4>
            <div style={{ width: 28, height: 1.5, background: 'var(--gold)', borderRadius: 2, marginBottom: '1.25rem', opacity: 0.7 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {courses.map((course) => (
                <li key={course.name}>
                  <Link
                    to={course.href}
                    style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color .2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.95)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', opacity: 0.5, flexShrink: 0 }} />
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              Contact Info
            </h4>
            <div style={{ width: 28, height: 1.5, background: 'var(--gold)', borderRadius: 2, marginBottom: '1.25rem', opacity: 0.7 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { Icon: MapPin, text: 'Q Block Model Town\nLahore, Pakistan' },
                { Icon: Phone, text: '+92 (328) 056-3616' },
                { Icon: Mail, text: 'academyquranoitrat@gmail.com' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Icon size={14} color="var(--gold)" style={{ marginTop: 3, flexShrink: 0, opacity: 0.8 }} />
                  <span style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-line' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              © {currentYear} Quran O Itrat Academy.
            </p>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.2)' }}>|</span>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Developed by <a href="https://minderfly.com" target="_blank" rel="noopener noreferrer" 
                style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--gold)'}
              >minderfly.com</a> — <span style={{ opacity: 0.8 }}>Premium Software Agency</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <Link key={t} to="/" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
