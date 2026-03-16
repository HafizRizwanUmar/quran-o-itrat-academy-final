import { useState, useEffect } from 'react';
import { Search, Download, BookOpen, FileText, Filter, Calendar, ChevronRight, Grid, List, X } from 'lucide-react';
import { studyMaterialsAPI, coursesAPI } from '../lib/api';

const FILE_TYPE_MAP = {
  pdf:  { bg: 'rgba(180,40,40,0.08)',  color: '#b42828', border: 'rgba(180,40,40,0.2)',  label: 'PDF' },
  doc:  { bg: 'rgba(29,111,163,0.08)', color: '#1d6fa3', border: 'rgba(29,111,163,0.2)', label: 'DOC' },
  docx: { bg: 'rgba(29,111,163,0.08)', color: '#1d6fa3', border: 'rgba(29,111,163,0.2)', label: 'DOCX' },
  ppt:  { bg: 'rgba(201,122,42,0.08)', color: '#c97a2a', border: 'rgba(201,122,42,0.2)', label: 'PPT' },
  pptx: { bg: 'rgba(201,122,42,0.08)', color: '#c97a2a', border: 'rgba(201,122,42,0.2)', label: 'PPTX' },
  xls:  { bg: 'rgba(20,122,84,0.08)',  color: '#147a54', border: 'rgba(20,122,84,0.2)',  label: 'XLS' },
  xlsx: { bg: 'rgba(20,122,84,0.08)',  color: '#147a54', border: 'rgba(20,122,84,0.2)',  label: 'XLSX' },
  txt:  { bg: 'rgba(100,100,100,0.07)',color: '#555',     border: 'rgba(100,100,100,0.18)', label: 'TXT' },
};

const getFileStyle = (ft) => FILE_TYPE_MAP[ft?.toLowerCase()] || { bg: 'rgba(100,100,100,0.07)', color: '#555', border: 'rgba(100,100,100,0.18)', label: (ft || 'FILE').toUpperCase() };

const FILE_EMOJI = { pdf: '📄', doc: '📝', docx: '📝', ppt: '📊', pptx: '📊', xls: '📈', xlsx: '📈', txt: '📄' };
const getEmoji = (ft) => FILE_EMOJI[ft?.toLowerCase()] || '📄';

