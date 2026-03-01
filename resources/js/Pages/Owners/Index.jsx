import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Pagination from '@/Shared/Pagination';
import EditButton from '@/Shared/TableActions/EditButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { owners, auth } = usePage().props;
  const { t } = useTranslation();
  const { data, meta: { links } = { links: [] } } = owners || { data: [], meta: { links: [] } };

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  function destroy(id) {
    if (confirm(t('delete_owner') || 'Delete owner?')) {
      router.delete(route('owners.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('owners')}</h1>
      <div className="flex items-center justify-between mb-6">
        {can('owners.create') && (
          <Link className="btn-indigo" href={route('owners.create')}>
            {t('create_owner')}
          </Link>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 py-3">{t('name')}</th>
              <th className="px-6 py-3">{t('owner_type')}</th>
              <th className="px-6 py-3">{t('phone')}</th>
              <th className="px-6 py-3">{t('email')}</th>
              <th className="px-6 py-3">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(o => (
              <tr key={o.id} className="border-t">
                <td className="px-6 py-4">{o.name}</td>
                <td className="px-6 py-4">{o.owner_type?.name || '—'}</td>
                <td className="px-6 py-4">{o.phone}</td>
                <td className="px-6 py-4">{o.email}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {can('owners.edit') && (
                      <EditButton onClick={() => router.visit(route('owners.edit', o.id))} />
                    )}
                    {can('owners.delete') && (
                      <DeleteButton onClick={() => destroy(o.id)} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4" colSpan="5">
                  {t('no_owners_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination links={links} />
    </div>
  );
};

Index.layout = page => <Layout title="Owners" children={page} />;

export default Index;
