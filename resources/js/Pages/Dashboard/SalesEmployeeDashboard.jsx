import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import KPICard from './Components/KPICard';
import { useTranslation } from 'react-i18next';

const SalesEmployeeDashboard = () => {
  const { myWork, reminders, performance, inventory } = usePage().props;
  const { t } = useTranslation();

  return (
    <div>
      {/* <h1 className="mb-8 text-3xl font-bold">{t('my_dashboard')}</h1> */}

      {/* Personal Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <KPICard title={t('reservations_this_month')} value={performance.reservations_this_month} icon="book" color="green" />
        <KPICard title={t('conversion_rate')} value={`${performance.conversion_rate}%`} icon="dashboard" color="indigo" />
      </div>

      {/* My Work */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('my_assigned_work')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assigned Leads */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{t('my_leads')}</h3>
              <Link href={route('leads')} className="text-indigo-600 hover:text-indigo-800 text-sm">
                {t('view_all')}
              </Link>
            </div>
            <p className="text-3xl font-bold text-gray-900">{myWork.assigned_leads.length}</p>
            <p className="text-sm text-gray-600 mt-2">{t('assigned_leads')}</p>
          </div>

          {/* Active Reservations */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{t('active_reservations')}</h3>
              <Link href={route('reservations')} className="text-indigo-600 hover:text-indigo-800 text-sm">
                {t('view_all')}
              </Link>
            </div>
            <p className="text-3xl font-bold text-gray-900">{myWork.active_reservations.length}</p>
            <p className="text-sm text-gray-600 mt-2">{t('in_progress')}</p>
          </div>
        </div>
      </div>

      {/* Available Inventory */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-black">{t('available_units')}</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">{t('unit_code')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">{t('property')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">{t('project')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">{t('rooms')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">{t('area')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{unit.unit_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.property?.property_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.project?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.rooms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{unit.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

SalesEmployeeDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default SalesEmployeeDashboard;
