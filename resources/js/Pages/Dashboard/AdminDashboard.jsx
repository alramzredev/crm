import React from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import KPICard from './Components/KPICard';
import AlertCard from './Components/AlertCard';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { kpis, charts, userStats, alerts } = usePage().props;
  const { t } = useTranslation();

  return (
    <div>
      {/* <h1 className="mb-8 text-3xl font-bold">{t('admin_dashboard')}</h1> */}
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title={t('total_projects')} value={kpis.total_projects} icon="project" color="indigo" />
        <KPICard title={t('total_properties')} value={kpis.total_properties} icon="property" color="blue" />
        <KPICard title={t('total_units')} value={kpis.total_units} icon="dashboard" color="purple" />
        <KPICard title={t('available_units')} value={kpis.available_units} icon="store-front" color="green" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title={t('sold_units')} value={kpis.sold_units} icon="shopping-cart" color="green" />
        <KPICard title={t('active_reservations')} value={kpis.active_reservations} icon="book" color="yellow" />
        <KPICard title={t('total_leads')} value={kpis.total_leads} icon="users" color="indigo" />
      </div>
      {/* Alerts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">{t('alerts_notifications')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlertCard 
            title={t('expired_reservations')} 
            count={alerts.expired_reservations} 
            severity="error"
            link={route('reservations', { status: 'expired' })}
          />
          <AlertCard 
            title={t('low_availability_projects')} 
            count={alerts.low_availability_projects} 
            severity="warning"
            link={route('projects')}
          />
        </div>
      </div>
      {/* User Stats Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('user_overview')}</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Users by Role */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">{t('users_by_role')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{t('super_admins')}</span>
                  <span className="font-bold text-purple-700">{userStats.super_admins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{t('project_admins')}</span>
                  <span className="font-bold text-blue-700">{userStats.project_admins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{t('sales_supervisors')}</span>
                  <span className="font-bold text-indigo-700">{userStats.sales_supervisors}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{t('sales_employees')}</span>
                  <span className="font-bold text-green-700">{userStats.sales_employees}</span>
                </div>
              </div>
            </div>
            {/* User Status */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">{t('user_status')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{t('active_users')}</span>
                  <span className="font-bold text-green-700">{userStats.active_users}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-gray-700 font-medium">{t('inactive_users')}</span>
                  <span className="font-bold text-gray-500">{userStats.inactive_users}</span>
                </div>
              </div>
            </div>
            {/* Total Summary */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">{t('summary')}</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                  <p className="text-sm text-gray-600 mb-1">{t('total_users')}</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    {userStats.active_users + userStats.inactive_users}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-xs text-gray-600 mb-1">{t('active_rate')}</p>
                  <p className="text-lg font-semibold text-yellow-700">
                    {userStats.active_users + userStats.inactive_users > 0 
                      ? Math.round((userStats.active_users / (userStats.active_users + userStats.inactive_users)) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminDashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default AdminDashboard;
