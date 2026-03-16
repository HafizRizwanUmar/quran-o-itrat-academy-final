import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../lib/api';
import { FileText, User, Calendar, Eye, Tag, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon, ChevronLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      console.log('ArticleDetail: Fetching for ID:', id);
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error('No article ID provided');
        const response = await articlesAPI.getById(id);
        console.log('ArticleDetail: API Response:', response.data);
        if (response.data && response.data.data) {
          setArticle(response.data.data);
        } else {
          throw new Error('Article data not found in response');
        }
        // Scroll to top when page opens
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('ArticleDetail: Error fetching article details:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load article details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticleDetail();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title;
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f0] flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#147a54]"></div>
        <p className="mt-6 text-[#4a6357] font-body text-lg animate-pulse">Consulting the library...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#fdf8f0] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold text-[#0e1a14] mb-4">Content Not Accessible</h2>
          <p className="text-[#4a6357] font-body mb-8">{error || "The article you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate('/library')} className="bg-[#147a54] hover:bg-[#0d5c40] text-white px-8 h-12 rounded-full">
             Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f0] pb-24">
      <SEO 
        title={article.title}
        description={article.content.substring(0, 160)}
        keywords={`${article.tags?.join(', ')}, ${article.category}, Quran O Itrat Academy, Islamic Articles`}
        ogImage={article.featuredImage}
        ogType="article"
      />

      {/* Hero Header */}
      <section className="relative h-[45vh] sm:h-[60vh] bg-[#0a3d2e] overflow-hidden">
        {article.featuredImage ? (
           <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center opacity-30">
              <FileText size={120} className="text-[#c9a84c]" />
           </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1a14] via-[#0e1a14]/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-5xl mx-auto px-6 pb-12 w-full">
            <Link 
              to="/library" 
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
                <ChevronLeft size={20} />
              </div>
              <span className="font-body text-sm font-medium tracking-wide">Back to Library</span>
            </Link>

            {article.category && (
              <Badge className="mb-6 bg-[#c9a84c] text-white border-none py-1.5 px-4 text-xs tracking-widest uppercase font-bold">
                {article.category}
              </Badge>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-[1.1] mb-8 max-w-4xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/70 font-body text-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 border border-white/10">
                  <User size={18} className="text-[#e8c96a]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-tighter opacity-60 leading-none mb-1">Written by</p>
                  <p className="text-white font-medium">{article.author}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 border border-white/10">
                  <Calendar size={18} className="text-[#e8c96a]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-tighter opacity-60 leading-none mb-1">Published</p>
                  <p className="text-white font-medium">{formatDate(article.createdAt)}</p>
                </div>
              </div>
              <div className="ml-auto hidden sm:flex items-center bg-white/10 border border-white/10 rounded-full px-5 py-2">
                 <Eye size={16} className="mr-2 text-[#e8c96a]" />
                 <span className="font-medium text-white">{article.views} <span className="opacity-60 text-xs">views</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Body */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-[#0a3d2e]/5 border border-white p-8 sm:p-12">
              <div 
                className="article-rich-content text-[#1c2e24] text-lg sm:text-xl leading-[1.8] space-y-8 font-body"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {article.content}
              </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-16 pt-10 border-t border-gray-100">
                  <div className="flex items-center mb-5">
                    <Tag className="h-4 w-4 mr-2 text-[#147a54]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0e1a14]">Referenced Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {article.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="px-4 py-2 bg-[#fdf8f0] text-[#4a6357] border-none hover:bg-[#147a54]/10 transition-colors text-sm rounded-lg"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 space-y-8">
                {/* Share Card */}
                <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-[#0a3d2e]/5">
                   <h3 className="font-display font-bold text-xl text-[#0e1a14] mb-6 flex items-center">
                     <Share2 size={20} className="mr-3 text-[#147a54]" /> Spread Knowledge
                   </h3>
                   <div className="grid grid-cols-1 gap-3">
                      <Button onClick={() => handleShare('facebook')} className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-xl h-12 justify-start px-6">
                        <Facebook size={18} className="mr-3" /> Facebook
                      </Button>
                      <Button onClick={() => handleShare('twitter')} className="w-full bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white rounded-xl h-12 justify-start px-6">
                        <Twitter size={18} className="mr-3" /> Twitter
                      </Button>
                      <Button onClick={() => handleShare('copy')} variant="outline" className="w-full border-gray-200 hover:bg-gray-50 rounded-xl h-12 justify-start px-6">
                        <LinkIcon size={18} className="mr-3 text-[#147a54]" /> Copy Link
                      </Button>
                   </div>
                </div>

                {/* Newsletter/CTA */}
                <div className="bg-[#0a3d2e] rounded-3xl p-8 text-white relative overflow-hidden group">
                   <div className="geo-pattern absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" />
                   <div className="relative z-10">
                     <h3 className="font-display font-bold text-2xl mb-4 leading-tight">Want more authentic content?</h3>
                     <p className="font-body text-white/70 text-sm mb-8 leading-relaxed">
                        Join our academy to get deep dives into Quranic sciences and Seerah.
                     </p>
                     <Link to="/courses" className="block text-center bg-[#c9a84c] hover:bg-[#e8c96a] text-white font-body font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#c9a84c]/20">
                        View Our Courses
                     </Link>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
