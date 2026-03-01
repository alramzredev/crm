import React from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import KPICard from './Components/KPICard';
import AlertCard from './Components/AlertCard';
import { useTranslation } from 'react-i18next';

const SalesSupervisorDashboard = () => {
  const { kpis, teamPerformance, inventory, alerts } = usePage().props;
  const { t } = useTranslation();

  return (
    <div>
      {/* <h1 className="mb-8 text-3xl font-bold">{t('sales_supervisor_dashboard')}</h1> */}
      {/* Sales KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title={t('total_leads')} value={kpis.total_leads} icon="users" color="indigo" />
        <KPICard title={t('new_leads_today')} value={kpis.new_leads_today} icon="dashboard" color="green" />
        <KPICard title={t('active_reservations')} value={kpis.active_reservations} icon="book" color="yellow" />
      </div>
      {/* Alerts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('sales_alerts')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AlertCard 
            title={t('expiring_reservations_3_days')} 
            count={alerts.expiring_reservations} 
            severity="warning"
          />
          <AlertCard 
            title={t('unassigned_leads')} 
            count={alerts.unassigned_leads} 
            severity="error"
          />
        </div>
      </div>
      {/* Team Performance */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('team_performance')}</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('employee')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('total_leads')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('this_month')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamPerformance.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{member.first_name} {member.last_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{member.leads_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{member.leads_this_month_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Inventory Snapshot */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('inventory_snapshot')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard title={t('available_units')} value={inventory.available_units} icon="store-front" color="green" />
          <KPICard title={t('reserved_today')} value={inventory.reserved_today} icon="shopping-cart" color="yellow" />
        </div>
      </div>
    </div>
  );
};

SalesSupervisorDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default SalesSupervisorDashboard;
