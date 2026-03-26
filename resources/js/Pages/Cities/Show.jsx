import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';
import EditButton from '@/Shared/TableActions/EditButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';

const Show = () => {
  const { city, municipalities = [], auth } = usePage().props;
  const { t, i18n } = useTranslation();

  const can = (permission) => auth.user?.permissions?.includes(permission) || false;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('countries.show', city.country_id)} className="text-indigo-600 hover:text-indigo-700">
            {city.country?.name || t('countries')}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {city.name}
        </h1>
        {can('countries.edit') && (
          <Link className="btn-indigo" href={route('countries.cities.edit', [city.country_id, city.id])}>
            {t('edit')}
          </Link>
        )}
      </div>

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <div className="p-8">
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-600">{t('name')}</div>
            <div className="mt-1">{city.name}</div>
          </div>
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-600">{t('country')}</div>
            <div className="mt-1">{city.country?.name || '—'}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl bg-white rounded shadow mt-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{t('municipalities')}</h2>
            {can('countries.create') && (
              <Link
                className="btn-indigo"
                href={route('countries.cities.municipalities.create', [city.country_id, city.id])}
              >
                {t('create')} {t('municipality')}
              </Link>
            )}
          </div>
          <div className="mb-6 text-sm text-gray-500">
            <Link
              className="text-indigo-600 hover:text-indigo-800"
              href={route('countries.cities.municipalities', [city.country_id, city.id])}
            >
              {t('view')} {t('all')} {t('municipalities')}
            </Link>
          </div>
          <table className="w-full whitespace-nowrap text-sm">
            <thead>
              <tr className="font-bold text-left bg-gray-50">
                <th className="px-6 pt-5 pb-4">{t('name')}</th>
                <th className="px-6 pt-5 pb-4">{t('neighborhoods')}</th>
                <th className="px-6 pt-5 pb-4">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {municipalities.length > 0 ? (
                municipalities.map(m => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{m.name}</td>
                    <td className="px-6 py-4">{m.neighborhoods_count}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <ShowButton
                          onClick={() =>
                            window.location = route('countries.cities.municipalities.show', [city.country_id, city.id, m.id])
                          }
                        />
                        {can('countries.edit') && (
                          <EditButton
                            onClick={() =>
                              window.location = route('countries.cities.municipalities.edit', [city.country_id, city.id, m.id])
                            }
                          />
                        )}
                        {can('countries.delete') && (
                          <DeleteButton
                            onClick={() => {
                              if (confirm(t('delete') + '?')) {
                                window.location = route('countries.cities.municipalities.destroy', [city.country_id, city.id, m.id]);
                              }
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 border-t text-center text-gray-500" colSpan={2}>
                    {t('no_municipalities_found') || 'No municipalities found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="City" children={page} />;

export default Show;
