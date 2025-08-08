import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { seoConfig } from '@/config/seo';

import Layout from '@/components/Layout';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Web Sketch Studio",
    "description": "Privacy Policy for Web Sketch Studio online code editor platform. Learn how we protect your data, code privacy, and developer information security.",
    "url": "https://webeditor.shopingers.in/privacy-policy",
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Web Sketch Studio",
      "url": "https://webeditor.shopingers.in"
    },
    "datePublished": "2025-01-04",
    "dateModified": "2025-01-05",
    "publisher": {
      "@type": "Organization",
      "name": "Shopingers"
    }
  };

  return (
    <Layout>
      <SEOHead
        title={seoConfig.pages.privacy.title}
        description={seoConfig.pages.privacy.description}
        keywords="privacy policy, data protection, code privacy, developer privacy, online editor privacy, web development security, user data, gdpr compliance, coding platform privacy"
        canonicalUrl="https://webeditor.shopingers.in/privacy-policy"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: January 5, 2025</p>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  Web Sketch Studio collects information to provide better services to our users:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Account information (email address, username)</li>
                  <li>Project data (code, files, project names)</li>
                  <li>Usage data (page views, feature usage)</li>
                  <li>Device information (browser type, IP address)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Information</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Provide and maintain our service</li>
                  <li>Improve user experience</li>
                  <li>Send service-related communications</li>
                  <li>Ensure platform security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Advertising</h2>
                <p className="text-gray-700 mb-4">
                  We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your visit to our site and other sites on the Internet.
                </p>
                <p className="text-gray-700 mb-4">
                  You can opt out of personalized advertising by visiting Google's Ad Settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies to enhance your experience, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Authentication cookies</li>
                  <li>Preference cookies</li>
                  <li>Analytics cookies</li>
                  <li>Advertising cookies (Google AdSense)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at privacy@shopingers.in
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
