import React from 'react';
import { Link } from '@inertiajs/react';
import EditButton from '@/Shared/TableActions/EditButton';
import DeleteButton from '@/Shared/TableActions/DeleteButton';

const PaymentsTable = ({ payments, onEdit, onDelete, readOnly = false }) => {
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
          {!readOnly && (
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
          )}
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
            {!readOnly && (
              <td className="px-6 py-4 text-right text-sm space-x-2">
                <EditButton onClick={() => onEdit(payment)} />
                <DeleteButton onClick={() => onDelete(payment.id)} />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PaymentsTable;
