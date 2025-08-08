
export const seoConfig = {
  siteUrl: 'https://webeditor.shopingers.in',
  siteName: 'Web Sketch Studio',
  siteDescription: 'Free Online HTML CSS JavaScript Editor & Code Compiler. Create, edit, and preview web projects instantly in your browser. Best online code editor for web development, HTML compiler, CSS editor, and JavaScript playground.',
  keywords: [
    // Primary Keywords
    'online code editor', 'html css js editor', 'web editor', 'code compiler online', 'html editor online',
    'css editor online', 'javascript editor online', 'online code playground', 'web development editor',
    'html css javascript compiler', 'online web editor', 'code editor browser', 'web code editor',
    
    // Secondary Keywords
    'free code editor', 'online html editor', 'online css editor', 'online javascript editor',
    'web development tools', 'html compiler online', 'css compiler online', 'javascript compiler online',
    'code playground', 'web playground', 'online coding platform', 'browser based editor',
    
    // Long-tail Keywords
    'best online code editor', 'free online html editor', 'online web development editor',
    'html css js playground', 'web editor no download', 'browser code editor',
    'online coding environment', 'web development sandbox', 'html css javascript playground',
    
    // Tool-specific Keywords
    'codepen alternative', 'jsfiddle alternative', 'online ide', 'web ide',
    'frontend editor', 'client side editor', 'responsive web editor', 'mobile friendly code editor',
    
    // Educational Keywords
    'learn html online', 'learn css online', 'learn javascript online', 'coding practice',
    'web development practice', 'html tutorial editor', 'css tutorial editor', 'javascript tutorial editor',
    
    // Technical Keywords
    'live code preview', 'real time code editor', 'instant preview editor', 'code collaboration',
    'share code online', 'web project editor', 'html5 editor', 'css3 editor', 'es6 editor',
    
    // User Intent Keywords
    'create website online', 'build website online', 'web prototype editor', 'quick html editor',
    'test html code', 'test css code', 'test javascript code', 'debug html css js',
    
    // Specific Features
    'multi file editor', 'project based editor', 'save code online', 'code storage',
    'export code', 'download code', 'code sharing', 'collaborative coding',
    
    // Mobile and Accessibility
    'mobile code editor', 'responsive code editor', 'touch friendly editor',
    'ipad code editor', 'tablet code editor', 'accessibility friendly editor',
    
    // Framework Related
    'bootstrap editor', 'tailwind css editor', 'jquery editor', 'vanilla js editor',
    'react sandbox', 'vue sandbox', 'angular sandbox', 'framework testing',
    
    // Professional Use
    'professional code editor', 'enterprise code editor', 'team collaboration editor',
    'code review tool', 'developer tools', 'web developer editor'
  ],
  author: 'Web Sketch Studio Team',
  ogImage: '/og-image.png',
  twitterHandle: '@websketchstudio',
  pages: {
    home: {
      title: 'Web Sketch Studio - Free Online HTML CSS JavaScript Editor & Code Compiler',
      description: 'Professional online code editor for HTML, CSS, and JavaScript. Create, edit, and preview web projects instantly in your browser. No downloads required. Best free online web development editor with live preview, syntax highlighting, and code sharing features.'
    },
    editor: {
      title: 'Code Editor - Web Sketch Studio | Online HTML CSS JS Compiler',
      description: 'Advanced online code editor with live preview, syntax highlighting, and real-time compilation. Edit HTML, CSS, and JavaScript code with our professional web development environment.'
    },
    auth: {
      title: 'Login & Register - Web Sketch Studio | Free Online Code Editor',
      description: 'Join Web Sketch Studio for free. Save your projects, collaborate with others, and access your code from anywhere. Sign up for the best online code editor experience.'
    },
    trash: {
      title: 'Trash - Web Sketch Studio | Manage Deleted Projects',
      description: 'Manage your deleted projects in Web Sketch Studio. Restore accidentally deleted code projects or permanently remove them from your account.'
    },
    privacy: {
      title: 'Privacy Policy - Web Sketch Studio | Data Protection & Privacy',
      description: 'Learn about how Web Sketch Studio protects your privacy and handles your data. Our commitment to keeping your code and personal information secure.'
    },
    terms: {
      title: 'Terms of Service - Web Sketch Studio | User Agreement',
      description: 'Terms of service and user agreement for Web Sketch Studio. Understand your rights and responsibilities when using our online code editor platform.'
    }
  }
};

export const structuredData = {
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Web Sketch Studio",
    "alternateName": "Online Code Editor",
    "url": "https://webeditor.shopingers.in",
    "description": "Free online HTML CSS JavaScript editor and code compiler with live preview",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://webeditor.shopingers.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  
  webApplication: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Web Sketch Studio",
    "description": "Professional online code editor for HTML, CSS, and JavaScript development",
    "url": "https://webeditor.shopingers.in",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "HTML Editor",
      "CSS Editor", 
      "JavaScript Editor",
      "Live Preview",
      "Syntax Highlighting",
      "Code Sharing",
      "Project Management",
      "Multi-file Support",
      "Responsive Design",
      "Real-time Compilation"
    ]
  },

  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Web Sketch Studio",
    "url": "https://webeditor.shopingers.in",
    "logo": "https://webeditor.shopingers.in/logo.png",
    "description": "Leading provider of online web development tools and code editors",
    "foundingDate": "2024",
    "sameAs": [
      "https://github.com/websketchstudio",
      "https://twitter.com/websketchstudio"
    ]
  },

  faqPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Web Sketch Studio free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Web Sketch Studio is completely free to use. You can create unlimited projects, save your code, and access all features without any cost."
        }
      },
      {
        "@type": "Question", 
        "name": "What programming languages are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Web Sketch Studio supports HTML, CSS, and JavaScript. You can create single-file projects or multi-file web applications with live preview functionality."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my projects online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, after creating a free account, you can save unlimited projects online and access them from any device with an internet connection."
        }
      },
      {
        "@type": "Question",
        "name": "Does the editor work on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Web Sketch Studio is fully responsive and works on all devices including smartphones, tablets, and desktop computers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I share my projects with others?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can make your projects public and share them with others. People can view your code and even create their own copies to modify."
        }
      }
    ]
  },

  breadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://webeditor.shopingers.in"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Code Editor",
        "item": "https://webeditor.shopingers.in/editor"
      }
    ]
  }
};
