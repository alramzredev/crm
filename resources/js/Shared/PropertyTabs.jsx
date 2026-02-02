import React from 'react';

export default function PropertyTabs({ activeTab, onChange }) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-6">
        <button
          type="button"
          onClick={() => onChange('overview')}
          className={`pb-3 text-sm font-medium ${
            activeTab === 'overview'
              ? 'text-indigo-700 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => onChange('units')}
          className={`pb-3 text-sm font-medium ${
            activeTab === 'units'
              ? 'text-indigo-700 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Units
        </button>
      </nav>
    </div>
  );
}
