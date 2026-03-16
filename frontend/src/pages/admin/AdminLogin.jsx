import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import logo from '../../assets/quran_o_itrat_logo.png';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated()) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const inputStyle = (padLeft = 48) => ({
    width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
    color: 'white', background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 10,
    padding: `0.8rem 1rem 0.8rem ${padLeft}px`, outline: 'none',
    transition: 'border-color .2s ease, box-shadow .2s ease',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--forest)', position: 'relative', overflow: 'hidden', padding: '1.5rem',
    }}>
      {/* Geometric bg */}
      <div className="geo-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.8 }} />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(20,122,84,0.12), transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, animation: 'fadeUp .7s ease both' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '1.25rem' }}>
            <img src={logo} alt="Logo" style={{ height: 48, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={18} color="var(--gold)" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, color: 'white', margin: 0 }}>Admin Portal</h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Secure access to academy management
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', textAlign: 'center', marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '1.75rem' }}>
            Enter your credentials to sign in
          </p>

          {error && (
            <div style={{ background: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#ffaaaa' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Username */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.4rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  name="username" type="text" required
                  value={formData.username} onChange={handleChange}
                  placeholder="Enter your username"
                  style={inputStyle()}
                  onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ ...inputStyle(), paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: loading ? 'var(--stone)' : 'linear-gradient(135deg, var(--jade), var(--mint))',
              color: 'white', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem',
              padding: '0.875rem', borderRadius: 100, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem', transition: 'all .25s ease',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(20,122,84,0.35)',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(20,122,84,0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(20,122,84,0.35)'; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'block' }} />
                  Signing in…
                </>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', cursor: 'pointer', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >
            <ArrowLeft size={14} /> Back to Website
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input::placeholder{color:rgba(255,255,255,0.3)}
      `}</style>
    </div>
  );
};

export default AdminLogin;
