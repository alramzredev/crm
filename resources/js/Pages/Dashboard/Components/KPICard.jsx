import React from 'react';
import Icon from '@/Shared/Icon';

export default function KPICard({ title, value, icon, color = 'indigo', trend }) {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-black">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-black">{value?.toLocaleString() || 0}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
            <Icon name={icon} className="w-6 h-6 text-white fill-current" />
          </div>
        )}
      </div>
    </div>
  );
}
