import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users, Star, ChevronLeft, ChevronRight, Grid, List, X } from 'lucide-react';
import { coursesAPI } from '../lib/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const fetchCourses = async (page = 1, search = '', level = '') => {
    try {
      setLoading(true);
      const params = { page, limit: 9, ...(search && { search }), ...(level && { level }) };
      const response = await coursesAPI.getAll(params);
      setCourses(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(currentPage, searchTerm, levelFilter); }, [currentPage, searchTerm, levelFilter]);

  const handleSearch = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleLevel = (v) => { setLevelFilter(v === levelFilter ? '' : v); setCurrentPage(1); };
  const clearFilters = () => { setSearchTerm(''); setLevelFilter(''); setCurrentPage(1); };

  const levelColors = {
    beginner:     { bg: 'rgba(20,122,84,0.08)', color: 'var(--jade)' },
    intermediate: { bg: 'rgba(201,168,76,0.12)', color: '#8a6d1a' },
    advanced:     { bg: 'rgba(180,40,40,0.08)',  color: '#b42828' },
  };

  const CourseCard = ({ course }) => {
    const lc = levelColors[course.level] || { bg: 'rgba(100,100,100,0.08)', color: '#555' };
    return (
      <div style={{
        background: 'white', borderRadius: 18, overflow: 'hidden',
        border: '1px solid rgba(10,61,46,0.07)',
        boxShadow: '0 2px 14px rgba(10,61,46,0.05)',
        transition: 'box-shadow .3s ease, transform .3s ease',
        display: viewMode === 'list' ? 'flex' : 'block',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 36px rgba(10,61,46,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 14px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
      >
        {/* Image */}
        <div style={{
          height: viewMode === 'list' ? '100%' : 190,
          width: viewMode === 'list' ? 240 : '100%',
          minWidth: viewMode === 'list' ? 240 : 'auto',
          overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(135deg,var(--emerald),var(--forest))',
          flexShrink: 0,
        }}>
          <img
            src={course.image || 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600'}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'none'}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,61,46,.35) 0%, transparent 50%)' }} />
          {course.level && (
            <span style={{ position: 'absolute', top: 12, right: 12, background: lc.bg, color: lc.color, backdropFilter: 'blur(8px)', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-body)', padding: '0.2rem 0.6rem', borderRadius: 100, textTransform: 'capitalize', border: `1px solid ${lc.color}30` }}>
              {course.level}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--jade)', background: 'rgba(20,122,84,0.07)', padding: '0.2rem 0.6rem', borderRadius: 100 }}>
              {course.category || 'Islamic Studies'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={12} fill="var(--gold)" color="var(--gold)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>4.9</span>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.4rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: viewMode === 'list' ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={13} color="var(--mist)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)' }}>200+ Students</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} color="var(--mist)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)' }}>12 Lessons</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid rgba(10,61,46,0.07)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--jade)' }}>
              {course.price ? `$${course.price}` : 'Free'}
            </span>
            <Link to={`/courses/${course._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--forest)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 1.1rem', borderRadius: 100, textDecoration: 'none', transition: 'background .2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--jade)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--forest)'}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(10,61,46,0.07)' }}>
      <div className="skeleton" style={{ height: 190 }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div className="skeleton" style={{ height: 18, width: '60%' }} />
        <div className="skeleton" style={{ height: 22, width: '85%' }} />
        <div className="skeleton" style={{ height: 14 }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div className="skeleton" style={{ height: 38, borderRadius: 100, marginTop: '0.5rem' }} />
      </div>
    </div>
  );

  const levels = ['beginner', 'intermediate', 'advanced'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>

      {/* Hero */}
      <section style={{ background: 'var(--forest)', padding: '4rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,30 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--warm-white)" />
          </svg>
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.1rem', color: 'rgba(201,168,76,0.7)', marginBottom: '1rem' }}>
            اقْرَأْ بِاسْمِ رَبِّكَ
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem' }}>
            Our <span className="text-gradient-gold">Courses</span>
          </h1>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right,var(--gold),var(--gold-light))', borderRadius: 2, margin: '0 auto 1.25rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 auto' }}>
            Discover comprehensive Islamic education courses designed to deepen your knowledge and strengthen your faith.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(10,61,46,0.08)', position: 'sticky', top: 72, zIndex: 40, padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
            <Search size={16} color="var(--mist)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--ink)', background: 'var(--cream)', border: '1.5px solid rgba(10,61,46,0.12)', borderRadius: 100, padding: '0.6rem 1rem 0.6rem 2.5rem', outline: 'none', transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--jade)'}
              onBlur={e => e.target.style.borderColor = 'rgba(10,61,46,0.12)'}
            />
          </div>

          {/* Level filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={14} /> Filter:
            </span>
            {levels.map(l => (
              <button key={l} onClick={() => handleLevel(l)} style={{
                fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500,
                padding: '0.35rem 0.875rem', borderRadius: 100, cursor: 'pointer',
                textTransform: 'capitalize', transition: 'all .2s ease',
                background: levelFilter === l ? 'var(--jade)' : 'rgba(10,61,46,0.05)',
                color: levelFilter === l ? 'white' : 'var(--stone)',
                border: `1.5px solid ${levelFilter === l ? 'var(--jade)' : 'rgba(10,61,46,0.12)'}`,
              }}>
                {l}
              </button>
            ))}
            {(searchTerm || levelFilter) && (
              <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)', background: 'none', border: '1px solid rgba(10,61,46,0.15)', borderRadius: 100, padding: '0.35rem 0.75rem', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--jade)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(10,61,46,0.15)'}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* View mode */}
          <div style={{ display: 'flex', background: 'rgba(10,61,46,0.05)', borderRadius: 8, padding: 3 }}>
            {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === mode ? 'var(--jade)' : 'transparent',
                color: viewMode === mode ? 'white' : 'var(--stone)',
                transition: 'all .2s ease',
              }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(20,122,84,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <BookOpen size={28} color="var(--jade)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>No courses found</h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', marginBottom: '1.5rem' }}>Try adjusting your search or filter settings.</p>
            <button onClick={clearFilters} style={{ background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, padding: '0.65rem 1.5rem', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill,minmax(280px,1fr))' : '1fr' }}>
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '3rem' }}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.2)', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={16} color="var(--stone)" />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              const near = Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages;
              if (!near) return i === 1 || i === totalPages - 2 ? <span key={i} style={{ color: 'var(--stone)', fontSize: '0.875rem' }}>…</span> : null;
              return (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${currentPage === p ? 'var(--jade)' : 'rgba(10,61,46,0.2)'}`, background: currentPage === p ? 'var(--jade)' : 'white', color: currentPage === p ? 'white' : 'var(--stone)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: currentPage === p ? 600 : 400, cursor: 'pointer', transition: 'all .2s' }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.2)', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={16} color="var(--stone)" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
