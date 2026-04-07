import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, BookOpen, CheckCircle, Users, Star, MessageCircle, Award } from 'lucide-react';
import { coursesAPI } from '../lib/api';
import AdmissionForm from '../components/AdmissionForm';

const getLevelStyle = (level) => {
  const map = {
    beginner:     { bg: 'rgba(20,122,84,0.08)',  color: '#147a54', border: 'rgba(20,122,84,0.2)' },
    intermediate: { bg: 'rgba(201,168,76,0.10)', color: '#8a6d1a', border: 'rgba(201,168,76,0.3)' },
    advanced:     { bg: 'rgba(180,40,40,0.08)',  color: '#b42828', border: 'rgba(180,40,40,0.2)' },
  };
  return map[level] || { bg: 'rgba(100,100,100,0.08)', color: '#555', border: 'rgba(100,100,100,0.2)' };
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const res = await coursesAPI.getById(id);
        setCourse(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleWhatsApp = () => {
    const msg = `Hello! I am interested in the course: ${course?.title}`;
    window.open(`https://wa.me/923280563616?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--warm-white)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 20, width: 120, marginBottom: '2rem', borderRadius: 8 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
            <div>
              <div className="skeleton" style={{ height: 360, borderRadius: 16, marginBottom: '1.5rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="skeleton" style={{ height: 36, width: '70%' }} />
                <div className="skeleton" style={{ height: 16, width: '45%' }} />
                <div className="skeleton" style={{ height: 14 }} />
                <div className="skeleton" style={{ height: 14 }} />
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
              </div>
            </div>
            <div className="skeleton" style={{ height: 420, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--warm-white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={48} color="var(--mist)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', marginBottom: '0.5rem' }}>Course not found</h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', marginBottom: '1.5rem' }}>This course doesn't exist or has been removed.</p>
          <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, padding: '0.65rem 1.5rem', borderRadius: 100, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const levelStyle = getLevelStyle(course.level);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Breadcrumb */}
        <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jade)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem', transition: 'gap .2s' }}
          onMouseEnter={e => e.currentTarget.style.gap = '0.65rem'}
          onMouseLeave={e => e.currentTarget.style.gap = '0.4rem'}
        >
          <ArrowLeft size={15} /> Back to Courses
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }} className="detail-grid">

          {/* LEFT COLUMN */}
          <div>
            {/* Course hero image */}
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: '2rem', position: 'relative', background: 'var(--forest)', aspectRatio: '16/7' }}>
              {course.image ? (
                <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', minHeight: 260 }}>
                  <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
                  <BookOpen size={48} color="rgba(255,255,255,0.25)" style={{ position: 'relative' }} />
                  <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.2rem', color: 'rgba(201,168,76,0.6)', position: 'relative' }}>اقْرَأْ</p>
                </div>
              )}
              {/* Gradient overlay at bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(10,61,46,0.6), transparent)' }} />
              {/* Level badge over image */}
              {course.level && (
                <span style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-body)', padding: '0.3rem 0.85rem', borderRadius: 100, color: levelStyle.color, textTransform: 'capitalize' }}>
                  {course.level}
                </span>
              )}
            </div>

            {/* Title & meta */}
            <div style={{ marginBottom: '1.75rem' }}>
              {course.category && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--jade)', background: 'rgba(20,122,84,0.07)', padding: '0.25rem 0.75rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem' }}>
                  {course.category}
                </span>
              )}
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 600, color: 'var(--forest)', lineHeight: 1.2, marginBottom: '1rem' }}>
                {course.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--stone)' }}>
                {course.instructor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={15} color="var(--jade)" />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>{course.instructor}</span>
                  </div>
                )}
                {course.duration && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="var(--jade)" />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>{course.duration}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={15} fill="var(--gold)" color="var(--gold)" />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--charcoal)' }}>4.9</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--mist)' }}>(200+ enrolled)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid rgba(10,61,46,0.08)', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>About This Course</h2>
              <div className="gold-line" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--stone)', lineHeight: 1.8, marginTop: '1rem' }}>
                {course.description}
              </p>
            </div>

            {/* Syllabus */}
            {course.syllabus?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid rgba(10,61,46,0.08)', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>Course Syllabus</h2>
                <div className="gold-line" />
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {course.syllabus.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <CheckCircle size={17} color="var(--jade)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--charcoal)', lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features grid */}
            <div style={{ background: 'var(--cream)', borderRadius: 16, padding: '1.75rem', border: '1px solid rgba(10,61,46,0.08)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>What's Included</h2>
              <div className="gold-line" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginTop: '1.25rem' }}>
                {[
                  { Icon: Clock, text: `Duration: ${course.duration || 'Flexible'}` },
                  { Icon: User, text: 'Expert Instructor' },
                  { Icon: BookOpen, text: 'Comprehensive Materials' },
                  { Icon: Award, text: 'Certificate of Completion' },
                ].map(({ Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(20,122,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="var(--jade)" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--charcoal)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ position: 'sticky', top: 96 }}>
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(10,61,46,0.08)', boxShadow: '0 8px 40px rgba(10,61,46,0.1)', overflow: 'hidden' }}>
              {/* Price header */}
              <div style={{ background: 'var(--forest)', padding: '1.75rem', textAlign: 'center', position: 'relative' }}>
                <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </div>
                  {course.price > 0 && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>One-time payment</p>}
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => {
                  console.log('Button clicked: Apply for Admission');
                  setShowAdmissionForm(true);
                }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', padding: '0.875rem', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'all .25s ease', boxShadow: '0 4px 16px rgba(20,122,84,0.25)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--emerald)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(20,122,84,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--jade)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,122,84,0.25)'; }}
                >
                  <Users size={17} /> Apply for Admission
                </button>

                <button onClick={handleWhatsApp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(37,211,102,0.08)', color: '#128C7E', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9375rem', padding: '0.75rem', borderRadius: 100, border: '1.5px solid rgba(37,211,102,0.25)', cursor: 'pointer', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.08)'; }}
                >
                  <MessageCircle size={17} /> Ask on WhatsApp
                </button>
              </div>

              {/* Details */}
              <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ borderTop: '1px solid rgba(10,61,46,0.07)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Level', value: course.level, isLevel: true },
                    { label: 'Duration', value: course.duration },
                    { label: 'Instructor', value: course.instructor },
                    { label: 'Category', value: course.category || 'Islamic Studies' },
                  ].filter(r => r.value).map(({ label, value, isLevel }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'var(--stone)' }}>{label}</span>
                      {isLevel ? (
                        <span style={{ background: levelStyle.bg, color: levelStyle.color, border: `1px solid ${levelStyle.border}`, fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 100, textTransform: 'capitalize' }}>{value}</span>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', fontWeight: 500, color: 'var(--charcoal)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(10,61,46,0.07)', paddingTop: '1rem', marginTop: '0.75rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--mist)', marginBottom: '0.35rem' }}>Have questions?</p>
                  <Link to="/contact" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--jade)', textDecoration: 'none', fontWeight: 500 }}>Contact us for more information →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdmissionForm && (
        <AdmissionForm courseId={course._id} courseName={course.title} onClose={() => setShowAdmissionForm(false)} />
      )}

      <style>{`
        @media(max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;
