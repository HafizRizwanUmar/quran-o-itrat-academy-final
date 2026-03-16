import { Book, Users, Award, Shield, Globe, Star, Heart } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  // Scroll-triggered fade-up
  useEffect(() => {
    // ... logic ...
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>
      <SEO 
        title="About Us"
        description="Learn about the mission and values of Quran O Itrat Academy. We are dedicated to authentic Islamic education through modern platforms."
        keywords="Islamic Education Mission, Quran Scholars, Authentic Islamic Knowledge, Quran O Itrat Academy, Ahl al-Bayt Teachings"
      />
      {/* ─── HERO SECTION ──────────────────────────────── */}
      <section style={{ 
        position: 'relative', 
        padding: '8rem 0 6rem', 
        background: 'var(--forest)', 
        color: 'white',
        overflow: 'hidden'
      }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', textAlign: 'center' }}>
          <div className="scroll-fade">
            <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1rem' }}>
              عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ‏"
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1.5rem' }}>
              About Quran O Itrat Academy
            </h1>
            <div className="gold-line-center" />
            <p style={{ maxWidth: 700, margin: '1.5rem auto 0', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              Dedicated to preserving and spreading the light of the Quran and the teachings of the Ahl al-Bayt (AS) through modern, accessible education.
            </p>
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─────────────────────────────────── */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div className="scroll-fade">
              <div className="badge-emerald" style={{ marginBottom: '1rem' }}>Our Mission</div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', marginBottom: '1.5rem' }}>
                Nurturing a Generation of<br/><span className="text-gradient-gold">Enlightened Seekers</span>
              </h2>
              <p style={{ color: 'var(--stone)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Quran O Itrat Academy was founded with a vision to bridge the gap between traditional Islamic learning and the modern world. We believe that Islamic education should be accessible, engaging, and transformative for everyone.
              </p>
              <p style={{ color: 'var(--stone)', lineHeight: 1.8 }}>
                Our mission is to provide an authentic and comprehensive understanding of the Holy Quran and Islamic sciences, empowering our students to live their lives in accordance with divine wisdom while contributing positively to society.
              </p>
            </div>
            <div className="scroll-fade" style={{ position: 'relative' }}>
              <div style={{ 
                borderRadius: 24, 
                overflow: 'hidden', 
                boxShadow: '0 20px 50px rgba(10,61,46,0.15)',
                border: '1px solid rgba(201,168,76,0.2)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&auto=format" 
                  alt="Islamic Learning" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div style={{ 
                position: 'absolute', 
                bottom: -30, 
                right: -30, 
                width: 180, 
                height: 180, 
                background: 'radial-gradient(circle, var(--gold-light) 0%, transparent 70%)', 
                opacity: 0.3,
                zIndex: -1 
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ───────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--cream)', position: 'relative' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div className="scroll-fade" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge-emerald" style={{ marginBottom: '1rem' }}>Our Principles</div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>What Drives Us Forward</h2>
            <div className="gold-line-center" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {values.map((v, i) => (
              <div key={i} className="scroll-fade" style={{
                background: 'white',
                padding: '2.5rem 2rem',
                borderRadius: 20,
                border: '1px solid rgba(10,61,46,0.06)',
                boxShadow: '0 10px 30px rgba(10,61,46,0.05)',
                transition: 'transform 0.3s ease',
                transitionDelay: `${i * 100}ms`
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  background: 'rgba(20,122,84,0.08)', 
                  borderRadius: 16, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <v.icon size={28} color="var(--jade)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', fontSize: '1.25rem', marginBottom: '1rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--stone)', fontSize: '0.95rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MESSAGE FROM DIRECTOR ────────────────────── */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="scroll-fade" style={{ textAlign: 'center', background: 'white', padding: '4rem 3rem', borderRadius: 32, border: '1px solid rgba(10,61,46,0.08)', boxShadow: '0 30px 60px rgba(10,61,46,0.08)' }}>
            <Star size={40} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', marginBottom: '1.5rem' }}>Message from the Academy</h2>
            <p style={{ 
              fontFamily: 'var(--font-display)', 
              fontStyle: 'italic', 
              fontSize: '1.25rem', 
              color: 'var(--charcoal)', 
              lineHeight: 1.8, 
              marginBottom: '2rem' 
            }}>
              "Our goal is not just to teach the words of the Quran, but to help students embody its values. We strive to create an environment where learning is a joy and spiritual growth is a natural outcome of sincere study."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: 50, height: 1, background: 'var(--gold)' }} />
              <p style={{ fontWeight: 600, color: 'var(--forest)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                Quran O Itrat Management
              </p>
              <div style={{ width: 50, height: 1, background: 'var(--gold)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION ────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--forest)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Become a Part of Our Journey</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
            Whether you're a beginner or looking for advanced studies, we have a place for you in our academy.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <a href="/courses" style={{ 
              background: 'white', 
              color: 'var(--forest)', 
              padding: '1rem 2.5rem', 
              borderRadius: 100, 
              textDecoration: 'none', 
              fontWeight: 700 
            }}>
              Join a Course
            </a>
            <a href="/contact" style={{ 
              border: '2px solid white', 
              color: 'white', 
              padding: '1rem 2.5rem', 
              borderRadius: 100, 
              textDecoration: 'none', 
              fontWeight: 700 
            }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
