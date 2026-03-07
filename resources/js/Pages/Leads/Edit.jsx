import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TrashedMessage from '@/Shared/TrashedMessage';
import LeadForm from './Components/LeadForm';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { lead, leadSources = [], leadStatuses = [], brokers = [], projects = [], auth } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    title: lead.title || '',
    first_name: lead.first_name || '',
    last_name: lead.last_name || '',
    national_id: lead.national_id || '',
    project_id: lead.project_id || '',
    lead_source_id: lead.lead_source_id || '',
    status_id: lead.status_id || '',
    email: lead.email || '',
    phone: lead.phone || '',
    national_address_file: '',
    national_id_file: '',
    address: lead.address || '',
    city: lead.city || '',
    region: lead.region || '',
    country: lead.country || '',
    postal_code: lead.postal_code || ''
  });
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    put(route('leads.update', lead.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this lead?')) {
      router.delete(route('leads.destroy', lead.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this lead?')) {
      router.put(route('leads.restore', lead.id));
    }
  }

  return (
    <div>
      <Helmet title={`${data.first_name} ${data.last_name}`} />
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-700">{t('leads')}</Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.first_name} {data.last_name}
      </h1>

      {lead.deleted_at && (
        <TrashedMessage onRestore={restore}>
          {t('lead_deleted')}
        </TrashedMessage>
      )}

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <LeadForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitLabel={t('update_lead')}
          projects={projects}
          leadSources={leadSources}
          leadStatuses={leadStatuses}
        />
        <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
          {!lead.deleted_at && (
            <DeleteButton
              onDelete={destroy}
              className=""
            >
              {t('delete_lead')}
            </DeleteButton>
          )}
        </div>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
