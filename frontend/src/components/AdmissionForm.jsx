import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, CheckCircle, User, Mail, Phone, Calendar, Users, BookOpen, MessageSquare, ChevronDown } from 'lucide-react';
import { admissionAPI } from '../lib/api';

const inp = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--ink)',
  background: 'var(--cream)',
  border: '1.5px solid rgba(10,61,46,0.15)',
  borderRadius: 8,
  padding: '0.65rem 0.875rem',
  outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
  boxSizing: 'border-box',
};

const focusIn  = e => { e.target.style.borderColor = 'var(--jade)'; e.target.style.boxShadow = '0 0 0 3px rgba(20,122,84,0.08)'; };
const focusOut = e => { e.target.style.borderColor = 'rgba(10,61,46,0.15)'; e.target.style.boxShadow = 'none'; };

const Field = ({ label, required, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label} {required && <span style={{ color: 'var(--jade)' }}>*</span>}
    </label>
    {children}
  </div>
);

const AdmissionForm = ({ courseId, courseName, onClose }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '',
    gender: '', educationLevel: '', previousExperience: '', motivation: ''
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await admissionAPI.submit({ ...formData, courseId, age: formData.age ? parseInt(formData.age) : undefined });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ────────────────────────────────────────────────
  const successContent = (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '2.5rem 2rem', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', animation: 'fadeUp .4s ease' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(20,122,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle size={36} color="var(--jade)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--forest)', margin: '0 0 0.5rem' }}>Application Sent!</h2>
        <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1rem', color: 'rgba(201,168,76,0.8)', margin: '0 0 0.75rem' }}>جَزَاكَ اللَّهُ خَيْرًا</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--stone)', lineHeight: 1.7, margin: '0 0 1.75rem' }}>
          Your application for <strong style={{ color: 'var(--jade)' }}>"{courseName}"</strong> has been submitted successfully. We will contact you within 2–3 business days, in sha Allah.
        </p>
        <button onClick={onClose} style={{ width: '100%', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', padding: '0.8rem', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--emerald)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--jade)'}
        >
          Close
        </button>
      </div>
    </div>
  );

  // ── Form modal ───────────────────────────────────────────────────
  const formContent = (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 620, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.22)', animation: 'fadeUp .35s ease' }}>

        {/* Modal header */}
        <div style={{ background: 'var(--forest)', padding: '1.25rem 1.5rem', position: 'relative', flexShrink: 0 }}>
          <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <GraduationCap size={18} color="var(--gold)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'white', margin: 0 }}>
                  Apply for Admission
                </h2>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                Course: <span style={{ color: 'var(--gold-light)', fontWeight: 500 }}>{courseName}</span>
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0, transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Gold bar */}
        <div style={{ height: 3, background: 'linear-gradient(to right, var(--forest), var(--gold), var(--gold-light), var(--gold), var(--forest))', flexShrink: 0 }} />

        {/* Scrollable form body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {error && (
              <div style={{ background: 'rgba(180,40,40,0.07)', border: '1px solid rgba(180,40,40,0.2)', borderRadius: 8, padding: '0.75rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#b42828' }}>
                {error}
              </div>
            )}

            {/* Row 1: Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <Field label="Full Name" required>
                <div style={{ position: 'relative' }}>
                  <User size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input name="name" required value={formData.name} onChange={handleChange}
                    style={{ ...inp, paddingLeft: 32 }} placeholder="Your full name"
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
              </Field>
              <Field label="Email Address" required>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange}
                    style={{ ...inp, paddingLeft: 32 }} placeholder="your@email.com"
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
              </Field>
            </div>

            {/* Row 2: Phone + Age */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <Field label="Phone Number" required>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input name="phone" required value={formData.phone} onChange={handleChange}
                    style={{ ...inp, paddingLeft: 32 }} placeholder="+92 3XX XXX XXXX"
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
              </Field>
              <Field label="Age">
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type="number" name="age" value={formData.age} onChange={handleChange}
                    style={{ ...inp, paddingLeft: 32 }} placeholder="Your age" min="5" max="100"
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
              </Field>
            </div>

            {/* Row 3: Gender + Education */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <Field label="Gender" required>
                <div style={{ position: 'relative' }}>
                  <Users size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                  <ChevronDown size={14} color="var(--mist)" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <select name="gender" required value={formData.gender} onChange={handleChange}
                    style={{ ...inp, paddingLeft: 32, paddingRight: 30, appearance: 'none', cursor: 'pointer' }}
                    onFocus={focusIn} onBlur={focusOut}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </Field>
              <Field label="Education Level" required>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={14} color="var(--mist)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                  <ChevronDown size={14} color="var(--mist)" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <select name="educationLevel" required value={formData.educationLevel} onChange={handleChange}
                    style={{ ...inp, paddingLeft: 32, paddingRight: 30, appearance: 'none', cursor: 'pointer' }}
                    onFocus={focusIn} onBlur={focusOut}>
                    <option value="">Select level</option>
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary / High School</option>
                    <option value="undergraduate">Undergraduate / Bachelor's</option>
                    <option value="graduate">Graduate / Master's / PhD</option>
                    <option value="madrasa">Madrasa Background</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </Field>
            </div>

            {/* Islamic Experience */}
            <Field label="Islamic Education Experience">
              <textarea name="previousExperience" value={formData.previousExperience} onChange={handleChange}
                style={{ ...inp, resize: 'vertical', minHeight: 72, lineHeight: 1.6 }} rows={2}
                placeholder="Any prior Quran / Islamic education (optional)…"
                onFocus={focusIn} onBlur={focusOut} />
            </Field>

            {/* Motivation */}
            <Field label="Why do you want to join this course?" required>
              <textarea name="motivation" required value={formData.motivation} onChange={handleChange}
                style={{ ...inp, resize: 'vertical', minHeight: 90, lineHeight: 1.6 }} rows={3}
                placeholder="Share your motivation and what you hope to achieve…"
                onFocus={focusIn} onBlur={focusOut} />
            </Field>

            {/* Footer buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9rem', padding: '0.7rem', borderRadius: 100, border: '1.5px solid rgba(10,61,46,0.2)', background: 'white', color: 'var(--stone)', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--jade)'; e.currentTarget.style.color = 'var(--jade)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,61,46,0.2)'; e.currentTarget.style.color = 'var(--stone)'; }}
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', padding: '0.7rem', borderRadius: 100, border: 'none', background: loading ? 'var(--stone)' : 'var(--jade)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s', boxShadow: loading ? 'none' : '0 4px 16px rgba(20,122,84,0.25)' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--emerald)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(20,122,84,0.35)'; }}}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'var(--jade)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,122,84,0.25)'; }}}
              >
                {loading ? (
                  <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'block' }} /> Submitting…</>
                ) : (
                  <><GraduationCap size={16} /> Submit Application</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @media(max-width: 540px) {
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(success ? successContent : formContent, document.body);
};

export default AdmissionForm;