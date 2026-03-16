import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website',
  author = 'Quran O Itrat Academy'
}) => {
  const location = useLocation();
  const currentUrl = url || `https://www.quranoitratacademy.com${location.pathname}`;
  const defaultImage = '/quran_o_itrat_logo.png';

  useEffect(() => {
    // Update document title
    document.title = title ? `${title} | Quran O Itrat Academy` : 'Quran O Itrat Academy - Islamic Education Excellence';

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Basic SEO tags
    if (description) {
      updateMetaTag('description', description);
    }
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('theme-color', '#10b981');

    // Open Graph tags
    updateMetaTag('og:title', title || 'Quran O Itrat Academy - Islamic Education Excellence', true);
    updateMetaTag('og:description', description || 'Learn Quran, Tajweed, Islamic Studies, and Arabic Language at Quran O Itrat Academy. Expert instructors, comprehensive courses, and authentic Islamic education.', true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', image || defaultImage, true);
    updateMetaTag('og:site_name', 'Quran O Itrat Academy', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || 'Quran O Itrat Academy - Islamic Education Excellence');
    updateMetaTag('twitter:description', description || 'Learn Quran, Tajweed, Islamic Studies, and Arabic Language at Quran O Itrat Academy. Expert instructors, comprehensive courses, and authentic Islamic education.');
    updateMetaTag('twitter:image', image || defaultImage);

    // Additional SEO tags
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('format-detection', 'telephone=no');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', currentUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', currentUrl);
      document.head.appendChild(canonicalLink);
    }

    // JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Quran O Itrat Academy",
      "description": "Islamic education academy offering Quran, Tajweed, Islamic Studies, and Arabic Language courses",
      "url": "https://www.quranoitratacademy.com",
      "logo": "https://www.quranoitratacademy.com/quran_o_itrat_logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": "https://www.quranoitratacademy.com/contact"
      },
      "sameAs": [
        "https://www.facebook.com/quranoitratacademy",
        "https://www.instagram.com/quranoitratacademy",
        "https://www.youtube.com/quranoitratacademy"
      ]
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      jsonLdScript.textContent = JSON.stringify(structuredData);
    } else {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(jsonLdScript);
    }

  }, [title, description, keywords, image, currentUrl, type, author]);

  return null;
};

export default SEOHead;

