import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import { useTranslation } from 'react-i18next';
import ShowButton from '@/Shared/TableActions/ShowButton';
import EditButton from '@/Shared/TableActions/EditButton';

const Index = () => {
  const { countries } = usePage().props;       
  const { t } = useTranslation();

  const rows = countries?.data ?? [];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('countries')}</h1>
      <div className="mb-4">
        <Link className="btn-indigo" href={route('countries.create')}>
          {t('create_country')}
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">{t('name')}</th>
              <th className="px-6 pt-5 pb-4">{t('code')}</th>
              <th className="px-6 pt-5 pb-4">{t('cities')}</th>
              <th className="px-6 pt-5 pb-4">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(country => (
              <tr key={country.id} className="hover:bg-gray-100">
                <td className="border-t px-6 py-4">{country.name}</td>
                <td className="border-t px-6 py-4">{country.code || '—'}</td>
                <td className="border-t px-6 py-4">{country.cities_count}</td>
                <td className="border-t px-6 py-4">
                  <div className="flex gap-2">
                    <ShowButton onClick={() => window.location = route('countries.show', country.id)} />
                    <EditButton onClick={() => window.location = route('countries.edit', country.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Index.layout = page => <Layout title="Countries" children={page} />;
export default Index;
