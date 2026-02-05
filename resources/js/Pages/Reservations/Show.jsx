import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import PaymentsTable from './Components/PaymentsTable';

const Show = () => {
  const { reservation } = usePage().props;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('reservations')} className="text-indigo-600 hover:text-indigo-700">
          Reservations
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {reservation.reservation_code || 'Reservation'}
      </h1>

      <div className="max-w-3xl bg-white rounded shadow mb-8">
        <div className="p-8 space-y-4">
          <div><strong>Status:</strong> {reservation.status || '—'}</div>
          <div><strong>Started At:</strong> {reservation.started_at ? new Date(reservation.started_at).toLocaleString() : '—'}</div>
          <div><strong>Expires At:</strong> {reservation.expires_at ? new Date(reservation.expires_at).toLocaleString() : '—'}</div>
          <div><strong>Lead:</strong> {reservation.lead ? `${reservation.lead.first_name} ${reservation.lead.last_name}` : '—'}</div>
          <div><strong>Unit:</strong> {reservation.unit?.unit_code || '—'}</div>
          <div><strong>Total:</strong> {reservation.currency || 'SAR'} {reservation.total_price || '—'}</div>
          <div><strong>Down Payment:</strong> {reservation.currency || 'SAR'} {reservation.down_payment || '—'}</div>
          <div><strong>Remaining:</strong> {reservation.currency || 'SAR'} {reservation.remaining_amount || '—'}</div>
          <div><strong>Notes:</strong> {reservation.notes || '—'}</div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        </div>
        <PaymentsTable
          payments={reservation.payments || []}
          onEdit={() => {}}
          onDelete={() => {}}
          readOnly={true}
        />
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="Reservation" children={page} />;

export default Show;
