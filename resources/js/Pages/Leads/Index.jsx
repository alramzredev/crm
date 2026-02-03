import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import Pagination from '@/Shared/Pagination';
import SearchFilter from '@/Shared/SearchFilter';

const Index = () => {
  const { leads } = usePage().props;
  const data = leads?.data || [];
  const links = leads?.links || [];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Leads</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        <Link
          className="btn-indigo focus:outline-none"
          href={route('leads.create')}
        >
          <span>Create</span>
          <span className="hidden md:inline"> Lead</span>
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">Project</th>
              <th className="px-6 pt-5 pb-4">Email</th>
              <th className="px-6 pt-5 pb-4 w-32">Phone</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, first_name, last_name, project, email, phone, deleted_at }) => (
              <tr
                key={id}
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="border-t">
                  <Link
                    href={route('leads.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {first_name} {last_name}
                    {deleted_at && (
                      <Icon
                        name="trash"
                        className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                      />
                    )}
                  </Link>
                </td>
                <td className="border-t">
                  <Link
                    tabIndex="-1"
                    href={route('leads.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {project ? project.name : '—'}
                  </Link>
                </td>
                <td className="border-t">
                  <Link
                    tabIndex="-1"
                    href={route('leads.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {email}
                  </Link>
                </td>
                <td className="border-t">
                  <Link
                    tabIndex="-1"
                    href={route('leads.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {phone}
                  </Link>
                </td>
                <td className="border-t px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={route('leads.edit', id)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Edit
                    </Link>
                    {!deleted_at && (
                      <Link
                        href={route('reservations.create', { lead_id: id })}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Reserve
                      </Link>
                    )}
                  </div>
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
