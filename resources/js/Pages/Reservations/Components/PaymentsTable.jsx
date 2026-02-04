import React from 'react';
import { Link } from '@inertiajs/react';

const PaymentsTable = ({ payments, onEdit, onDelete }) => {
  if (!payments || payments.length === 0) {
    return <p className="text-gray-500 text-sm p-4">No payments recorded yet.</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Notes</th>
          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.id} className="border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-900">{payment.payment_date}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{payment.amount}</td>
            <td className="px-6 py-4 text-sm text-gray-900 capitalize">{payment.payment_method}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{payment.reference_no || '—'}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{payment.notes || '—'}</td>
            <td className="px-6 py-4 text-right text-sm space-x-2">
              <button
                onClick={() => onEdit(payment)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(payment.id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PaymentsTable;
