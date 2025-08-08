import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { seoConfig } from '@/config/seo';

import Layout from '@/components/Layout';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Web Sketch Studio",
    "description": "Terms of Service for Web Sketch Studio online code editor platform. Read our terms and conditions for using our coding services.",
    "url": "https://webeditor.shopingers.in/terms",
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
        title={seoConfig.pages.terms.title}
        description={seoConfig.pages.terms.description}
        keywords="terms of service, terms and conditions, online editor terms, web development platform terms, coding service agreement, user agreement, service terms"
        canonicalUrl="https://webeditor.shopingers.in/terms"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-600">Last updated: January 5, 2025</p>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using Web Sketch Studio, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-700 mb-4">
                  Permission is granted to temporarily use Web Sketch Studio for personal, non-commercial transitory viewing only.
                </p>
                <p className="text-gray-700 mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software</li>
                  <li>Remove any copyright or other proprietary notations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Content</h2>
                <p className="text-gray-700 mb-4">
                  You retain all rights to the code and content you create using Web Sketch Studio. We do not claim ownership of your projects.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Prohibited Uses</h2>
                <p className="text-gray-700 mb-4">You may not use our service:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>For any unlawful purpose</li>
                  <li>To create harmful or malicious code</li>
                  <li>To violate any local, state, national or international law</li>
                  <li>To transmit or procure the sending of advertising or promotional material</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at terms@shopingers.in
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
