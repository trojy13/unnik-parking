import React from 'react';
import { Layout } from '../components/Layout';
import { CustomerList } from '../components/CustomerList';
import { LanguageProvider } from '../contexts/LanguageContext';

const Index = () => {
  return (
    <LanguageProvider>
      <Layout>
        <CustomerList />
      </Layout>
    </LanguageProvider>
  );
};

export default Index;