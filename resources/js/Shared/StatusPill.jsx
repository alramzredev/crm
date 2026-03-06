import React from 'react';

const StatusPill = ({ status, name = '' }) => {
  console.log('StatusPill received status:', status);
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    expired: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    canceled: 'bg-red-100 text-red-800',
    error: 'bg-red-100 text-red-800',
    valid: 'bg-green-100 text-green-800',
    imported: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    new: 'bg-green-100 text-gray-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    unqualified: 'bg-red-100 text-red-800',
    converted: 'bg-purple-100 text-purple-800',
    no_answer: 'bg-gray-100 text-gray-800',
    callback_requested: 'bg-orange-100 text-orange-800',
    phone_off: 'bg-gray-100 text-gray-800',
    planning: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-gray-300 text-gray-800',
    blocked: 'bg-red-100 text-red-800',
    under_maintenance: 'bg-orange-100 text-orange-800',
    under_construction: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {name || (status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : '—')}
    </span>
  );
};

export default StatusPill;
