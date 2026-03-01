import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import StatusFilter from '@/Shared/StatusFilter';
import Pagination from '@/Shared/Pagination';
import { useTranslation } from 'react-i18next';
import EditButton from '@/Shared/TableActions/EditButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import CreateReservationButton from '@/Shared/TableActions/CreateReservationButton';
import SelectInput from '@/Shared/SelectInput';

const Index = () => {
  const { leads = { data: [], meta: { links: [] } }, auth, leadStatuses = [] } = usePage().props;
  const { data = [], meta: { links } = { links: [] } } = leads;
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  function destroy(id) {
    if (confirm('Are you sure you want to delete this lead?')) {
      router.delete(route('leads.destroy', id), { preserveScroll: true });
    }
  }

  // Add for status filter
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const currentStatus = params.get('status') || '';

  function handleStatusChange(e) {
    const status = e.target.value;
    router.get(route('leads'), { ...Object.fromEntries(params), status }, { preserveScroll: true });
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('leads')}</h1>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <SearchFilter />
          <SelectInput
            className="w-48"
            label={t('status')}
            name="status"
            value={currentStatus}
            onChange={handleStatusChange}
          >
            <option value="">{t('all_statuses') || 'All Statuses'}</option>
            {leadStatuses.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </SelectInput>
        </div>
        {can('leads.create') && (
          <Link className="btn-indigo focus:outline-none" href={route('leads.create')}>
            <span>{t('create_lead')}</span>
           </Link>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">{t('name')}</th>
              <th className="px-6 pt-5 pb-4">{t('email')}</th>
              <th className="px-6 pt-5 pb-4">{t('phone')}</th>
              <th className="px-6 pt-5 pb-4">{t('project')}</th>
              <th className="px-6 pt-5 pb-4">{t('actions')}</th>
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
                  <div className="flex gap-2">
                    {!lead.deleted_at && can('reservations.create') && (
                      <CreateReservationButton
                        onClick={() => router.visit(route('reservations.create', { lead_id: lead.id }))}
                        label={t('reserve_unit')}
                      />
                    )}
                    {can('leads.edit') && (
                      <EditButton onClick={() => router.visit(route('leads.edit', lead.id))} />
                    )}
                    {!lead.deleted_at && can('leads.delete') && (
                      <DeleteButton onClick={() => destroy(lead.id)} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="5">
                  {t('no_leads_found')}
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
