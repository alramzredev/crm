import React, { useEffect, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LeadForm from './Components/LeadForm';
import { useTranslation } from 'react-i18next';

const Create = () => {
  const { projects, leadSources = [], leadStatuses = [], brokers = [], auth } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    title: '',
    first_name: '',
    last_name: '',
    national_id: '',
    project_id: '',
    lead_source_id: '',
    status_id: '',
    email: '',
    phone: '',
    national_address_file: '',
    national_id_file: '',
  });
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    post(route('leads.store'));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link
          href={route('leads')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          {t('leads')}
        </Link>
        <span className="font-medium text-indigo-600"> /</span> {t('create')}
      </h1>
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <LeadForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel={t('create_lead')}
          projects={projects}
          leadSources={leadSources}
          leadStatuses={leadStatuses}
        />
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Lead" children={page} />;

export default Create;
