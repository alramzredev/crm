import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Pagination from '@/Shared/Pagination';
import EditButton from '@/Shared/TableActions/EditButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';
import ShowButton from '@/Shared/TableActions/ShowButton';
import { useTranslation } from 'react-i18next';

const UnitList = ({ units, showButton = true, inTab = false }) => {
  const { auth } = usePage().props;
  const { t } = useTranslation();

  const can = (permission) => {
    return auth.user?.permissions?.includes(permission) || false;
  };

  // Handle both paginated and non-paginated data
  const unitData = units?.data || units || [];
  const paginationLinks = units?.meta?.links || units?.links || null;

  if (!unitData || unitData.length === 0) {
    return <p>{t('unit_list_no_units_found')}</p>;
  }

  function destroy(id) {
    if (confirm(t('delete_unit') || 'Are you sure you want to delete this unit?')) {
      router.delete(route('units.destroy', id), { preserveScroll: true });
    }
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">{t('unit_list_code')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit_list_property')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit_list_floor')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit_list_area')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit_list_rooms')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit_list_status')}</th>
              <th className="px-6 pt-5 pb-4">{t('unit_list_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {unitData.map(u => (
              <tr key={u.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t px-6 py-4">{u.unit_code || '—'}</td>
                <td className="border-t px-6 py-4">{u.property?.property_code || '—'}</td>
                <td className="border-t px-6 py-4">{u.floor || '—'}</td>
                <td className="border-t px-6 py-4">{u.area || '—'}</td>
                <td className="border-t px-6 py-4">{u.rooms || '—'}</td>
                <td className="border-t px-6 py-4">{u.status?.name || '—'}</td>
                <td className="border-t px-6 py-4">
                  <div className="flex gap-2">
                    {can('units.edit') && (
                      <EditButton onClick={() => router.visit(route('units.edit', u.id))} />
                    )}
                    {!u.deleted_at && can('units.delete') && (
                      <DeleteButton onClick={() => destroy(u.id)} />
                    )}
                    {showButton && can('units.view') && (
                      <ShowButton onClick={() => router.visit(route('units.show', u.id))} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginationLinks && (
        <Pagination 
          links={paginationLinks}
          preserveScroll={inTab}
          preserveState={inTab}
          showSinglePage={false}
        />
      )}
    </>
  );
};

export default UnitList;
