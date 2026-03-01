import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CreateReservationButton({ onClick, disabled = false, label }) {
  const { t } = useTranslation();
  const buttonLabel = label || t('reserve_unit');
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-lg border border-gray-200 bg-white hover:bg-green-50 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 px-2 py-1 text-xs font-medium text-green-700 disabled:opacity-50 transition"
      aria-label={buttonLabel}
    >
      {/* Calendar-plus icon */}
      <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" />
        <path d="M16 2v4M8 2v4" />
        <path d="M3 10h18" />
        <path d="M12 14v4M10 16h4" />
      </svg>
      {buttonLabel}
    </button>
  );
}
