import { useState, useEffect } from 'react';
import { Users, BookOpen, Library, FileText, MessageSquare, GraduationCap, TrendingUp, Clock, Activity, Download, Eye, Plus, ArrowUpRight, Upload, BarChart3 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../lib/api';
import { Link } from 'react-router-dom';

const card = { background: 'white', borderRadius: 14, border: '1px solid rgba(10,61,46,0.08)', boxShadow: '0 2px 12px rgba(10,61,46,0.05)' };
const label = { fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em' };

const STAT_COLORS = [
  { bg: 'rgba(20,122,84,0.08)', icon: 'rgba(20,122,84,1)', dot: 'var(--jade)' },
  { bg: 'rgba(29,111,163,0.08)', icon: '#1d6fa3', dot: '#1d6fa3' },
  { bg: 'rgba(124,77,184,0.08)', icon: '#7c4db8', dot: '#7c4db8' },
  { bg: 'rgba(201,122,42,0.08)', icon: '#c97a2a', dot: '#c97a2a' },
];

const ACTIVITY_COLORS = {
  contact:   { bg: 'rgba(29,111,163,0.08)',  color: '#1d6fa3' },
  admission: { bg: 'rgba(20,122,84,0.08)',   color: 'var(--jade)' },
  course:    { bg: 'rgba(124,77,184,0.08)',  color: '#7c4db8' },
  library:   { bg: 'rgba(201,122,42,0.08)',  color: '#c97a2a' },
};

const ACTIVITY_ICONS = { contact: MessageSquare, admission: GraduationCap, course: BookOpen, library: Library };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getDashboardStats(), adminAPI.getRecentActivity({ limit: 8 })])
      .then(([s, a]) => { setStats(s.data.data); setRecentActivity(a.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Students',  value: stats?.totalStudents || 0,          Icon: Users,        change: '+12%', ...STAT_COLORS[0] },
    { title: 'Active Courses',  value: stats?.totalCourses || 0,           Icon: BookOpen,     change: '+8%',  ...STAT_COLORS[1] },
    { title: 'Library Items',   value: stats?.totalLibraryMaterials || 0,  Icon: Library,      change: '+15%', ...STAT_COLORS[2] },
    { title: 'New Messages',    value: stats?.totalContacts || 0,           Icon: MessageSquare,change: '+3%',  ...STAT_COLORS[3] },
  ];

  const quickActions = [
    { title: 'Add New Course',    desc: 'Create and publish a course',       Icon: Plus,     href: '/admin/courses',         color: 'var(--jade)' },
    { title: 'Upload to Library', desc: 'Add digital resources',             Icon: Upload,   href: '/admin/library',         color: '#1d6fa3' },
    { title: 'View Admissions',   desc: 'Review student applications',       Icon: GraduationCap, href: '/admin/admissions', color: '#7c4db8' },
    { title: 'Study Materials',   desc: 'Manage course files',               Icon: FileText, href: '/admin/study-materials', color: '#c97a2a' },
    { title: 'Write Article',     desc: 'Publish blog content',              Icon: Eye,      href: '/admin/articles',        color: '#147a54' },
    { title: 'Contact Forms',     desc: 'Reply to enquiries',                Icon: MessageSquare, href: '/admin/contacts',    color: '#b42828' },
  ];

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {[...Array(4)].map((_, i) => <div key={i} style={{ ...card, padding: '1.5rem', height: 110 }}><div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 12 }} /><div className="skeleton" style={{ height: 32, width: '40%' }} /></div>)}
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

        {/* Welcome banner */}
        <div style={{ background: 'var(--forest)', borderRadius: 16, padding: '1.75rem 2rem', position: 'relative', overflow: 'hidden' }}>
          <div className="geo-pattern" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="arabic" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1rem', color: 'rgba(201,168,76,0.75)', marginBottom: '0.4rem' }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'white', margin: 0 }}>Welcome back, Admin</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.25rem' }}>Here's what's happening with your academy today.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[{ v: stats?.totalAdmissions || 0, l: 'Admissions' }, { v: stats?.totalStudyMaterials || 0, l: 'Materials' }].map(({ v, l }) => (
                <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.75rem 1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'white' }}>{v}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
          {statCards.map(({ title, value, Icon, change, bg, icon, dot }) => (
            <div key={title} style={{ ...card, padding: '1.5rem', transition: 'box-shadow .3s, transform .3s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(10,61,46,0.11)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={label}>{title}</span>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={icon} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--forest)', lineHeight: 1, marginBottom: '0.4rem' }}>{value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <TrendingUp size={11} color={dot} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: dot, fontWeight: 500 }}>{change} this month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--forest)', marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
            {quickActions.map(({ title, desc, Icon, href, color }) => (
              <Link key={href} to={href} style={{ ...card, padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', transition: 'box-shadow .3s, transform .3s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(10,61,46,0.11)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,61,46,0.05)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--forest)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--mist)', marginTop: 2 }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity + Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="dash-grid">

          {/* Recent activity */}
          <div style={{ ...card, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--forest)', margin: 0 }}>Recent Activity</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.775rem', color: 'var(--mist)', marginTop: 2 }}>Latest updates across the academy</p>
              </div>
              <Activity size={16} color="var(--mist)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentActivity.length > 0 ? recentActivity.slice(0, 6).map((act, i) => {
                const Icon = ACTIVITY_ICONS[act.type] || Activity;
                const c = ACTIVITY_COLORS[act.type] || { bg: 'rgba(100,100,100,0.07)', color: '#555' };
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: 10, background: 'var(--cream)', transition: 'background .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,122,84,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={c.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--charcoal)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.description}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--mist)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: 2 }}>
                        <Clock size={9} />{new Date(act.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>
                  <Activity size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* System overview */}
          <div style={{ ...card, padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--forest)', margin: '0 0 0.35rem' }}>System Overview</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.775rem', color: 'var(--mist)', marginBottom: '1.25rem' }}>Current system status and metrics</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'System Status', value: 'Online',     dot: 'var(--sage)',  badge: { bg: 'rgba(20,122,84,0.08)', color: 'var(--jade)' } },
                { label: 'Database',      value: 'Connected',  dot: '#1d6fa3',       badge: { bg: 'rgba(29,111,163,0.08)', color: '#1d6fa3' } },
                { label: 'Storage Usage', value: '2.4 GB / 10 GB', dot: '#c97a2a', badge: null },
                { label: 'Last Backup',   value: '2 hours ago', dot: '#7c4db8',     badge: null },
              ].map(({ label: lbl, value, dot, badge }) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(10,61,46,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'var(--charcoal)', fontWeight: 500 }}>{lbl}</span>
                  </div>
                  {badge ? (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, background: badge.bg, color: badge.color, padding: '0.2rem 0.65rem', borderRadius: 100 }}>{value}</span>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)' }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'var(--jade)', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.875rem', padding: '0.7rem', borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--emerald)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--jade)'}
            >
              <Download size={15} /> Generate Report
            </button>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.dash-grid{grid-template-columns:1fr !important}}`}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
