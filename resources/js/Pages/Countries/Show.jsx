import React, { useState, useEffect } from 'react';
import { Link, usePage,  router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';
import EditButton from '@/Shared/TableActions/EditButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';

const Show = () => {
  const { country } = usePage().props;
  const { t } = useTranslation();
  console.log('Country data:', country);

  const allowedTabs = new Set(['cities']);
  const initialTab = (() => {
    if (typeof window === 'undefined') return 'cities';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return allowedTabs.has(tab) ? tab : 'cities';
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
          <Link href={route('countries')} className="text-indigo-600 hover:text-indigo-700">
            {t('countries')}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {country.name}
        </h1>
        <Link className="btn-indigo" href={route('countries.edit', country.id)}>
          {t('edit')}
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            type="button"
            onClick={() => setActiveTab('cities')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'cities'
                ? 'text-indigo-700 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('cities')}
          </button>
        </nav>
      </div>

      {/* Cities Table */}
      {activeTab === 'cities' && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">{t('cities')}</h2>
            <Link
              className="btn-indigo"
              href={route('countries.cities.create', country.id)}
            >
              {t('create_city')}
            </Link>
          </div>
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="font-bold text-left">
                <th className="px-6 pt-5 pb-4">{t('name')}</th>
                <th className="px-6 pt-5 pb-4">{t('municipalities')}</th>
                <th className="px-6 pt-5 pb-4">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {country.cities.length > 0 ? (
                country.cities.map(city => (
                  <tr key={city.id} className="hover:bg-gray-100">
                    <td className="border-t px-6 py-4">{city.name}</td>
                    <td className="border-t px-6 py-4">{city.municipalities_count}</td>
                    <td className="border-t px-6 py-4">
                      <div className="flex gap-2">
                        <EditButton onClick={() => window.location = route('countries.cities.edit', [country.id, city.id])} />
                        <ShowButton onClick={() => window.location = route('countries.cities.show', [country.id, city.id])} />
                        <DeleteButton
                          onClick={() => {
                            if (confirm(t('delete') + '?')) {
                              router.delete(route('countries.cities.destroy', [country.id, city.id]), { preserveScroll: true });
                            }
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border-t px-6 py-4 text-gray-500" colSpan={3}>
                    {t('no_cities_found') || 'No cities found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

Show.layout = page => <Layout title="Country" children={page} />;

export default Show;
