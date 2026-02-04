import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';

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

      <div className="max-w-3xl bg-white rounded shadow">
        <div className="p-8 space-y-4">
          <div><strong>Status:</strong> {reservation.status || '—'}</div>
          <div><strong>Lead:</strong> {reservation.lead ? `${reservation.lead.first_name} ${reservation.lead.last_name}` : '—'}</div>
          <div><strong>Unit:</strong> {reservation.unit?.unit_code || '—'}</div>
          <div><strong>Total:</strong> {reservation.currency || 'SAR'} {reservation.total_price || '—'}</div>
          <div><strong>Down Payment:</strong> {reservation.currency || 'SAR'} {reservation.down_payment || '—'}</div>
          <div><strong>Remaining:</strong> {reservation.currency || 'SAR'} {reservation.remaining_amount || '—'}</div>
          <div><strong>Notes:</strong> {reservation.notes || '—'}</div>
        </div>
      </div>
    </div>
  );
};

Show.layout = page => <Layout title="Reservation" children={page} />;

export default Show;
