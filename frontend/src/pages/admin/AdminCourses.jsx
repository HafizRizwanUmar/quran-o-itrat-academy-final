import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, Search, Filter, Upload, Image, X, Check, BookOpen, Clock, User, DollarSign, Tag } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { coursesAPI, getImageUrl } from '../../lib/api';

/* ── Shared styles ─────────────────────────────────────────── */
const inp = {
  width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  color: 'var(--ink)', background: 'var(--cream)',
  border: '1.5px solid rgba(10,61,46,0.15)', borderRadius: 8,
  padding: '0.65rem 0.875rem', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color .2s, box-shadow .2s',
};
const fi  = e => { e.target.style.borderColor = 'var(--jade)';           e.target.style.boxShadow = '0 0 0 3px rgba(20,122,84,0.08)'; };
const fo  = e => { e.target.style.borderColor = 'rgba(10,61,46,0.15)';  e.target.style.boxShadow = 'none'; };

const LEVEL_COLORS = {
  beginner:     { bg: 'rgba(20,122,84,0.08)',  color: '#147a54', border: 'rgba(20,122,84,0.25)' },
  intermediate: { bg: 'rgba(201,168,76,0.10)', color: '#8a6d1a', border: 'rgba(201,168,76,0.35)' },
  advanced:     { bg: 'rgba(180,40,40,0.08)',  color: '#b42828', border: 'rgba(180,40,40,0.25)' },
};

const LevelBadge = ({ level }) => {
  const c = LEVEL_COLORS[level] || { bg: 'rgba(100,100,100,0.08)', color: '#555', border: 'rgba(100,100,100,0.2)' };
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 100, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {level}
    </span>
  );
};

/* ── Field label helper ────────────────────────────────────── */
const Lbl = ({ children, required }) => (
  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
    {children}{required && <span style={{ color: 'var(--jade)', marginLeft: 2 }}>*</span>}
  </label>
);

