import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogTitle, ogDescription, ogImage, ogType = 'website' }) => {
  const siteTitle = 'Quran O Itrat Academy';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Learn Quran, Tafseer, and Islamic sciences with qualified scholars at Quran O Itrat Academy.';
  const defaultKeywords = 'Quran, Tafseer, Seerah, Islamic Education, Tauzeeh ul masil, Tafseer e Namoona, Tafseer e Qumi, Tareekh e Tabri, Ehtqadaat, Sihah Sita, Kutab e Arba, Maktab e Shamla, Divine Pearl, Mafatih ul Janan';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
