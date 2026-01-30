import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import TrashedMessage from '@/Shared/TrashedMessage';

const Show = () => {
  const { project } = usePage().props;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <Link
            href={route('projects')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Projects
          </Link>
          <span className="mx-2 font-medium text-indigo-600">/</span>
          {project.name}
        </h1>
        <Link className="btn-indigo" href={route('projects.edit', project.id)}>
          Edit
        </Link>
      </div>

      {project.deleted_at && (
        <TrashedMessage>This project has been deleted.</TrashedMessage>
      )}

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-gray-600">Email</div>
              <div className="mt-1">{project.email || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Phone</div>
              <div className="mt-1">{project.phone || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Address</div>
              <div className="mt-1">{project.address || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">City</div>
              <div className="mt-1">{project.city || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">
                Province/State
              </div>
              <div className="mt-1">{project.region || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">Country</div>
              <div className="mt-1">{project.country || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">
                Postal Code
              </div>
              <div className="mt-1">{project.postal_code || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-bold">Contacts</h2>
      <div className="mt-6 overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">City</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {project.contacts.map(
              ({ id, name, phone, city, deleted_at }) => (
                <tr
                  key={id}
                  className="hover:bg-gray-100 focus-within:bg-gray-100"
                >
                  <td className="border-t">
                    <Link
                      href={route('contacts.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
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
                      href={route('contacts.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                    >
                      {city}
                    </Link>
                  </td>
                  <td className="border-t">
                    <Link
                      tabIndex="-1"
                      href={route('contacts.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                    >
                      {phone}
                    </Link>
                  </td>
                  <td className="w-px border-t">
                    <Link
                      tabIndex="-1"
                      href={route('contacts.edit', id)}
                      className="flex items-center px-4"
                    >
                      <Icon
                        name="cheveron-right"
                        className="block w-6 h-6 text-gray-400 fill-current"
                      />
                    </Link>
                  </td>
                </tr>
              )
            )}
            {project.contacts.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="Project" children={page} />;

export default Show;
