import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { projects } = usePage().props;
  const {
    data,
    meta: { links }
  } = projects;

  function destroy(id) {
    if (confirm('Are you sure you want to delete this project?')) {
      router.delete(route('projects.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Projects</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        <Link
          className="btn-indigo focus:outline-none"
          href={route('projects.create')}
        >
          <span>Create</span>
          <span className="hidden md:inline"> Project</span>
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">City</th>
              <th className="px-6 pt-5 pb-4">Phone</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, name, city, phone, deleted_at }) => {
              return (
                <tr
                  key={id}
                  className="hover:bg-gray-100 focus-within:bg-gray-100"
                >
                  <td className="border-t">
                    <Link
                      href={route('projects.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                    >
                      {name}
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
                      href={route('projects.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                    >
                      {city}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      tabIndex="-1"
                      href={route('projects.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                    >
                      {phone}
                    </Link>
                  </td>
                  <td className="border-t px-6 py-4">
                    <Link
                      href={route('projects.edit', id)}
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                    >
                      Edit
                    </Link>
                    {!deleted_at && (
                      <button
                        type="button"
                        onClick={() => destroy(id)}
                        className="text-red-600 hover:text-red-800 mr-4"
                      >
                        Delete
                      </button>
                    )}
                    <Link
                      tabIndex="-1"
                      href={route('projects.show', id)}
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                    >
                      Show
                    </Link>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No projects found.
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
