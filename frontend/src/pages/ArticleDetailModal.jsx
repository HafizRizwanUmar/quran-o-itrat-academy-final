import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { articlesAPI } from '../lib/api';
import { FileText, User, Calendar, Eye, Tag, X } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const ArticleDetailModal = ({ articleId, isOpen, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && articleId) {
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
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 border-none !bg-transparent !shadow-none"
        style={{ backgroundColor: 'transparent', boxShadow: 'none', direction: 'ltr' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 m-2 sm:m-0" style={{ backgroundColor: '#ffffff', minHeight: '100%' }}>
          {/* Header */}
          <div className="relative h-56 sm:h-72 w-full bg-[#0a3d2e]">
            {article?.featuredImage ? (
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                 <div className="geo-pattern absolute inset-0 opacity-20" />
                 <FileText className="h-16 w-16 text-[#c9a84c]/40" />
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' }} />
            
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full z-10 text-left">
              {article?.category && (
                 <Badge className="mb-4 bg-[#c9a84c] text-white border-none py-1 px-3 hover:bg-[#e8c96a]">
                   {article.category}
                 </Badge>
              )}
              <h1 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
                {article?.title || 'Loading Article...'}
              </h1>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-md border border-white/20"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#147a54]"></div>
                <p className="mt-4 text-[#4a6357] font-body">Preparing article content...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-6 font-body">{error}</div>
                <br />
                <Button onClick={onClose} className="bg-[#147a54] hover:bg-[#0d5c40] text-white px-8">Return to Library</Button>
              </div>
            ) : article ? (
              <div className="space-y-10">
                {/* Meta Info Section */}
                <div className="flex flex-wrap items-center gap-8 py-5 border-y border-gray-100 text-sm text-[#4a6357] font-body">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#147a54]/10 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-[#147a54]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#8aa89a] font-bold leading-none mb-1">Author</p>
                      <p className="font-semibold text-[#0e1a14]">{article.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#147a54]/10 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-[#147a54]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#8aa89a] font-bold leading-none mb-1">Date</p>
                      <p className="font-semibold text-[#0e1a14]">{formatDate(article.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center sm:ml-auto">
                    <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full font-medium">
                      <Eye className="h-4 w-4 mr-2 text-[#8aa89a]" />
                      <span>{article.views} <span className="text-[#8aa89a] font-normal">views</span></span>
                    </div>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="article-body">
                  <div 
                    className="text-[#1c2e24] text-lg sm:text-xl leading-relaxed space-y-6 font-body"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {article.content}
                  </div>
                </div>
                
                {/* Tags Footer */}
                {article.tags && article.tags.length > 0 && (
                  <div className="pt-10 border-t border-gray-50">
                    <div className="flex items-center mb-5">
                      <Tag className="h-4 w-4 mr-2 text-[#147a54]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0e1a14]">Article Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {article.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="px-4 py-1.5 bg-gray-50 text-[#4a6357] border-gray-100 hover:bg-[#147a54]/5 transition-colors text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center pt-8 pb-4">
                  <Button 
                    onClick={onClose} 
                    className="bg-[#0a3d2e] hover:bg-[#0d5c40] text-white px-10 py-7 rounded-full font-body font-semibold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
                  >
                    Finished Reading
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
