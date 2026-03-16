import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, BookOpen, FileText, Headphones, Video, Star, Clock, User, Calendar, ArrowRight, Grid, List, X } from 'lucide-react';
import { libraryAPI, articlesAPI } from '../lib/api';
import LibraryMaterialDetailModal from './LibraryMaterialDetailModal';
import SEO from '../components/SEO';

const CATEGORY_MAP = {
  books:     { Icon: BookOpen,  bg: 'rgba(20,122,84,0.08)',  color: '#147a54', border: 'rgba(20,122,84,0.2)',  label: 'Books' },
  audio:     { Icon: Headphones, bg: 'rgba(29,111,163,0.08)', color: '#1d6fa3', border: 'rgba(29,111,163,0.2)', label: 'Audio' },
  video:     { Icon: Video,     bg: 'rgba(124,77,184,0.08)', color: '#7c4db8', border: 'rgba(124,77,184,0.2)', label: 'Video' },
  documents: { Icon: FileText,  bg: 'rgba(201,122,42,0.08)', color: '#c97a2a', border: 'rgba(201,122,42,0.2)', label: 'Docs' },
};

const getCat = (cat) => CATEGORY_MAP[cat] || { Icon: FileText, bg: 'rgba(100,100,100,0.07)', color: '#555', border: 'rgba(100,100,100,0.18)', label: cat || 'File' };

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const Library = () => {
  const [materials, setMaterials]           = useState([]);
  const [articles, setArticles]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [activeTab, setActiveTab]           = useState('materials');
  const [viewMode, setViewMode]             = useState('grid');
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const fetchMaterials = async (page = 1, search = '', category = '') => {
    try {
      setLoading(true);
      const res = await libraryAPI.getAll({ page, limit: 12, ...(search && { search }), ...(category && { category }) });
      setMaterials(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchArticles = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const res = await articlesAPI.getAll({ page, limit: 12, ...(search && { search }) });
      setArticles(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'materials') fetchMaterials(currentPage, searchTerm, categoryFilter);
    else fetchArticles(currentPage, searchTerm);
  }, [currentPage, searchTerm, categoryFilter, activeTab]);

  const handleDownload = (id) => {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/library/${id}/download`;
    window.open(url, '_blank');
  };

  const switchTab = (tab) => { setActiveTab(tab); setCurrentPage(1); setSearchTerm(''); setCategoryFilter(''); };
  const clearFilters = () => { setSearchTerm(''); setCategoryFilter(''); setCurrentPage(1); };

  // ── Material card ──────────────────────────────
  const MaterialCard = ({ m }) => {
    const cat = getCat(m.category);
    const CatIcon = cat.Icon;
    return (
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(10,61,46,0.08)', overflow: 'hidden', display: 'flex', flexDirection: viewMode === 'list' ? 'row' : 'column', transition: 'box-shadow .3s, transform .3s', boxShadow: '0 2px 12px rgba(10,61,46,0.05)' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,61,46,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
      >
        {/* Icon strip */}
        <div style={{ background: cat.bg, padding: viewMode === 'list' ? '1.25rem' : '1.25rem 1.25rem 0.75rem', display: 'flex', alignItems: viewMode === 'list' ? 'center' : 'flex-start', justifyContent: viewMode === 'list' ? 'center' : 'space-between', flexShrink: 0, width: viewMode === 'list' ? 80 : 'auto', minWidth: viewMode === 'list' ? 80 : 'auto' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(10,61,46,0.08)' }}>
            <CatIcon size={20} color={cat.color} />
          </div>
          {viewMode !== 'list' && (
            <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cat.label}</span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: viewMode === 'list' ? '1rem 1.25rem 1rem 0.75rem' : '0.875rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--forest)', lineHeight: 1.35, marginBottom: '0.3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.title}</h3>
          {m.author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
              <User size={11} color="var(--mist)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)' }}>{m.author}</span>
            </div>
          )}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: viewMode === 'list' ? 2 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            {[m.fileSize && { Icon: Clock, text: m.fileSize }, m.downloadCount != null && { Icon: Download, text: `${m.downloadCount} downloads` }].filter(Boolean).map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Icon size={11} color="var(--mist)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--mist)' }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => handleDownload(m._id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem', padding: '0.55rem 0.875rem', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--emerald)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--jade)'}
            >
              <Download size={14} /> Download
            </button>
            <button onClick={() => { setSelectedMaterialId(m._id); setIsMaterialModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: 'white', color: 'var(--stone)', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem', padding: '0.55rem 0.875rem', borderRadius: 100, border: '1.5px solid rgba(10,61,46,0.15)', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--jade)'; e.currentTarget.style.color = 'var(--jade)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,61,46,0.15)'; e.currentTarget.style.color = 'var(--stone)'; }}
            >
              <Eye size={14} /> View
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Article card ───────────────────────────────
  const ArticleCard = ({ a }) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(10,61,46,0.08)', overflow: 'hidden', display: viewMode === 'list' ? 'flex' : 'block', transition: 'box-shadow .3s, transform .3s', boxShadow: '0 2px 12px rgba(10,61,46,0.05)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,61,46,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ background: 'rgba(20,122,84,0.05)', padding: '1.25rem 1.25rem 0.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0, width: viewMode === 'list' ? 'auto' : 'auto' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(10,61,46,0.08)' }}>
          <FileText size={18} color="var(--jade)" />
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={11} />{formatDate(a.createdAt)}
        </span>
      </div>
      <div style={{ padding: '0.75rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--forest)', lineHeight: 1.35, marginBottom: '0.3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
          <User size={11} color="var(--mist)" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)' }}>{a.author}{a.category ? ` · ${a.category}` : ''}</span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.content}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.875rem' }}>
          {a.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500, background: 'rgba(20,122,84,0.06)', color: 'var(--jade)', border: '1px solid rgba(20,122,84,0.15)', padding: '0.15rem 0.55rem', borderRadius: 100 }}>{tag}</span>
          ))}
          {a.views != null && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Eye size={11} />{a.views}</span>}
        </div>
        <Link 
          to={`/articles/${a._id}`} 
          onClick={() => console.log('Library: Navigating to article:', a._id)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem', padding: '0.6rem', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'background .2s', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--emerald)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--jade)'}
        >
          Read Article <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );

  const items = activeTab === 'materials' ? materials : articles;
  const gridCols = viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr';
  const hasFilters = searchTerm || categoryFilter;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>
      <SEO
        title="Islamic Library"
        description="Search through a vast collection of Islamic books, audio lectures, videos, and scholarly articles on Quran, Tafseer, and Seerah."
        keywords="Sahih Bukhari, Tafseer Namoona, Mafatih ul Janan, Islamic Library, Shia Books, Quran Studies, Seerah Articles"
      />

      {/* Hero */}
      <section style={{ background: 'var(--forest)', padding: '4rem 1.5rem 5.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,30 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--warm-white)" />
          </svg>
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.1rem', color: 'rgba(201,168,76,0.7)', marginBottom: '0.75rem' }}>خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ</p>
          <div className="badge-emerald" style={{ marginBottom: '1rem', display: 'inline-flex', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-light)', borderColor: 'rgba(201,168,76,0.25)' }}>Islamic Knowledge Centre</div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem' }}>
            Islamic <span className="text-gradient-gold">Library</span>
          </h1>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right,var(--gold),var(--gold-light))', borderRadius: 2, margin: '0 auto 1.25rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 2rem' }}>
            Discover our comprehensive collection of Islamic books, audio lectures, videos, and scholarly articles.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[{ Icon: BookOpen, label: '1000+ Books' }, { Icon: Headphones, label: '500+ Audio' }, { Icon: Video, label: '200+ Videos' }, { Icon: FileText, label: '300+ Articles' }].map(({ Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontSize: '0.8375rem' }}>
                <Icon size={14} /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Filters bar */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(10,61,46,0.08)', position: 'sticky', top: 72, zIndex: 40, padding: '0.875rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(10,61,46,0.05)', borderRadius: 10, padding: 3 }}>
            {[{ id: 'materials', label: 'Library Materials', Icon: BookOpen }, { id: 'articles', label: 'Articles', Icon: FileText }].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => switchTab(id)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8375rem', padding: '0.45rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all .2s', background: activeTab === id ? 'var(--jade)' : 'transparent', color: activeTab === id ? 'white' : 'var(--stone)' }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
            <Search size={15} color="var(--mist)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder={`Search ${activeTab}…`} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--ink)', background: 'var(--cream)', border: '1.5px solid rgba(10,61,46,0.12)', borderRadius: 100, padding: '0.55rem 1rem 0.55rem 2.25rem', outline: 'none', transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--jade)'} onBlur={e => e.target.style.borderColor = 'rgba(10,61,46,0.12)'} />
          </div>

          {/* Category filter (materials only) */}
          {activeTab === 'materials' && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['', 'books', 'audio', 'video', 'documents'].map(c => {
                const cat = getCat(c);
                const active = categoryFilter === c;
                return (
                  <button key={c} onClick={() => { setCategoryFilter(c); setCurrentPage(1); }} style={{ fontFamily: 'var(--font-body)', fontSize: '0.775rem', fontWeight: 500, padding: '0.3rem 0.75rem', borderRadius: 100, cursor: 'pointer', textTransform: c ? 'capitalize' : 'none', background: active ? (c ? cat.bg : 'var(--jade)') : 'rgba(10,61,46,0.04)', color: active ? (c ? cat.color : 'white') : 'var(--stone)', border: `1.5px solid ${active ? (c ? cat.border : 'var(--jade)') : 'rgba(10,61,46,0.12)'}`, transition: 'all .2s' }}>
                    {c ? cat.label : 'All'}
                  </button>
                );
              })}
            </div>
          )}

          {hasFilters && (
            <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)', fontSize: '0.775rem', color: 'var(--stone)', background: 'none', border: '1px solid rgba(10,61,46,0.15)', borderRadius: 100, padding: '0.3rem 0.65rem', cursor: 'pointer' }}>
              <X size={11} /> Clear
            </button>
          )}

          {/* View toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', background: 'rgba(10,61,46,0.05)', borderRadius: 8, padding: 3 }}>
            {[{ m: 'grid', I: Grid }, { m: 'list', I: List }].map(({ m, I }) => (
              <button key={m} onClick={() => setViewMode(m)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 6, border: 'none', cursor: 'pointer', background: viewMode === m ? 'var(--jade)' : 'transparent', color: viewMode === m ? 'white' : 'var(--stone)', transition: 'all .2s' }}>
                <I size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1.25rem' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(10,61,46,0.07)' }}>
                <div className="skeleton" style={{ height: 72 }} />
                <div style={{ padding: '0.875rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div className="skeleton" style={{ height: 18, width: '75%' }} />
                  <div className="skeleton" style={{ height: 13 }} />
                  <div className="skeleton" style={{ height: 13, width: '60%' }} />
                  <div className="skeleton" style={{ height: 36, borderRadius: 100, marginTop: '0.5rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(20,122,84,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <BookOpen size={26} color="var(--jade)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>Nothing found</h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', marginBottom: '1.25rem' }}>Try adjusting your search or filters.</p>
            {hasFilters && <button onClick={clearFilters} style={{ background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, padding: '0.6rem 1.5rem', borderRadius: 100, border: 'none', cursor: 'pointer' }}>Clear Filters</button>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1.25rem' }}>
            {activeTab === 'materials'
              ? materials.map(m => <MaterialCard key={m._id} m={m} />)
              : articles.map(a => <ArticleCard key={a._id} a={a} />)
            }
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '3rem' }}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.2)', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>‹</button>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) return null;
              return <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${currentPage === p ? 'var(--jade)' : 'rgba(10,61,46,0.2)'}`, background: currentPage === p ? 'var(--jade)' : 'white', color: currentPage === p ? 'white' : 'var(--stone)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all .2s' }}>{p}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.2)', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>›</button>
          </div>
        )}
      </div>

      <LibraryMaterialDetailModal materialId={selectedMaterialId} isOpen={isMaterialModalOpen} onClose={() => { setIsMaterialModalOpen(false); setSelectedMaterialId(null); }} />
    </div>
  );
};

export default Library;
