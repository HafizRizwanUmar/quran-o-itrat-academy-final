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
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 border-none !bg-white"
        style={{ backgroundColor: 'white', direction: 'ltr' }}
      >
        {/* Header Header */}
        <div className="relative h-48 sm:h-64 w-full">
          {article?.featuredImage ? (
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-forest flex items-center justify-center relative overflow-hidden">
               <div className="geo-pattern absolute inset-0 opacity-20" />
               <FileText className="h-16 w-16 text-gold/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
            {article?.category && (
               <Badge className="mb-3 bg-gold text-white border-none hover:bg-gold-light">
                 {article.category}
               </Badge>
            )}
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              {article?.title || 'Loading Article...'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade"></div>
              <p className="mt-4 text-stone font-body">Preparing article content...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-body">{error}</p>
              <Button onClick={onClose} className="mt-6 bg-jade hover:bg-emerald">Return to Library</Button>
            </div>
          ) : article ? (
            <div className="space-y-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/50 text-sm text-stone font-body">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-jade/10 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-jade" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-mist font-semibold leading-none mb-1">Author</p>
                    <p className="font-medium text-forest">{article.author}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-jade/10 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-jade" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-mist font-semibold leading-none mb-1">Published</p>
                    <p className="font-medium text-forest">{formatDate(article.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center ml-auto">
                  <Eye className="h-4 w-4 mr-1.5 text-mist" />
                  <span className="font-medium">{article.views} <span className="text-mist font-normal">views</span></span>
                </div>
              </div>
              
              {/* Content Body */}
              <div className="article-content">
                <div 
                  className="text-gray-800 text-lg leading-relaxed space-y-4 font-body"
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
              
              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-8 border-t border-border/50">
                  <div className="flex items-center mb-4">
                    <Tag className="h-4 w-4 mr-2 text-jade" />
                    <span className="text-xs font-bold uppercase tracking-widest text-forest">Reference Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="px-3 py-1 bg-jade/5 text-jade border-jade/10 hover:bg-jade/10 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center pt-8">
                <Button 
                  onClick={onClose} 
                  className="bg-forest hover:bg-emerald text-white px-8 py-6 rounded-full font-body font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Finished Reading
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDetailModal;
