import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';
import StatusFilter from '@/Shared/StatusFilter';
import { useTranslation } from 'react-i18next';
import ShowButton from '@/Shared/TableActions/ShowButton';
import EditButton from '@/Shared/TableActions/EditButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';

const Index = () => {
  const { projects, auth, projectStatuses = [] } = usePage().props;
  const { data, meta: { links } } = projects;
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  function destroy(id) {
    if (confirm('Are you sure you want to delete this project?')) {
      router.delete(route('projects.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('projects')}</h1>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <SearchFilter />
          <StatusFilter
            statuses={projectStatuses.map(s => ({ value: s.id, label: s.name }))}
            currentStatus={new URLSearchParams(window.location.search).get('status')}
            routeName="projects"
          />
        </div>
        {can('projects.create') && (
          <Link className="btn-indigo focus:outline-none" href={route('projects.create')}>
            <span>{t('create_project')}</span>
           </Link>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">{t('code')}</th>
              <th className="px-6 pt-5 pb-4">{t('name')}</th>
              <th className="px-6 pt-5 pb-4">{t('owner')}</th>
              <th className="px-6 pt-5 pb-4">{t('city')}</th>
              <th className="px-6 pt-5 pb-4">{t('status')}</th>
              <th className="px-6 pt-5 pb-4">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr
                key={p.id}
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="border-t px-6 py-4">{p.project_code || '—'}</td>
                <td className="border-t">
                  <Link
                    href={route('projects.edit', p.id)}
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {p.name}
                    {p.deleted_at && (
                      <Icon
                        name="trash"
                        className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                      />
                    )}
                  </Link>
                </td>
                <td className="border-t px-6 py-4">{p.owner?.name || '—'}</td>
                <td className="border-t px-6 py-4">{p.city?.name || '—'}</td>
                <td className="border-t px-6 py-4">{p.status?.name || '—'}</td>
                <td className="border-t px-6 py-4">
                  <div className="flex gap-2">
                    {can('projects.edit') && (
                      <EditButton onClick={() => router.visit(route('projects.edit', p.id))} />
                    )}
                    {!p.deleted_at && can('projects.delete') && (
                      <DeleteButton onClick={() => destroy(p.id)} />
                    )}
                    {can('projects.view') && (
                      <ShowButton onClick={() => router.visit(route('projects.show', p.id))} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="6">
                  {t('no_projects_found')}
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

Index.layout = page => <Layout title="Projects" children={page} />;

export default Index;
