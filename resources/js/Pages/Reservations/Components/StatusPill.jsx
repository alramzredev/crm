import React from 'react';

const StatusPill = ({ status }) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    expired: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || '—'}
    </span>
  );
};

export default StatusPill;
