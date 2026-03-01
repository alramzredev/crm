import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import TrashedMessage from '@/Shared/TrashedMessage';
import PropertyTabs from '@/Shared/PropertyTabs';
import UnitList from '@/Shared/UnitList';
import { useTranslation } from 'react-i18next';

const Show = () => {
  const { property, units, auth } = usePage().props;
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const allowedTabs = new Set(['overview', 'units']);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('properties')} className="text-indigo-600 hover:text-indigo-700">{t('properties')}</Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {property.property_code}
        </h1>
        <Link className="btn-indigo" href={route('properties.edit', property.id)}>{t('edit')}</Link>
      </div>

      {property.deleted_at && (
        <TrashedMessage>{t('property_deleted')}</TrashedMessage>
      )}

      <PropertyTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="max-w-4xl overflow-hidden bg-white rounded shadow">
          <div className="p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('project')}</div>
                <div className="mt-1">{property.project?.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('owner')}</div>
                <div className="mt-1">{property.owner?.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('status')}</div>
                <div className="mt-1">{property.status?.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('neighborhood')}</div>
                <div className="mt-1">{property.neighborhood?.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('type')}</div>
                <div className="mt-1">{property.propertyType?.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('class')}</div>
                <div className="mt-1">{property.propertyClass?.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('total_square_meter')}</div>
                <div className="mt-1">{property.total_square_meter || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('total_units')}</div>
                <div className="mt-1">{property.total_units || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">{t('count_available')}</div>
                <div className="mt-1">{property.count_available ?? '—'}</div>
              </div>
              {property.notes && (
                <div className="sm:col-span-2">
                  <div className="text-sm font-semibold text-gray-600">{t('notes')}</div>
                  <div className="mt-1">{property.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'units' && (
        <div className="max-w-4xl bg-white rounded shadow">
          <div className="p-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{t('units')}</h2>
              {can('units.create') && (
                <Link
                  className="btn-indigo"
                  href={route('units.create', { 
                    property_id: property.id, 
                    project_id: property.project_id 
                  })}
                >
                  {t('add_unit')}
                </Link>
              )}
            </div>
            <div className="mb-6 text-sm text-gray-500">
              <Link
                className="text-indigo-600 hover:text-indigo-800"
                href={route('units', { property_id: property.id })}
              >
                {t('view_all_units')}
              </Link>
            </div>
            <UnitList units={units} showButton={true} inTab={true} />
          </div>
        </div>
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Property" children={page} />;

export default Show;