const StudyMaterials = () => {
  const [materials, setMaterials]         = useState([]);
  const [courses, setCourses]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [courseFilter, setCourseFilter]   = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [viewMode, setViewMode]           = useState('grid');
  const [downloadingId, setDownloadingId] = useState(null);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);

  const fetchMaterials = async (page = 1, search = '', courseId = '') => {
    try {
      setLoading(true);
      const res = await studyMaterialsAPI.getAll({ page, limit: 12, ...(search && { search }), ...(courseId && { courseId }) });
      setMaterials(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { coursesAPI.getAll({ limit: 100 }).then(r => setCourses(r.data.data)).catch(() => {}); }, []);
  useEffect(() => { fetchMaterials(currentPage, searchTerm, courseFilter); }, [currentPage, searchTerm, courseFilter]);

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/study-materials/${id}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const cd = res.headers.get('Content-Disposition');
      let filename = 'download';
      if (cd) { const m = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/); if (m?.[1]) filename = m[1].replace(/['"]/g, ''); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setMaterials(prev => prev.map(m => m._id === id ? { ...m, downloadCount: (m.downloadCount || 0) + 1 } : m));
    } catch (e) { alert(`Download failed: ${e.message}`); } finally { setDownloadingId(null); }
  };

  const clearFilters = () => { setSearchTerm(''); setCourseFilter(''); setCurrentPage(1); };
  const selectedCourse = courses.find(c => c._id === courseFilter);
  const totalDownloads = materials.reduce((s, m) => s + (m.downloadCount || 0), 0);

  const MaterialCard = ({ m }) => {
    const fs = getFileStyle(m.fileType);
    return (
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(10,61,46,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow .3s, transform .3s', boxShadow: '0 2px 12px rgba(10,61,46,0.05)' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,61,46,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
      >
        {/* Top strip */}
        <div style={{ background: fs.bg, padding: '1rem 1.25rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{getEmoji(m.fileType)}</span>
            <span style={{ background: 'white', color: fs.color, border: `1px solid ${fs.border}`, fontSize: '0.68rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: 100, letterSpacing: '0.06em' }}>{fs.label}</span>
          </div>
          {m.lessonNumber && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--jade)', background: 'rgba(20,122,84,0.1)', padding: '0.18rem 0.6rem', borderRadius: 100 }}>Lesson {m.lessonNumber}</span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '0.875rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--forest)', lineHeight: 1.35, marginBottom: '0.3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.title}</h3>
          {m.courseId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
              <BookOpen size={11} color="var(--mist)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.775rem', color: 'var(--stone)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.courseId.title}</span>
            </div>
          )}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</p>

          {/* Meta row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--cream)', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: '0.875rem' }}>
            {[m.fileSize && { Icon: FileText, text: m.fileSize }, m.downloadCount != null && { Icon: Download, text: `${m.downloadCount}` }, m.createdAt && { Icon: Calendar, text: new Date(m.createdAt).toLocaleDateString() }].filter(Boolean).map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Icon size={10} color="var(--mist)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--mist)' }}>{text}</span>
              </div>
            ))}
          </div>

          <button onClick={() => handleDownload(m._id)} disabled={downloadingId === m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: downloadingId === m._id ? 'var(--stone)' : 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8375rem', padding: '0.6rem', borderRadius: 100, border: 'none', cursor: downloadingId === m._id ? 'not-allowed' : 'pointer', transition: 'background .2s' }}
            onMouseEnter={e => { if (downloadingId !== m._id) e.currentTarget.style.background = 'var(--emerald)'; }}
            onMouseLeave={e => { if (downloadingId !== m._id) e.currentTarget.style.background = 'var(--jade)'; }}
          >
            {downloadingId === m._id ? (
              <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'block' }} /> Downloading…</>
            ) : (
              <><Download size={14} /> Download <ChevronRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    );
  };

  const MaterialListItem = ({ m }) => {
    const fs = getFileStyle(m.fileType);
    return (
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(10,61,46,0.08)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'box-shadow .2s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(10,61,46,0.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{getEmoji(m.fileType)}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--forest)', margin: 0 }}>{m.title}</h3>
            <span style={{ background: fs.bg, color: fs.color, border: `1px solid ${fs.border}`, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 100 }}>{fs.label}</span>
            {m.lessonNumber && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, color: 'var(--jade)', background: 'rgba(20,122,84,0.08)', padding: '0.15rem 0.5rem', borderRadius: 100 }}>Lesson {m.lessonNumber}</span>}
          </div>
          {m.courseId && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.2rem' }}><BookOpen size={10} color="var(--mist)" /><span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)' }}>{m.courseId.title}</span></div>}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[m.fileSize, m.downloadCount != null && `${m.downloadCount} downloads`, m.createdAt && new Date(m.createdAt).toLocaleDateString()].filter(Boolean).map((t, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--mist)' }}>{t}</span>
            ))}
          </div>
        </div>
        <button onClick={() => handleDownload(m._id)} disabled={downloadingId === m._id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: downloadingId === m._id ? 'var(--stone)' : 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.8125rem', padding: '0.55rem 1.1rem', borderRadius: 100, border: 'none', cursor: downloadingId === m._id ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'background .2s' }}
          onMouseEnter={e => { if (downloadingId !== m._id) e.currentTarget.style.background = 'var(--emerald)'; }}
          onMouseLeave={e => { if (downloadingId !== m._id) e.currentTarget.style.background = 'var(--jade)'; }}
        >
          {downloadingId === m._id
            ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'block' }} />
            : <><Download size={14} /> Download</>
          }
        </button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>

      {/* Hero */}
      <section style={{ background: 'var(--forest)', padding: '4rem 1.5rem 5.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,30 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--warm-white)" />
          </svg>
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <BookOpen size={28} color="rgba(201,168,76,0.85)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '0.875rem' }}>
            Study <span className="text-gradient-gold">Materials</span>
          </h1>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right,var(--gold),var(--gold-light))', borderRadius: 2, margin: '0 auto 1.25rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 2rem' }}>
            Course-specific notes, lesson resources, and supplementary materials to enhance your learning journey.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[{ val: materials.length, label: 'Materials' }, { val: courses.length, label: 'Courses' }, { val: totalDownloads, label: 'Downloads' }, { val: '24/7', label: 'Access' }].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters bar */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(10,61,46,0.08)', position: 'sticky', top: 72, zIndex: 40, padding: '0.875rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 340 }}>
            <Search size={15} color="var(--mist)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search study materials…" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--ink)', background: 'var(--cream)', border: '1.5px solid rgba(10,61,46,0.12)', borderRadius: 100, padding: '0.55rem 1rem 0.55rem 2.25rem', outline: 'none', transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--jade)'} onBlur={e => e.target.style.borderColor = 'rgba(10,61,46,0.12)'} />
          </div>

          {/* Course filter dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setCourseMenuOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.8375rem', fontWeight: 500, padding: '0.5rem 1rem', borderRadius: 100, border: `1.5px solid ${courseFilter ? 'var(--jade)' : 'rgba(10,61,46,0.15)'}`, background: courseFilter ? 'rgba(20,122,84,0.06)' : 'white', color: courseFilter ? 'var(--jade)' : 'var(--stone)', cursor: 'pointer', transition: 'all .2s' }}>
              <Filter size={13} />
              {selectedCourse ? selectedCourse.title.slice(0, 20) + (selectedCourse.title.length > 20 ? '…' : '') : 'All Courses'}
            </button>
            {courseMenuOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50, background: 'white', border: '1px solid rgba(10,61,46,0.12)', borderRadius: 12, boxShadow: '0 8px 32px rgba(10,61,46,0.12)', padding: '0.5rem', minWidth: 220, maxHeight: 280, overflowY: 'auto' }}>
                {[{ _id: '', title: 'All Courses' }, ...courses].map(c => (
                  <button key={c._id} onClick={() => { setCourseFilter(c._id); setCourseMenuOpen(false); setCurrentPage(1); }} style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '0.8375rem', padding: '0.5rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer', background: courseFilter === c._id ? 'rgba(20,122,84,0.07)' : 'white', color: courseFilter === c._id ? 'var(--jade)' : 'var(--charcoal)', fontWeight: courseFilter === c._id ? 600 : 400, transition: 'background .15s' }}
                    onMouseEnter={e => { if (courseFilter !== c._id) e.currentTarget.style.background = 'rgba(10,61,46,0.03)'; }}
                    onMouseLeave={e => { if (courseFilter !== c._id) e.currentTarget.style.background = 'white'; }}
                  >{c.title}</button>
                ))}
              </div>
            )}
          </div>

          {(searchTerm || courseFilter) && (
            <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)', fontSize: '0.775rem', color: 'var(--stone)', background: 'none', border: '1px solid rgba(10,61,46,0.15)', borderRadius: 100, padding: '0.3rem 0.65rem', cursor: 'pointer' }}>
              <X size={11} /> Clear
            </button>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', background: 'rgba(10,61,46,0.05)', borderRadius: 8, padding: 3 }}>
            {[{ m: 'grid', I: Grid }, { m: 'list', I: List }].map(({ m, I }) => (
              <button key={m} onClick={() => setViewMode(m)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 6, border: 'none', cursor: 'pointer', background: viewMode === m ? 'var(--jade)' : 'transparent', color: viewMode === m ? 'white' : 'var(--stone)', transition: 'all .2s' }}>
                <I size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill,minmax(260px,1fr))' : '1fr', gap: '1.25rem' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(10,61,46,0.07)' }}>
                <div className="skeleton" style={{ height: 68 }} />
                <div style={{ padding: '0.875rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div className="skeleton" style={{ height: 18, width: '70%' }} />
                  <div className="skeleton" style={{ height: 13 }} />
                  <div className="skeleton" style={{ height: 13, width: '55%' }} />
                  <div className="skeleton" style={{ height: 36, borderRadius: 100, marginTop: '0.5rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : materials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(20,122,84,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <FileText size={26} color="var(--jade)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>No materials found</h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', marginBottom: '1.25rem' }}>Try adjusting your search or course filter.</p>
            <button onClick={clearFilters} style={{ background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, padding: '0.6rem 1.5rem', borderRadius: 100, border: 'none', cursor: 'pointer' }}>Clear Filters</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
            {materials.map(m => <MaterialCard key={m._id} m={m} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {materials.map(m => <MaterialListItem key={m._id} m={m} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '3rem' }}>
            <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1} style={{ width:34,height:34,borderRadius:8,border:'1.5px solid rgba(10,61,46,0.2)',background:'white',cursor:currentPage===1?'not-allowed':'pointer',opacity:currentPage===1?0.4:1 }}>‹</button>
            {[...Array(totalPages)].map((_,i)=>{const p=i+1;if(Math.abs(p-currentPage)>2&&p!==1&&p!==totalPages)return null;return <button key={p} onClick={()=>setCurrentPage(p)} style={{width:34,height:34,borderRadius:8,border:`1.5px solid ${currentPage===p?'var(--jade)':'rgba(10,61,46,0.2)'}`,background:currentPage===p?'var(--jade)':'white',color:currentPage===p?'white':'var(--stone)',fontFamily:'var(--font-body)',fontSize:'0.875rem',cursor:'pointer',transition:'all .2s'}}>{p}</button>;})}
            <button onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages} style={{ width:34,height:34,borderRadius:8,border:'1.5px solid rgba(10,61,46,0.2)',background:'white',cursor:currentPage===totalPages?'not-allowed':'pointer',opacity:currentPage===totalPages?0.4:1 }}>›</button>
          </div>
        )}
      </div>

      {/* How to use section */}
      <section style={{ background: 'var(--cream)', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', marginBottom: '0.5rem' }}>How to Use Materials</h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
            {[
              { n: 1, Icon: Search, title: 'Search & Filter', desc: 'Use the search bar and course filter to quickly find the right materials.' },
              { n: 2, Icon: FileText, title: 'Browse & Preview', desc: 'Browse through descriptions and file details to find what you need.' },
              { n: 3, Icon: Download, title: 'Download & Study', desc: 'Download instantly for offline access during your studies and exam prep.' },
            ].map(({ n, Icon, title, desc }) => (
              <div key={n} style={{ textAlign: 'center', background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid rgba(10,61,46,0.08)', boxShadow: '0 2px 12px rgba(10,61,46,0.05)' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(20,122,84,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color="var(--jade)" />
                  </div>
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'var(--stone)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default StudyMaterials;
