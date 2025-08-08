
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object;
  noIndex?: boolean;
  alternateLinks?: Array<{
    hreflang: string;
    href: string;
  }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Web Sketch Studio - Free Online Code Editor, HTML CSS JS Compiler & IDE",
  description = "Free online code editor and compiler for HTML, CSS, JavaScript. Build web apps instantly with live preview, syntax highlighting, code sharing, and collaboration. No downloads required - start coding now!",
  keywords = "online code editor, html editor, css editor, javascript editor, js compiler, online compiler, web development, code playground, html css js editor, online ide, frontend editor, web editor, code sharing, live preview, syntax highlighting, web development tools, javascript playground, css playground, html playground, online coding, code editor online, web development platform, frontend development, responsive design editor",
  canonicalUrl = "https://webeditor.shopingers.in/",
  ogImage = "https://webeditor.shopingers.in/og-image.png",
  ogType = "website",
  jsonLd,
  noIndex = false,
  alternateLinks = []
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Shopingers" />
      <meta name="publisher" content="Shopingers" />
      <meta name="copyright" content="© 2025 Shopingers. All rights reserved." />
      <meta name="language" content="EN" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Robots Meta Tags */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Links for Multi-language */}
      {alternateLinks.map((link, index) => (
        <link key={index} rel="alternate" hrefLang={link.hreflang} href={link.href} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Web Sketch Studio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shopingers" />
      <meta name="twitter:creator" content="@shopingers" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Web Sketch Studio - Online Code Editor" />
      
      {/* Article Meta Tags (for blog posts) */}
      <meta property="article:publisher" content="https://shopingers.in" />
      <meta property="article:author" content="Shopingers" />
      
      {/* Technical Meta Tags */}
      <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Performance and Caching */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      <meta httpEquiv="Expires" content="31536000" />
      
      {/* App-specific Meta Tags */}
      <meta name="application-name" content="Web Sketch Studio" />
      <meta name="apple-mobile-web-app-title" content="Web Sketch Studio" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Schema.org JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* Resource Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Helmet>
  );
};

export default SEOHead;