const EMPTY = { title: '', description: '', instructor: '', duration: '', price: '' };

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
const AdminCourses = () => {
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  /* modal */
  const [isOpen, setIsOpen]           = useState(false);
  const [editing, setEditing]         = useState(null);
  const [formData, setFormData]       = useState(EMPTY);
  const [selectedLevel, setLevel]     = useState('');
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setPreview]    = useState('');
  const [formError, setFormError]     = useState('');
  const [saving, setSaving]           = useState(false);
  const fileRef = useRef(null);

  /* ── data ─────────────────────────────────────────────────── */
  const fetchCourses = async (page = 1, search = '', level = '') => {
    try {
      setLoading(true);
      const r = await coursesAPI.getAll({ page, limit: 10, ...(search && { search }), ...(level && { level }) });
      setCourses(r.data.data);
      setTotalPages(r.data.pagination.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(currentPage, searchTerm, levelFilter); }, [currentPage, searchTerm, levelFilter]);

  /* ── modal helpers ───────────────────────────────────────── */
  const openAdd = () => {
    setEditing(null); setFormData(EMPTY); setLevel('');
    setImageFile(null); setPreview(''); setFormError(''); setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const openEdit = c => {
    setEditing(c);
    setFormData({ title: c.title, description: c.description, instructor: c.instructor, duration: c.duration, price: c.price });
    setLevel(c.level);
    setImageFile(null);
    setPreview(getImageUrl(c.image) || getImageUrl(c.imageUrl) || '');
    setFormError(''); setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleImageChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { setFormError('Please select a valid image file.'); return; }
    if (f.size > 5 * 1024 * 1024) { setFormError('Image must be under 5 MB.'); return; }
    setImageFile(f); setPreview(URL.createObjectURL(f)); setFormError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedLevel) { setFormError('Please select a course level.'); return; }
    setSaving(true); setFormError('');
    try {
      const fd = new FormData();
      Object.entries({ ...formData, level: selectedLevel }).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing) await coursesAPI.update(editing._id, fd);
      else await coursesAPI.create(fd);
      closeModal();
      fetchCourses(currentPage, searchTerm, levelFilter);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this course?')) return;
    await coursesAPI.delete(id);
    fetchCourses(currentPage, searchTerm, levelFilter);
  };

  /* ══════════════════════════════════════════════════════════
     MODAL (portal)
  ══════════════════════════════════════════════════════════ */
  const modal = isOpen && createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '1rem' }}>
      <div style={{ position: 'relative', background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', animation: 'fadeUp .3s ease' }}>

        {/* ── Header ── */}
        <div style={{ background: 'var(--forest)', padding: '1.25rem 1.5rem', position: 'relative', flexShrink: 0 }}>
          <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={17} color="var(--gold)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'white', margin: 0 }}>
                  {editing ? 'Edit Course' : 'Add New Course'}
                </h2>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '3px 0 0' }}>
                {editing ? `Editing: ${editing.title}` : 'Fill in the details to create a new course'}
              </p>
            </div>
            <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0, transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            ><X size={16} /></button>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{ height: 3, background: 'linear-gradient(to right,var(--forest),var(--gold),var(--gold-light),var(--gold),var(--forest))', flexShrink: 0 }} />

        {/* ── Scrollable form ── */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Image upload */}
          <div>
            <Lbl>Course Image</Lbl>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${imagePreview ? 'rgba(20,122,84,0.3)' : 'rgba(10,61,46,0.18)'}`, borderRadius: 12, padding: '1.1rem', textAlign: 'center', cursor: 'pointer', background: imagePreview ? 'rgba(20,122,84,0.03)' : 'var(--cream)', transition: 'all .2s', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--jade)'; e.currentTarget.style.background = 'rgba(20,122,84,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = imagePreview ? 'rgba(20,122,84,0.3)' : 'rgba(10,61,46,0.18)'; e.currentTarget.style.background = imagePreview ? 'rgba(20,122,84,0.03)' : 'var(--cream)'; }}
            >
              {imagePreview ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: 80, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--forest)', margin: 0 }}>
                      {imageFile ? imageFile.name : 'Current image'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--mist)', margin: '2px 0 0' }}>Click to replace</p>
                  </div>
                  <button type="button" onClick={e => { e.stopPropagation(); setImageFile(null); setPreview(''); }}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(180,40,40,0.1)', border: 'none', color: '#b42828', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={26} color="var(--mist)" style={{ margin: '0 auto 6px' }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--stone)', margin: 0 }}>Click to upload image</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--mist)', marginTop: 3 }}>JPG, PNG, WebP · Max 5 MB</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Title */}
          <div>
            <Lbl required>Title</Lbl>
            <input style={inp} required value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Quran Recitation — Beginner" onFocus={fi} onBlur={fo} />
          </div>

          {/* Description */}
          <div>
            <Lbl required>Description</Lbl>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 84, lineHeight: 1.65 }} rows={3} required
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="What will students learn in this course?" onFocus={fi} onBlur={fo} />
          </div>

          {/* Instructor + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <Lbl required>Instructor</Lbl>
              <div style={{ position: 'relative' }}>
                <User size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input style={{ ...inp, paddingLeft: 32 }} required value={formData.instructor}
                  onChange={e => setFormData(p => ({ ...p, instructor: e.target.value }))}
                  placeholder="Instructor name" onFocus={fi} onBlur={fo} />
              </div>
            </div>
            <div>
              <Lbl required>Duration</Lbl>
              <div style={{ position: 'relative' }}>
                <Clock size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input style={{ ...inp, paddingLeft: 32 }} required value={formData.duration}
                  onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))}
                  placeholder="e.g. 4 weeks" onFocus={fi} onBlur={fo} />
              </div>
            </div>
          </div>

          {/* Level selector */}
          <div>
            <Lbl required>Level</Lbl>
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {Object.entries(LEVEL_COLORS).map(([l, c]) => (
                <button key={l} type="button" onClick={() => { setLevel(l); if (formError === 'Please select a course level.') setFormError(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 1rem', borderRadius: 100, border: `1.5px solid ${selectedLevel === l ? c.border : 'rgba(10,61,46,0.15)'}`, background: selectedLevel === l ? c.bg : 'white', cursor: 'pointer', transition: 'all .2s', userSelect: 'none' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${selectedLevel === l ? c.color : 'rgba(10,61,46,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedLevel === l && <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color }} />}
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', fontWeight: selectedLevel === l ? 600 : 400, color: selectedLevel === l ? c.color : 'var(--stone)', textTransform: 'capitalize' }}>{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <Lbl required>Price (USD)</Lbl>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="number" style={{ ...inp, paddingLeft: 32 }} required min="0" step="0.01"
                value={formData.price}
                onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                placeholder="0 for free" onFocus={fi} onBlur={fo} />
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div style={{ background: 'rgba(180,40,40,0.07)', border: '1px solid rgba(180,40,40,0.2)', borderRadius: 8, padding: '0.7rem 0.9rem', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#b42828' }}>
              {formError}
            </div>
          )}

          {/* Footer buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <button type="button" onClick={closeModal}
              style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9rem', padding: '0.7rem', borderRadius: 100, border: '1.5px solid rgba(10,61,46,0.2)', background: 'white', color: 'var(--stone)', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--jade)'; e.currentTarget.style.color = 'var(--jade)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,61,46,0.2)'; e.currentTarget.style.color = 'var(--stone)'; }}
            >Cancel</button>
            <button type="submit" disabled={saving}
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', padding: '0.7rem', borderRadius: 100, border: 'none', background: saving ? 'var(--stone)' : 'var(--jade)', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .2s', boxShadow: saving ? 'none' : '0 4px 16px rgba(20,122,84,0.25)' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'var(--emerald)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(20,122,84,0.35)'; }}}
              onMouseLeave={e => { if (!saving) { e.currentTarget.style.background = 'var(--jade)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,122,84,0.25)'; }}}
            >
              {saving
                ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'block' }} /> Saving…</>
                : <><Check size={16} /> {editing ? 'Save Changes' : 'Add Course'}</>
              }
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
      `}</style>
    </div>,
    document.body
  );

  /* ══════════════════════════════════════════════════════════
     PAGE
  ══════════════════════════════════════════════════════════ */
  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--forest)', margin: 0 }}>Courses</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--stone)', marginTop: 3 }}>Manage your academy courses</p>
          </div>
          <button onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9rem', padding: '0.6rem 1.25rem', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--emerald)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--jade)'}
          >
            <Plus size={16} /> Add Course
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: 14, padding: '1rem 1.25rem', border: '1px solid rgba(10,61,46,0.08)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 340 }}>
            <Search size={15} color="var(--mist)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search courses…" value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ ...inp, paddingLeft: 34 }} onFocus={fi} onBlur={fo} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Filter size={14} color="var(--stone)" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)' }}>Level:</span>
            {['', 'beginner', 'intermediate', 'advanced'].map(l => (
              <button key={l} onClick={() => { setLevelFilter(l); setCurrentPage(1); }}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500, padding: '0.3rem 0.75rem', borderRadius: 100, cursor: 'pointer', textTransform: l ? 'capitalize' : 'none', background: levelFilter === l ? 'var(--jade)' : 'rgba(10,61,46,0.05)', color: levelFilter === l ? 'white' : 'var(--stone)', border: `1.5px solid ${levelFilter === l ? 'var(--jade)' : 'rgba(10,61,46,0.12)'}`, transition: 'all .2s' }}>
                {l || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid rgba(10,61,46,0.08)', display: 'flex', gap: '1rem' }}>
                <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: 18, width: '55%' }} />
                  <div className="skeleton" style={{ height: 13, width: '40%' }} />
                  <div className="skeleton" style={{ height: 13, width: '80%' }} />
                </div>
              </div>
            ))
          ) : courses.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 14, padding: '3rem', textAlign: 'center', border: '1px solid rgba(10,61,46,0.08)' }}>
              <BookOpen size={32} color="var(--mist)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)' }}>No courses found</p>
            </div>
          ) : courses.map(course => (
            <div key={course._id}
              style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid rgba(10,61,46,0.08)', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'box-shadow .2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(10,61,46,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Thumbnail */}
              <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', background: 'var(--emerald)', flexShrink: 0 }}>
                {getImageUrl(course.image) ? (
                  <img src={getImageUrl(course.image)} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={26} color="rgba(255,255,255,0.35)" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--forest)', margin: 0 }}>{course.title}</h3>
                  <LevelBadge level={course.level} />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', marginBottom: '0.3rem' }}>
                  {course.instructor} · {course.duration} · ${course.price}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--mist)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {course.description}
                </p>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button onClick={() => openEdit(course)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1.5px solid rgba(10,61,46,0.15)', background: 'white', cursor: 'pointer', color: 'var(--stone)', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--jade)'; e.currentTarget.style.color = 'var(--jade)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,61,46,0.15)'; e.currentTarget.style.color = 'var(--stone)'; }}
                ><Edit size={14} /></button>
                <button onClick={() => handleDelete(course._id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1.5px solid rgba(180,40,40,0.2)', background: 'white', cursor: 'pointer', color: '#b42828', transition: 'all .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,40,40,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                ><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${currentPage === i + 1 ? 'var(--jade)' : 'rgba(10,61,46,0.15)'}`, background: currentPage === i + 1 ? 'var(--jade)' : 'white', color: currentPage === i + 1 ? 'white' : 'var(--stone)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all .2s' }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {modal}
    </AdminLayout>
  );
};

export default AdminCourses;