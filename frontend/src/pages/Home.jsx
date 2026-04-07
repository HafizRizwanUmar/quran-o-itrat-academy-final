import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Star, MessageCircle, Clock, CheckCircle2, ChevronRight, Play, Quote } from 'lucide-react';
import { coursesAPI, articlesAPI } from '../lib/api';
import SEO from '../components/SEO';
import homeHeroBg from '../assets/home_hero.png';
import studentLearningImg from '../assets/student_learning.png';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, articlesRes] = await Promise.all([
          coursesAPI.getAll({ limit: 3 }),
          articlesAPI.getAll({ limit: 3 }),
        ]);
        setFeaturedCourses(coursesRes.data.data);
        setRecentArticles(articlesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Scroll-triggered fade-up
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-fade');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; } });
    }, { threshold: 0.12 });
    els.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .65s ease, transform .65s ease';
      io.observe(el);
    });
    return () => io.disconnect();
  }, [loading]);

  const handleWhatsApp = () => {
    const msg = 'Hello! I am interested in learning more about Quran O Itrat Academy courses.';
    window.open(`https://wa.me/923280563616?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const features = [
    { icon: BookOpen, title: 'Comprehensive Curriculum', desc: 'From Tajweed to advanced Islamic philosophy, our structured paths cover it all.', accent: '#147a54' },
    { icon: Users, title: 'Expert Mentorship', desc: 'Learn directly from qualified scholars with years of dedicated teaching experience.', accent: '#1d6fa3' },
    { icon: Award, title: 'Globally Recognised', desc: 'Our certifications are respected worldwide, opening doors to further studies.', accent: '#7c4db8' },
    { icon: Clock, title: 'Flexible Learning', desc: 'Study at your own pace with adaptive scheduling and accessible online platforms.', accent: '#c97a2a' },
  ];

  const stats = [
    { number: '500+', label: 'Active Students', icon: Users },
    { number: '50+', label: 'Qualified Teachers', icon: Award },
    { number: '20+', label: 'Courses', icon: BookOpen },
    { number: '98%', label: 'Satisfaction Rate', icon: Star },
  ];

  const testimonials = [
    { text: 'The academy has transformed my understanding of the Quran. The teachers are incredibly patient and knowledgeable.', name: 'Abdullah Khan', role: 'Quran Recitation Student' },
    { text: 'Joining this academy was the best decision I made for my spiritual growth. The curriculum is both thorough and inspiring.', name: 'Fatima Ahmed', role: 'Tajweed Student' },
    { text: 'Excellent learning environment with scholars who truly care about each student\'s progress and understanding.', name: 'Usman Malik', role: 'Islamic Studies Student' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)', overflow: 'hidden' }}>
      <SEO 
        title="Home"
        description="Learn Quran, Tafseer, and Seerah with qualified scholars at Quran O Itrat Academy. Explore our comprehensive Islamic courses."
        keywords="Quran Teaching, Tafseer e Namoona, Tauzeeh ul masil, Islamic Academy, Quran O Itrat, Seerah, Tafseer e Qumi, Tareekh e Tabri"
      />

      {/* ─── HERO ──────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', background: 'var(--forest)' }}>
        {/* BG image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={homeHeroBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(10,61,46,.97) 0%, rgba(10,61,46,.88) 55%, rgba(10,61,46,.6) 100%)' }} />
        </div>

        {/* Geometric overlay */}
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

        {/* Content */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2, width: '100%', paddingTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="hero-grid"
          >
            {/* Left */}
            <div style={{ animation: 'fadeUp .9s ease both' }}>
              {/* Arabic Bismillah */}
              <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.5rem', color: 'rgba(201,168,76,0.8)', marginBottom: '1.25rem', lineHeight: 1.8 }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Pill badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 100, padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'block', animation: 'ping2 1.8s ease infinite' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--gold-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Admissions Open 2025
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'white', lineHeight: 1.1, marginBottom: '1.25rem', fontSize: 'clamp(2.6rem,5vw,4.5rem)' }}>
                Illuminating Hearts<br />
                with <span className="text-gradient-gold">Divine Knowledge</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, maxWidth: 480, marginBottom: '2rem' }}>
                Embark on a transformative journey of Islamic learning. Authentic education, spiritual growth, and community connection await you.
              </p>

              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: 'var(--jade)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', padding: '0.75rem 1.75rem', borderRadius: 100, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.25)', transition: 'all .25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.25)'; }}
                >
                  Explore Courses <ArrowRight size={16} />
                </Link>

                <button onClick={handleWhatsApp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9375rem', padding: '0.75rem 1.75rem', borderRadius: 100, border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all .25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['Certified Institute', 'Expert Scholars', 'Flexible Online'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} color="var(--sage)" />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image card */}
            <div className="hero-img-col" style={{ position: 'relative', animation: 'fadeUp 1.1s .2s ease both' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,.4)', transform: 'rotate(1.5deg)', transition: 'transform .6s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'rotate(1.5deg)'}
              >
                <img src={studentLearningImg} alt="Students learning" style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,61,46,.75) 0%, transparent 50%)' }} />
                {/* Quote card */}
                <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, background: 'rgba(10,20,14,0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 14, padding: '1rem 1.25rem' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    "The best of you are those who learn the Quran and teach it."
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.04em' }}>— Prophet Muhammad ﷺ</p>
                </div>
              </div>
              {/* Decorative blurs */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -30, width: 180, height: 180, background: 'radial-gradient(circle, rgba(20,122,84,0.2), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, zIndex: 3 }}>
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C360,70 1080,0 1440,50 L1440,70 L0,70 Z" fill="var(--warm-white)" />
          </svg>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────── */}
      <section style={{ background: 'var(--warm-white)', padding: '4rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }} className="stats-grid scroll-fade">
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1rem', background: 'white', borderRadius: 16, border: '1px solid rgba(10,61,46,0.08)', boxShadow: '0 2px 12px rgba(10,61,46,0.06)', transition: 'box-shadow .3s ease, transform .3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,61,46,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.06)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(20,122,84,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <stat.icon size={22} color="var(--jade)" />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--forest)', lineHeight: 1 }}>{stat.number}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.5rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div className="scroll-fade" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
            <div className="badge-emerald" style={{ marginBottom: '1rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--jade)' }} />
              Why Choose Us
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', marginBottom: '0.75rem' }}>
              An Exceptional Learning Experience
            </h2>
            <div className="gold-line-center" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--stone)', lineHeight: 1.75, marginTop: '1rem' }}>
              We blend traditional Islamic pedagogy with modern educational technology for a holistic and effective learning experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div key={i} className="scroll-fade" style={{
                background: 'white', borderRadius: 20, padding: '2rem 1.75rem',
                border: '1px solid rgba(10,61,46,0.07)',
                boxShadow: '0 2px 16px rgba(10,61,46,0.05)',
                transition: 'box-shadow .3s ease, transform .3s ease',
                transitionDelay: `${i * 80}ms`,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,61,46,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 54, height: 54, borderRadius: 14, background: `${f.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <f.icon size={24} color={f.accent} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.6rem' }}>{f.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--stone)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ──────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--warm-white)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="scroll-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge-emerald" style={{ marginBottom: '0.75rem' }}>Featured Programmes</div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', margin: 0 }}>
                Our Courses
              </h2>
              <div className="gold-line" style={{ marginTop: '0.75rem' }} />
            </div>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jade)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9rem', transition: 'gap .2s' }}
              onMouseEnter={e => e.currentTarget.style.gap = '0.7rem'}
              onMouseLeave={e => e.currentTarget.style.gap = '0.4rem'}
            >
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(10,61,46,0.08)' }}>
                  <div className="skeleton" style={{ height: 220 }} />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="skeleton" style={{ height: 22, width: '75%' }} />
                    <div className="skeleton" style={{ height: 14, width: '55%' }} />
                    <div className="skeleton" style={{ height: 14 }} />
                    <div className="skeleton" style={{ height: 40, borderRadius: 100 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
              {featuredCourses.map((course, i) => (
                <div key={i} className="scroll-fade" style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  border: '1px solid rgba(10,61,46,0.08)',
                  boxShadow: '0 2px 16px rgba(10,61,46,0.06)',
                  transition: 'box-shadow .3s ease, transform .3s ease',
                  transitionDelay: `${i * 100}ms`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,61,46,0.13)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(10,61,46,0.06)'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Card image */}
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: 'var(--emerald)' }}>
                    <img
                      src={course.image || `https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&auto=format`}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'none'}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,61,46,.4) 0%, transparent 60%)' }} />
                    {course.level && (
                      <span style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '0.2rem 0.65rem', fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', textTransform: 'capitalize' }}>
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span className="badge-emerald">{course.category || 'Islamic Studies'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={13} fill="var(--gold)" color="var(--gold)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--charcoal)' }}>4.9</span>
                      </div>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{course.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(10,61,46,0.07)' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--jade)' }}>
                        {course.price ? `$${course.price}` : 'Free'}
                      </div>
                      <Link to={`/courses/${course._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--forest)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem', padding: '0.55rem 1.25rem', borderRadius: 100, textDecoration: 'none', transition: 'background .2s ease' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--jade)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--forest)'}
                      >
                        Enroll Now <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── RECENT ARTICLES ───────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'white', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="scroll-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge-emerald" style={{ marginBottom: '0.75rem' }}>Knowledge Sharing</div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', margin: 0 }}>
                Latest Articles
              </h2>
              <div className="gold-line" style={{ marginTop: '0.75rem' }} />
            </div>
            <Link to="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jade)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9rem', transition: 'gap .2s' }}
              onMouseEnter={e => e.currentTarget.style.gap = '0.7rem'}
              onMouseLeave={e => e.currentTarget.style.gap = '0.4rem'}
            >
              Explore Library <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '2rem' }}>
            {recentArticles.map((article, i) => (
              <div key={i} className="scroll-fade" style={{
                background: 'var(--warm-white)', borderRadius: 20, padding: '2rem',
                border: '1px solid rgba(10,61,46,0.06)',
                display: 'flex', flexDirection: 'column',
                transition: 'all .3s ease',
                transitionDelay: `${i * 100}ms`
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,61,46,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--warm-white)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(10,61,46,0.08)' }}>
                    <BookOpen size={20} color="var(--jade)" />
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 500 }}>
                    {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{article.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--stone)', lineHeight: 1.7, marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.content}
                </p>
                <Link 
                  to={`/articles/${article._id}`} 
                  onClick={() => console.log('Home: Navigating to article:', article._id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jade)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Read Full Article <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--parchment)', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern-gold" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div className="scroll-fade" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge-emerald" style={{ marginBottom: '1rem' }}>Student Stories</div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
              Words from Our Students
            </h2>
            <div className="gold-line-center" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="scroll-fade" style={{
                background: 'white', borderRadius: 20, padding: '2rem',
                border: '1px solid rgba(10,61,46,0.07)',
                boxShadow: '0 2px 16px rgba(10,61,46,0.06)',
                position: 'relative',
                transitionDelay: `${i * 100}ms`,
              }}>
                <Quote size={32} color="var(--gold)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />)}
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.0625rem', color: 'var(--charcoal)', lineHeight: 1.7, marginBottom: '1.5rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(10,61,46,0.07)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--jade)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--forest)' }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────── */}
      <section style={{ background: 'var(--forest)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(201,168,76,0.07), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative' }}>
          <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.6rem', color: 'rgba(201,168,76,0.75)', marginBottom: '1.5rem', lineHeight: 2 }}>
            وَعَلَّمَكَ مَا لَمْ تَكُن تَعْلَمُ
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem', fontSize: 'clamp(2rem,4vw,3.2rem)' }}>
            Ready to Begin Your<br />
            <span className="text-gradient-gold">Spiritual Journey?</span>
          </h2>
          <div className="gold-line-center" />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: '1.25rem auto 2.5rem', maxWidth: 480 }}>
            Join thousands of students from around the world. Take the first step towards mastering the Quran and Islamic sciences today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: 'var(--jade)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', padding: '0.85rem 2.25rem', borderRadius: 100, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,.2)', transition: 'all .25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.2)'; }}
            >
              Start Learning Now <ArrowRight size={18} />
            </Link>
            <button onClick={handleWhatsApp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '1rem', padding: '0.85rem 2rem', borderRadius: 100, border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all .25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </button>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
            Free consultation available · No commitment required
          </p>
        </div>
      </section>

      {/* WhatsApp FAB */}
      <button
        onClick={handleWhatsApp}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 50,
          width: 54, height: 54, borderRadius: '50%',
          background: '#25D366', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(37,211,102,.4)',
          transition: 'all .25s ease',
          color: 'white',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(37,211,102,.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,211,102,.4)'; }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </button>

      <style>{`
        @keyframes ping2 { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.5);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:900px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-img-col { display:none !important; }
          .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:500px) {
          .stats-grid { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
