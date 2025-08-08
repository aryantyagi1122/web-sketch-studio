import React from 'react';
import Layout from '@/components/Layout';
import { Bot } from 'lucide-react';

const AIDocument: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="flex items-center mb-6">
          <Bot size={32} className="text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold">AI Document Generation</h2>
        </div>
        <p className="text-gray-600 mb-4 max-w-lg text-center">
          Welcome to the AI Document Generation page. Here you will be able to generate documents using advanced AI models. (Feature coming soon!)
        </p>
        {/* TODO: Add actual AI document generation UI and logic here */}
        <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-8 mt-4 text-blue-700">
          <span>AI-powered document creation will be available here.</span>
        </div>
      </div>
    </Layout>
  );
};

export default AIDocument;
