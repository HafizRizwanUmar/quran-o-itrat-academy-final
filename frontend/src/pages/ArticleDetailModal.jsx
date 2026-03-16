import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { articlesAPI } from '../lib/api';
import { FileText, User, Calendar, Eye, Tag, X, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const ArticleDetailModal = ({ articleId, isOpen, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && articleId) {
      setArticle(null);
      const fetchArticleDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await articlesAPI.getById(articleId);
          setArticle(response.data.data);
        } catch (err) {
          console.error('Error fetching article details:', err);
          setError('Failed to load article details. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchArticleDetail();
    }
  }, [isOpen, articleId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 
        KEY FIXES:
        1. Full-viewport overlay with high z-index so nothing bleeds through
        2. Proper scrollable container inside — not on DialogContent itself
        3. Removed transparent/shadow-none hacks that broke stacking context
        4. Clean two-column layout: sticky sidebar meta + scrollable content
      */}
      <DialogContent
        className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/60 backdrop-blur-sm
          p-4 sm:p-8
        "
        style={{
          maxWidth: '100vw',
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        {/* Modal Card */}
        <div
          className="
            relative w-full max-w-4xl max-h-[92vh]
            bg-white rounded-2xl shadow-2xl
            flex flex-col overflow-hidden
          "
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {/* ── Hero Banner ───────────────────────────────── */}
          <div className="relative h-52 sm:h-64 flex-shrink-0 bg-[#0a3d2e] overflow-hidden">
            {article?.featuredImage ? (
              <img
                src={article.featuredImage}
                alt={article?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {/* Subtle geometric pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <FileText className="h-14 w-14 text-[#c9a84c]/50 relative z-10" />
              </div>
            )}

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,61,46,0.95) 0%, rgba(10,61,46,0.4) 55%, transparent 100%)',
              }}
            />

            {/* Title area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              {article?.category && (
                <span
                  className="inline-block mb-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#c9a84c', color: '#fff' }}
                >
                  {article.category}
                </span>
              )}
              <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">
                {loading ? 'Loading…' : article?.title || '—'}
              </h1>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close article"
              className="
                absolute top-4 right-4 z-20
                p-2 rounded-full
                bg-black/40 hover:bg-black/65
                text-white border border-white/20
                transition-all backdrop-blur-sm
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div
                  className="h-10 w-10 rounded-full border-2 border-[#147a54] border-t-transparent animate-spin"
                />
                <p className="mt-4 text-sm text-[#4a6357]">Preparing article…</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <div className="bg-red-50 text-red-600 px-5 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
                <Button
                  onClick={onClose}
                  className="bg-[#147a54] hover:bg-[#0d5c40] text-white px-8 rounded-full"
                >
                  Return to Library
                </Button>
              </div>
            ) : article ? (
              <div className="p-6 sm:p-10 space-y-8">

                {/* Meta row */}
                <div
                  className="
                    flex flex-wrap items-center gap-6
                    py-4 border-y text-sm
                  "
                  style={{ borderColor: '#e8ede9', color: '#4a6357' }}
                >
                  {/* Author */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(20,122,84,0.1)' }}
                    >
                      <User className="h-4 w-4 text-[#147a54]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#8aa89a] leading-none mb-0.5">
                        Author
                      </p>
                      <p className="font-semibold text-[#0e1a14] text-sm">{article.author}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(20,122,84,0.1)' }}
                    >
                      <Calendar className="h-4 w-4 text-[#147a54]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#8aa89a] leading-none mb-0.5">
                        Published
                      </p>
                      <p className="font-semibold text-[#0e1a14] text-sm">
                        {formatDate(article.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Views — pushed to the right */}
                  <div className="flex items-center gap-1.5 sm:ml-auto text-[#8aa89a]">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium text-[#0e1a14]">{article.views}</span>
                    <span className="text-xs">views</span>
                  </div>
                </div>

                {/* Article content */}
                <div
                  className="text-[#1c2e24] leading-relaxed text-base sm:text-lg"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {article.content}
                </div>

                {/* Tags */}
                {article.tags?.length > 0 && (
                  <div className="pt-6 border-t" style={{ borderColor: '#e8ede9' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-3.5 w-3.5 text-[#147a54]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0e1a14]">
                        Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: '#f0f5f2',
                            color: '#4a6357',
                            border: '1px solid #d4e3d9',
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer CTA */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm text-[#4a6357] hover:text-[#147a54] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Library
                  </button>
                  <Button
                    onClick={onClose}
                    className="
                      bg-[#0a3d2e] hover:bg-[#147a54]
                      text-white px-8 py-2.5 rounded-full
                      text-sm font-semibold
                      shadow-md hover:shadow-lg
                      transition-all
                    "
                  >
                    Done Reading
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDetailModal;