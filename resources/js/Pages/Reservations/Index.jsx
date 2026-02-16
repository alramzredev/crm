import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import StatusFilter from '@/Shared/StatusFilter';
import Pagination from '@/Shared/Pagination';
import StatusPill from './Components/StatusPill';

const Index = () => {
  const { reservations, auth } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = reservations || {};

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const canEdit = (reservation) => {
    return can('reservations.edit')
      && reservation?.created_by === auth.user?.id
      && reservation?.status === 'active';
  };

  const reservationStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'expired', label: 'Expired' },
    { value: 'canceled', label: 'Canceled' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Reservations</h1>
      <div className="flex items-center justify-between mb-6">
        <StatusFilter
          statuses={reservationStatuses}
          currentStatus={new URLSearchParams(window.location.search).get('status')}
          routeName="reservations"
        />
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Code</th>
              <th className="px-6 pt-5 pb-4">Lead</th>
              <th className="px-6 pt-5 pb-4">Unit</th>
              <th className="px-6 pt-5 pb-4">Status</th>
              <th className="px-6 pt-5 pb-4">Expires At</th>
              <th className="px-6 pt-5 pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t px-6 py-4">{r.reservation_code || '—'}</td>
                <td className="border-t px-6 py-4">
                  {r.lead ? `${r.lead.first_name} ${r.lead.last_name}` : '—'}
                </td>
                <td className="border-t px-6 py-4">{r.unit?.unit_code || '—'}</td>
                <td className="border-t px-6 py-4">
                  <StatusPill status={r.status} />
                </td>
                <td className="border-t px-6 py-4">
                  {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : '—'}
                </td>
                <td className="border-t px-6 py-4 space-x-3">
                  {(can('reservations.edit') || canEdit(r)) && (
                    <Link href={route('reservations.edit', r.id)} className="text-indigo-600 hover:text-indigo-800">
                      Edit
                    </Link>
                  )}
                  {can('reservations.view') && (
                    <Link href={route('reservations.show', r.id)} className="text-indigo-600 hover:text-indigo-800">
                      Show
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="6">
                  No reservations found.
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

Index.layout = page => <Layout title="Reservations" children={page} />;

export default Index;
