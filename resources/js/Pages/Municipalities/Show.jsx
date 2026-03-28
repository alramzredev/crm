import React from 'react';
import { Link, usePage , router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';
import EditButton from '@/Shared/TableActions/EditButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';

const Show = () => {
  const { municipality, auth } = usePage().props;
  const { t } = useTranslation();

  const can = (permission) => auth.user?.permissions?.includes(permission) || false;

  // Use city and country from municipality resource
  const city = municipality.city;
  const country = city?.country;
  const neighborhoods = municipality.neighborhoods || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link href={route('countries.show', country.id)} className="text-indigo-600 hover:text-indigo-700">
            {country.name}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          <Link href={route('countries.cities.show', [country.id, city.id])} className="text-indigo-600 hover:text-indigo-700">
            {city.name}
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {municipality.name}
        </h1>
        {can('countries.edit') && (
          <Link className="btn-indigo" href={route('countries.cities.municipalities.edit', [country.id, city.id, municipality.id])}>
            {t('edit')}
          </Link>
        )}
      </div>

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <div className="p-8">
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-600">{t('name')}</div>
            <div className="mt-1">{municipality.name}</div>
          </div>
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-600">{t('city')}</div>
            <div className="mt-1">{city?.name}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl bg-white rounded shadow mt-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{t('neighborhoods')}</h2>
            {can('countries.create') && country && city && (
              <Link
                className="btn-indigo"
                href={route('countries.cities.municipalities.neighborhoods.create', [country.id, city.id, municipality.id])}
              >
                {t('create')} {t('neighborhood')}
              </Link>
            )}
          </div>
          <div className="mb-6 text-sm text-gray-500">
            {country && city && (
              <Link
                className="text-indigo-600 hover:text-indigo-800"
                href={route('countries.cities.municipalities.neighborhoods', [country.id, city.id, municipality.id])}
              >
                {t('view')} {t('all')} {t('neighborhoods')}
              </Link>
            )}
          </div>
          <table className="w-full whitespace-nowrap text-sm">
            <thead>
              <tr className="font-bold text-left bg-gray-50">
                <th className="px-6 pt-5 pb-4">{t('name')}</th>
                <th className="px-6 pt-5 pb-4">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {neighborhoods.length > 0 ? (
                neighborhoods.map(n => (
                  <tr key={n.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{n.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {can('countries.edit') && country && city && (
                          <EditButton
                            onClick={() =>
                              window.location = route('countries.cities.municipalities.neighborhoods.edit', [country.id, city.id, municipality.id, n.id])
                            }
                          />
                        )}
                        {can('countries.delete') && country && city && (
                          <DeleteButton
                            onClick={() => {
                              if (confirm(t('delete') + '?')) {
                                router.delete(
                                  route('countries.cities.municipalities.neighborhoods.destroy', [country.id, city.id, municipality.id, n.id]),
                                  { preserveScroll: true }
                                );
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
                    {t('no_neighborhoods_found') || 'No neighborhoods found.'}
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

Show.layout = page => <Layout title="Municipality" children={page} />;

export default Show;
