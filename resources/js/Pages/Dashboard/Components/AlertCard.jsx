import React from 'react';

export default function AlertCard({ title, count, link, severity = 'warning' }) {
  const severityClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${severityClasses[severity]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
        {link && (
          <a href={link} className="text-sm underline hover:no-underline">
            View →
          </a>
        )}
      </div>
    </div>
  );
}
