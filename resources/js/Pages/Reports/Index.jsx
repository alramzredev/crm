import React from 'react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('reports')}</h1>
    </div>
  );
};

Index.layout = page => <Layout title={t('reports')} children={page} />;

export default Index;
