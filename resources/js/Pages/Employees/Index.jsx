import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { employees } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = employees || {};

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Sales Team</h1>
      
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">Email</th>
              <th className="px-6 pt-5 pb-4">Assigned Projects</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(employee => (
              <tr key={employee.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t px-6 py-4">
                  {employee.first_name} {employee.last_name}
                </td>
                <td className="border-t px-6 py-4">{employee.email}</td>
                <td className="border-t px-6 py-4">
                  {employee.projects_count || 0} projects
                </td>
                <td className="border-t px-6 py-4">
                  <Link 
                    href={route('employees.show', employee.id)} 
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t text-center text-gray-500" colSpan="4">
                  No employees found.
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

Index.layout = page => <Layout title="My Sales Team" children={page} />;

export default Index;
