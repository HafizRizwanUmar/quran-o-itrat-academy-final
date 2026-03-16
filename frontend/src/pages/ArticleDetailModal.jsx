import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { articlesAPI } from '../lib/api';
import { FileText, User, Calendar, Eye, Tag } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader>
          {loading && <DialogTitle>Loading Article...</DialogTitle>}
          {error && <DialogTitle className="text-red-500">Error</DialogTitle>}
          {article && (
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {article.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{article.views} views</span>
                </div>
                {article.category && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {article.category}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogHeader>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        ) : article ? (
          <div className="grid gap-6 py-4">
            {article.featuredImage && (
              <div className="w-full">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="prose prose-gray max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '100%',
                  width: '100%'
                }}
              >
                {article.content}
              </div>
            </div>
            
            {article.tags && article.tags.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center mb-2">
                  <Tag className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onClose} variant="outline" className="mr-2">
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDetailModal;

