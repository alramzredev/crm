import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EditButton({ onClick, disabled = false, label }) {
  const { t } = useTranslation();
  const buttonLabel = label || t('edit');
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-lg border border-gray-200 bg-white hover:bg-yellow-50 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-2 py-1 text-xs font-medium text-yellow-700 disabled:opacity-50 transition"
      aria-label={buttonLabel}
    >
      <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v2H3v-2z" />
      </svg>
      {buttonLabel}
    </button>
  );
}
