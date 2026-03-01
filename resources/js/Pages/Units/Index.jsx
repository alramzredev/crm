import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import UnitList from '@/Shared/UnitList';
 import SelectInput from '@/Shared/SelectInput';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { units, auth, projects = [], unitStatuses = [] } = usePage().props;
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  // Get filters from URL
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const currentProject = params.get('project_id') || '';
  const currentStatus = params.get('status_id') || '';

  function handleProjectChange(e) {
    const project_id = e.target.value;
    router.get(route('units'), { ...Object.fromEntries(params), project_id }, { preserveScroll: true });
  }

  function handleStatusChange(e) {
    const status_id = e.target.value;
    router.get(route('units'), { ...Object.fromEntries(params), status_id }, { preserveScroll: true });
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('units')}</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SelectInput
            className="w-48"
            label={t('project')}
            name="project_id"
            value={currentProject}
            onChange={handleProjectChange}
          >
            <option value="">{t('all_projects')}</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </SelectInput>
          <SelectInput
            className="w-48"
            label={t('status')}
            name="status_id"
            value={currentStatus}
            onChange={handleStatusChange}
          >
            <option value="">{t('all_statuses')}</option>
            {unitStatuses.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </SelectInput>
        </div>
        {can('units.create') && (
          <Link className="btn-indigo" href={route('units.create')}>
            <span>{t('create_unit')}</span>
           </Link>
        )}
      </div>
      <UnitList units={units} showButton={true} />
    </div>
  );
};

Index.layout = page => <Layout title="Units" children={page} />;

export default Index;
