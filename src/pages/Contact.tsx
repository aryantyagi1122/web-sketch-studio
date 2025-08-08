import React from 'react';
import Layout from '@/components/Layout';
import { Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="flex items-center mb-6">
          <Mail size={32} className="text-green-500 mr-2" />
          <h2 className="text-2xl font-bold">Contact Us</h2>
        </div>
        <p className="text-gray-600 mb-4 max-w-lg text-center">
          Have questions or feedback? Reach out to us at <a href="mailto:support@websketchstudio.com" className="text-blue-600 underline">support@websketchstudio.com</a>.
        </p>
        {/* You can add a contact form here if needed */}
      </div>
    </Layout>
  );
};

export default Contact;
