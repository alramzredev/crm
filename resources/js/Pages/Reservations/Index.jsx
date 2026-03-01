import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import StatusFilter from '@/Shared/StatusFilter';
import Pagination from '@/Shared/Pagination';
import StatusPill from './Components/StatusPill';
import EditButton from '@/Shared/TableActions/EditButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import SelectInput from '@/Shared/SelectInput';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { reservations, auth } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = reservations || {};
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  const canEdit = (reservation) => {
    return can('reservations.edit')
      && reservation?.created_by === auth.user?.id
      && reservation?.status === 'active';
  };

  // For status filter
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const currentStatus = params.get('status') || '';

  function handleStatusChange(e) {
    const status = e.target.value;
    router.get(route('reservations'), { ...Object.fromEntries(params), status }, { preserveScroll: true });
  }

  const reservationStatuses = [
    { value: '', label: t('all_statuses') || 'All Statuses' },
    { value: 'draft', label: t('draft') },
    { value: 'active', label: t('active') },
    { value: 'confirmed', label: t('confirmed') },
    { value: 'expired', label: t('expired') },
    { value: 'canceled', label: t('canceled') },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('reservations')}</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SelectInput
            className="w-48"
            label={t('status')}
            name="status"
            value={currentStatus}
            onChange={handleStatusChange}
          >
            {reservationStatuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </SelectInput>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">{t('reservation_code') || 'Code'}</th>
              <th className="px-6 pt-5 pb-4">{t('lead')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit')}</th>
              <th className="px-6 pt-5 pb-4">{t('status')}</th>
              <th className="px-6 pt-5 pb-4">{t('expires_at')}</th>
              <th className="px-6 pt-5 pb-4">{t('actions')}</th>
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
                <td className="border-t px-6 py-4">
                  <div className="flex gap-2">
                    {(can('reservations.edit') || canEdit(r)) && (
                      <EditButton onClick={() => router.visit(route('reservations.edit', r.id))} />
                    )}
                    {can('reservations.view') && (
                      <ShowButton onClick={() => router.visit(route('reservations.show', r.id))} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="6">
                  {t('no_reservations_found') || 'No reservations found.'}
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
