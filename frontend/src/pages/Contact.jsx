import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Star, Users, BookOpen, Award } from 'lucide-react';
import { contactAPI } from '../lib/api';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: MapPin, title: 'Our Location', lines: ['Q Block Model Town', 'Lahore, Pakistan'], accent: 'var(--jade)' },
    { icon: Phone, title: 'Phone', lines: ['+92 328 056 3616'], accent: '#1d6fa3' },
    { icon: Mail, title: 'Email', lines: ['academyquranoitrat@gmail.com'], accent: '#7c4db8' },
    { icon: Clock, title: 'Availability', lines: ['24/7 Available', 'Always here to help'], accent: 'var(--gold)' },
  ];

  const inputStyle = {
    width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
    color: 'var(--ink)', background: 'var(--cream)',
    border: '1.5px solid rgba(10,61,46,0.12)', borderRadius: 10,
    padding: '0.75rem 1rem', outline: 'none', transition: 'border-color .2s ease, box-shadow .2s ease',
  };

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--jade)'; e.target.style.boxShadow = '0 0 0 3px rgba(20,122,84,0.08)'; };
  const handleBlur = (e) => { e.target.style.borderColor = 'rgba(10,61,46,0.12)'; e.target.style.boxShadow = 'none'; };

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
          <div className="badge-emerald" style={{ marginBottom: '1.25rem', display: 'inline-flex', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-light)', borderColor: 'rgba(201,168,76,0.25)' }}>
            Get in Touch
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem' }}>
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right,var(--gold),var(--gold-light))', borderRadius: 2, margin: '0 auto 1.25rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.65)', maxWidth: 480, margin: '0 auto' }}>
            We'd love to hear from you. Reach out for admissions, queries, or anything else.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Contact info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {contactCards.map(({ icon: Icon, title, lines, accent }, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(10,61,46,0.07)', boxShadow: '0 2px 12px rgba(10,61,46,0.05)', transition: 'box-shadow .3s ease, transform .3s ease', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,61,46,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Icon size={22} color={accent} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.5rem' }}>{title}</h4>
              {lines.map((l, j) => (
                <p key={j} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'var(--stone)', lineHeight: 1.6 }}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Form + Map grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="contact-grid">

          {/* Form */}
          <div style={{ background: 'white', borderRadius: 20, padding: '2.5rem', border: '1px solid rgba(10,61,46,0.08)', boxShadow: '0 4px 24px rgba(10,61,46,0.07)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>Send a Message</h2>
            <div className="gold-line" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--stone)', margin: '1rem 0 2rem', lineHeight: 1.65 }}>
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            {success ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(20,122,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle size={28} color="var(--jade)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', marginBottom: '1.5rem' }}>Thank you for reaching out. We'll respond shortly.</p>
                <button onClick={() => setSuccess(false)} style={{ background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, padding: '0.65rem 1.75rem', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                  ].map(({ name, label, type, required }) => (
                    <div key={name}>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--charcoal)', display: 'block', marginBottom: '0.4rem' }}>
                        {label} {required && <span style={{ color: 'var(--jade)' }}>*</span>}
                      </label>
                      <input name={name} type={type} required={required} value={formData[name]} onChange={handleChange} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                  ))}
                </div>
                {[
                  { name: 'phone', label: 'Phone Number', type: 'tel' },
                  { name: 'subject', label: 'Subject', type: 'text', required: true },
                ].map(({ name, label, type, required }) => (
                  <div key={name}>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--charcoal)', display: 'block', marginBottom: '0.4rem' }}>
                      {label} {required && <span style={{ color: 'var(--jade)' }}>*</span>}
                    </label>
                    <input name={name} type={type} required={required} value={formData[name]} onChange={handleChange} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--charcoal)', display: 'block', marginBottom: '0.4rem' }}>
                    Message <span style={{ color: 'var(--jade)' }}>*</span>
                  </label>
                  <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                {error && (
                  <div style={{ background: 'rgba(180,40,40,0.08)', border: '1px solid rgba(180,40,40,0.2)', borderRadius: 8, padding: '0.75rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#b42828' }}>
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: loading ? 'var(--stone)' : 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', padding: '0.85rem', borderRadius: 100, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s ease', marginTop: '0.5rem' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--emerald)'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--jade)'; }}
                >
                  {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Map placeholder */}
            <div style={{ borderRadius: 20, overflow: 'hidden', height: 280, background: 'var(--forest)', position: 'relative', border: '1px solid rgba(10,61,46,0.1)' }}>
              <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <MapPin size={36} color="var(--gold)" />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', textAlign: 'center' }}>Q Block Model Town<br />Lahore, Pakistan</p>
                <a href="https://maps.google.com/?q=Model+Town+Lahore" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'white', color: 'var(--jade)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, padding: '0.5rem 1.25rem', borderRadius: 100, textDecoration: 'none', marginTop: '0.5rem' }}>
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ background: 'var(--cream)', borderRadius: 20, padding: '1.75rem', border: '1px solid rgba(10,61,46,0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>Why Contact Us?</h3>
              <div className="gold-line" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
                {[
                  { Icon: Users, label: '1000+ Students Enrolled' },
                  { Icon: BookOpen, label: '50+ Courses Available' },
                  { Icon: Award, label: 'Certified Faculty' },
                  { Icon: Star, label: '98% Satisfaction Rate' },
                ].map(({ Icon, label }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(20,122,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="var(--jade)" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--charcoal)', fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Contact;
