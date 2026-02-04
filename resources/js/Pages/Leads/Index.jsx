import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { leads = { data: [], meta: { links: [] } }, auth } = usePage().props;
  const {
    data = [],
    meta: { links } = { links: [] }
  } = leads;

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  function destroy(id) {
    if (confirm('Are you sure you want to delete this lead?')) {
      router.delete(route('leads.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Leads</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        {can('leads.create') && (
          <Link
            className="btn-indigo focus:outline-none"
            href={route('leads.create')}
          >
            <span>Create</span>
            <span className="hidden md:inline"> Lead</span>
          </Link>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">Email</th>
              <th className="px-6 pt-5 pb-4">Phone</th>
              <th className="px-6 pt-5 pb-4">Project</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t px-6 py-4">
                  {lead.first_name} {lead.last_name}
                  {lead.deleted_at && (
                    <Icon
                      name="trash"
                      className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current inline"
                    />
                  )}
                </td>
                <td className="border-t px-6 py-4">{lead.email || '—'}</td>
                <td className="border-t px-6 py-4">{lead.phone || '—'}</td>
                <td className="border-t px-6 py-4">{lead.project?.name || '—'}</td>
                <td className="border-t px-6 py-4">
                  {can('leads.edit') && (
                    <Link href={route('leads.edit', lead.id)} className="text-indigo-600 hover:text-indigo-800 mr-4">
                      Edit
                    </Link>
                  )}
                  {!lead.deleted_at && can('leads.delete') && (
                    <button type="button" onClick={() => destroy(lead.id)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="5">
                  No leads found.
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

Index.layout = page => <Layout title="Leads" children={page} />;

export default Index;
