import React from 'react';
import { router } from '@inertiajs/react';

const StatusFilter = ({ statuses = [], currentStatus, routeName, params = {} }) => {
  const handleStatusChange = (e) => {
    const status = e.target.value;
    if (status) {
      router.get(route(routeName), { ...params, status }, { preserveScroll: true });
    } else {
      router.get(route(routeName), params, { preserveScroll: true });
    }
  };

  return (
    <select
      value={currentStatus || ''}
      onChange={handleStatusChange}
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    >
      <option value="">All Statuses</option>
      {statuses.map((status) => (
        <option key={status.id || status.value} value={status.id || status.value}>
          {status.name || status.label}
        </option>
      ))}
    </select>
  );
};

export default StatusFilter;
