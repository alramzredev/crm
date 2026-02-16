import React from 'react';
import { router } from '@inertiajs/react';

const DiscountRequestsTable = ({ discountRequests, canApprove = false, onEdit }) => {
  if (!discountRequests || discountRequests.length === 0) {
    return <p className="text-gray-500 text-sm p-4">No discount requests yet.</p>;
  }

  const handleApprove = (requestId) => {
    if (confirm('Are you sure you want to approve this discount request?')) {
      router.post(route('discount-requests.approve', requestId));
    }
  };

  const handleReject = (requestId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason !== null && reason.trim() !== '') {
      router.post(route('discount-requests.reject', requestId), { rejection_reason: reason });
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requested By</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Original Price</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requested Price</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
        </tr>
      </thead>
      <tbody>
        {discountRequests.map((req) => (
          <tr key={req.id} className="border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-900">
              {req.requester?.first_name} {req.requester?.last_name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{req.original_price}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{req.requested_price}</td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {req.discount_amount} ({req.discount_percentage ? `${req.discount_percentage}%` : '—'})
            </td>
            <td className="px-6 py-4 text-sm">
              <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                req.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{req.reason || '—'}</td>
            <td className="px-6 py-4 text-right text-sm space-x-2">
              {/* Edit button only for pending/rejected requests */}
              {req.status !== 'approved' && typeof onEdit === 'function' && (
                <button
                  onClick={() => onEdit(req)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
              )}
              {canApprove && req.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Reject
                  </button>
                </>
              )}
              {req.status === 'approved' && !canApprove && (
                <span className="text-gray-400">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DiscountRequestsTable;
