import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../lib/api';
import { User, Calendar, Eye, Facebook, Twitter, Link as LinkIcon, ChevronLeft, FileText } from 'lucide-react';
import SEO from '../components/SEO';

const FontInjector = () => {
  useEffect(() => {
    if (document.getElementById('ad-fonts')) return;
    const link = document.createElement('link');
    link.id = 'ad-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
  return null;
};

const Styles = () => (
  <style>{`
    .ad {
      --ink: #1a1a1a;
      --sub: #6b7280;
      --line: #e5e7eb;
      --bg: #f9fafb;
      --white: #ffffff;
      --green: #15803d;
      --green-bg: #f0fdf4;
      min-height: 100vh;
      background: var(--bg);
      font-family: 'DM Sans', system-ui, sans-serif;
      color: var(--ink);
    }

    /* nav */
    .ad-nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(249,250,251,0.92);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line);
      height: 52px;
      display: flex; align-items: center;
      padding: 0 clamp(1rem, 5vw, 2.5rem);
    }
    .ad-back {
      display: inline-flex; align-items: center; gap: 5px;
      color: var(--sub); font-size: 0.82rem; font-weight: 500;
      text-decoration: none; transition: color 0.15s;
    }
    .ad-back:hover { color: var(--ink); }

    /* main column */
    .ad-col {
      max-width: 680px;
      margin: 0 auto;
      padding: 2.75rem clamp(1rem, 5vw, 2rem) 5rem;
      display: flex; flex-direction: column; gap: 2rem;
    }

    /* category */
    .ad-cat {
      display: inline-block;
      font-size: 0.68rem; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--green); background: var(--green-bg);
      padding: 3px 9px; border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    /* title */
    .ad-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: clamp(1.75rem, 4.5vw, 2.6rem);
      font-weight: 400; line-height: 1.18;
      color: var(--ink); margin: 0 0 1.1rem;
      letter-spacing: -0.01em;
    }

    /* meta */
    .ad-meta {
      display: flex; flex-wrap: wrap;
      align-items: center; gap: 0.4rem 1rem;
      color: var(--sub); font-size: 0.78rem;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid var(--line);
    }
    .ad-meta-item { display: flex; align-items: center; gap: 4px; }
    .ad-dot { width: 3px; height: 3px; border-radius: 50%; background: #d1d5db; }

    /* body text */
    .ad-body {
      font-size: 1.02rem; line-height: 1.9;
      color: #374151;
      white-space: pre-wrap;
      word-break: break-word; overflow-wrap: break-word;
    }
    .ad-body::first-letter {
      font-family: 'DM Serif Display', serif;
      font-size: 3.2em; float: left;
      line-height: 0.82; margin: 0.08em 0.1em 0 0;
      color: var(--ink);
    }

    /* divider */
    .ad-rule { border: none; border-top: 1px solid var(--line); margin: 0; }

    /* tags */
    .ad-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .ad-tag {
      font-size: 0.74rem; color: var(--sub);
      background: var(--white); border: 1px solid var(--line);
      border-radius: 99px; padding: 4px 11px;
      transition: border-color 0.15s, color 0.15s; cursor: default;
    }
    .ad-tag:hover { border-color: #9ca3af; color: var(--ink); }

    /* share */
    .ad-share {
      display: flex; align-items: center;
      flex-wrap: wrap; gap: 0.5rem;
    }
    .ad-share-label {
      font-size: 0.76rem; color: var(--sub);
      font-weight: 500; margin-right: 2px;
    }
    .ad-share-btn {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 0.76rem; font-weight: 500;
      padding: 6px 12px; border-radius: 6px;
      border: 1px solid var(--line); background: var(--white);
      color: var(--ink); cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .ad-share-btn:hover { border-color: #9ca3af; background: #f3f4f6; }
    .ad-share-btn.ok {
      color: var(--green); border-color: #bbf7d0;
      background: var(--green-bg);
    }

    /* cta */
    .ad-cta {
      background: var(--white); border: 1px solid var(--line);
      border-radius: 8px; padding: 1.1rem 1.4rem;
      display: flex; align-items: center;
      justify-content: space-between;
      flex-wrap: wrap; gap: 0.75rem;
    }
    .ad-cta p { font-size: 0.85rem; color: var(--sub); margin: 0; }
    .ad-cta p strong { color: var(--ink); display: block; margin-bottom: 2px; }
    .ad-cta-link {
      background: var(--ink); color: #fff;
      font-size: 0.78rem; font-weight: 600;
      padding: 8px 18px; border-radius: 6px;
      text-decoration: none; white-space: nowrap;
      transition: background 0.15s;
    }
    .ad-cta-link:hover { background: #111827; }

    /* states */
    .ad-state {
      min-height: 100vh; display: flex;
      align-items: center; justify-content: center;
      background: var(--bg); flex-direction: column;
      text-align: center; gap: 0.6rem; padding: 2rem;
    }
    .ad-spinner {
      width: 32px; height: 32px; border-radius: 50%;
      border: 2px solid var(--line); border-top-color: var(--ink);
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .ad-state p { color: var(--sub); font-size: 0.85rem; }
    .ad-err-h {
      font-family: 'DM Serif Display', serif;
      font-size: 1.3rem; color: var(--ink); margin-top: 0.25rem;
    }
    .ad-err-btn {
      background: var(--ink); color: #fff;
      padding: 9px 22px; border-radius: 6px;
      border: none; cursor: pointer;
      font-size: 0.82rem; font-weight: 600;
      margin-top: 0.25rem; transition: background 0.15s;
    }
    .ad-err-btn:hover { background: #111827; }

    @keyframes up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ad-a  { animation: up 0.35s ease both; }
    .ad-a1 { animation-delay: 0.07s; }
    .ad-a2 { animation-delay: 0.14s; }
    .ad-a3 { animation-delay: 0.21s; }
  `}</style>
);

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        if (!id) throw new Error('No article ID');
        const res = await articlesAPI.getById(id);
        if (res.data?.data) setArticle(res.data.data);
        else throw new Error('Article not found');
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load.');
      } finally { setLoading(false); }
    })();
  }, [id]);

  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const doShare = (p) => {
    const url = window.location.href;
    if (p === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    else if (p === 'tw') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article?.title)}`, '_blank');
    else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (loading) return (
    <div className="ad ad-state"><FontInjector /><Styles />
      <div className="ad-spinner" /><p>Loading…</p>
    </div>
  );

  if (error || !article) return (
    <div className="ad ad-state"><FontInjector /><Styles />
      <FileText size={32} style={{ color: '#d1d5db' }} />
      <div className="ad-err-h">Article not found</div>
      <p>{error || "This article doesn't exist."}</p>
      <button className="ad-err-btn" onClick={() => navigate('/library')}>← Back to Library</button>
    </div>
  );

  return (
    <div className="ad">
      <FontInjector /><Styles />
      <SEO
        title={article.title}
        description={typeof article.content === 'string' ? article.content.substring(0, 160) : ''}
        keywords={`${article.tags?.join(', ') || ''}, ${article.category || ''}, Quran O Itrat Academy`}
        ogType="article"
      />

      {/* sticky nav */}
      <nav className="ad-nav">
        <Link to="/library" className="ad-back">
          <ChevronLeft size={14} /> Library
        </Link>
      </nav>

      <div className="ad-col">

        {/* header */}
        <header className="ad-a">
          {article.category && <div><span className="ad-cat">{article.category}</span></div>}
          <h1 className="ad-title">{article.title}</h1>
          <div className="ad-meta">
            <span className="ad-meta-item"><User size={12} />{article.author}</span>
            <span className="ad-dot" />
            <span className="ad-meta-item"><Calendar size={12} />{fmt(article.createdAt)}</span>
            <span className="ad-dot" />
            <span className="ad-meta-item"><Eye size={12} />{article.views} views</span>
          </div>
        </header>

        {/* article body */}
        <div className="ad-body ad-a ad-a1">{article.content}</div>

        {/* tags */}
        {article.tags?.length > 0 && (
          <>
            <hr className="ad-rule" />
            <div className="ad-tags ad-a ad-a2">
              {article.tags.map((t, i) => <span key={i} className="ad-tag">#{t}</span>)}
            </div>
          </>
        )}

        {/* share */}
        <div className="ad-share ad-a ad-a2">
          <span className="ad-share-label">Share —</span>
          <button className="ad-share-btn" onClick={() => doShare('fb')}>
            <Facebook size={12} /> Facebook
          </button>
          <button className="ad-share-btn" onClick={() => doShare('tw')}>
            <Twitter size={12} /> Twitter
          </button>
          <button className={`ad-share-btn${copied ? ' ok' : ''}`} onClick={() => doShare('copy')}>
            <LinkIcon size={12} /> {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* cta */}
        <div className="ad-cta ad-a ad-a3">
          <p>
            <strong>Explore Quran O Itrat Academy</strong>
            Deepen your knowledge with our courses and lectures.
          </p>
          <Link to="/courses" className="ad-cta-link">View courses →</Link>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetail;