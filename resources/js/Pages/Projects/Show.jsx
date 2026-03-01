import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TrashedMessage from '@/Shared/TrashedMessage';
import ProjectTabs from '@/Shared/ProjectTabs';
import PropertyList from '@/Shared/PropertyList';
import { useTranslation } from 'react-i18next';

const Show = () => {
  const { project, properties, auth } = usePage().props;
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const allowedTabs = new Set(['overview', 'properties']);
  const initialTab = (() => {
    if (typeof window === 'undefined') return 'overview';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return allowedTabs.has(tab) ? tab : 'overview';
  })();

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      const query = params.toString();
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [activeTab]);

  const ownerLabel = project.owner?.name || project.owner || '';
  const ownerTypeLabel = project.owner?.owner_type?.name || '';
  const statusLabel = project.status?.name || project.status || '';
  const typeLabel = project.project_type?.name || project.project_type || '';
  const cityLabel = project.city?.name || project.city || '';
  const neighborhoodLabel = project.neighborhood?.name || '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link
            href={route('projects')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            {t('projects')}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {project.name}
        </h1>
        {can('projects.edit') && (
          <Link className="btn-indigo" href={route('projects.edit', project.id)}>
            {t('edit')}
          </Link>
        )}
      </div>

      {project.deleted_at && (
        <TrashedMessage>{t('project_deleted')}</TrashedMessage>
      )}

      <ProjectTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <>
          <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
            <div className="p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('project_code')}</div>
                  <div className="mt-1">{project.project_code || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('owner')}</div>
                  <div className="mt-1">{ownerLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('owner_type')}</div>
                  <div className="mt-1">{ownerTypeLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('type')}</div>
                  <div className="mt-1">{typeLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('status')}</div>
                  <div className="mt-1">{statusLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('budget')}</div>
                  <div className="mt-1">{project.budget ? `$${project.budget}` : '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('city')}</div>
                  <div className="mt-1">{cityLabel || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('neighborhood')}</div>
                  <div className="mt-1">{neighborhoodLabel}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('location')}</div>
                  <div className="mt-1">{project.location || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('floors')}</div>
                  <div className="mt-1">{project.no_of_floors || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('units')}</div>
                  <div className="mt-1">{project.number_of_units || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">{t('warranty')}</div>
                  <div className="mt-1">{project.warranty ? t('yes') : t('no')}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'properties' && (
        <div className="max-w-4xl bg-white rounded shadow">
          <div className="p-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{t('properties')}</h2>
              {can('properties.create') && (
                <Link
                  className="btn-indigo"
                  href={route('properties.create', { project_id: project.id })}
                >
                  {t('add_property')}
                </Link>
              )}
            </div>
            <div className="mb-6 text-sm text-gray-500">
              <Link
                className="text-indigo-600 hover:text-indigo-800"
                href={route('properties', { project_id: project.id })}
              >
                {t('view_all_properties')}
              </Link>
            </div>
            <PropertyList properties={properties} showButton={true} inTab={true} />
          </div>
        </div>
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Project" children={page} />;

export default Show;
