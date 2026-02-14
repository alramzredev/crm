import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const ApprovalModal = ({
  isOpen,
  onClose,
  reservation,
  cancelReasons = [],
  approvalAction,
  setApprovalAction,
  selectedReason,
  setSelectedReason,
  approvalNotes,
  setApprovalNotes,
  isSubmitting,
}) => {
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  const handleApprove = (e) => {
    e.preventDefault();
    setLocalIsSubmitting(true);

    router.post(
      route('reservations.approve', reservation.id),
      {
        notes: approvalNotes,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
        onError: () => {
          setLocalIsSubmitting(false);
        },
      }
    );
  };

  const handleReject = (e) => {
    e.preventDefault();
    setLocalIsSubmitting(true);

    router.post(
      route('reservations.reject', reservation.id),
      {
        cancel_reason_id: selectedReason,
        notes: approvalNotes,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
        onError: () => {
          setLocalIsSubmitting(false);
        },
      }
    );
  };

  const resetForm = () => {
    setApprovalAction('');
    setSelectedReason('');
    setApprovalNotes('');
    setLocalIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Reservation Action</h3>
          <p className="text-indigo-100 text-sm mt-1">ID: {reservation.reservation_code}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Action Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                1
              </span>
              <label className="text-sm font-semibold text-gray-700">Choose Action</label>
            </div>
            
            <div className="space-y-2">
              {/* Approve Option */}
              <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  borderColor: approvalAction === 'confirm' ? '#10b981' : '#e5e7eb',
                  backgroundColor: approvalAction === 'confirm' ? '#f0fdf4' : 'transparent',
                }}>
                <input
                  type="radio"
                  name="action"
                  value="confirm"
                  checked={approvalAction === 'confirm'}
                  onChange={(e) => {
                    setApprovalAction(e.target.value);
                    setSelectedReason('');
                  }}
                  className="mr-3 mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Approve Reservation
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Confirm and proceed with this reservation</p>
                </div>
              </label>

              {/* Reject Option */}
              <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  borderColor: approvalAction === 'reject' ? '#ef4444' : '#e5e7eb',
                  backgroundColor: approvalAction === 'reject' ? '#fef2f2' : 'transparent',
                }}>
                <input
                  type="radio"
                  name="action"
                  value="reject"
                  checked={approvalAction === 'reject'}
                  onChange={(e) => {
                    setApprovalAction(e.target.value);
                    setSelectedReason('');
                  }}
                  className="mr-3 mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Reject Reservation
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Decline this reservation with a reason</p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 2: Rejection Reason (conditionally shown) */}
          {approvalAction === 'reject' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  2
                </span>
                <label className="text-sm font-semibold text-gray-700">Select Reason *</label>
              </div>
              
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 font-medium transition-all duration-200"
                disabled={localIsSubmitting}
              >
                <option value="">Choose a rejection reason...</option>
                {cancelReasons.map(reason => (
                  <option key={reason.id} value={reason.id}>
                    {reason.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 3: Optional Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                {approvalAction === 'reject' ? '3' : '2'}
              </span>
              <label className="text-sm font-semibold text-gray-700">Additional Notes (Optional)</label>
            </div>
            
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 font-medium transition-all duration-200"
              placeholder="Add any additional comments or remarks..."
              disabled={localIsSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {approvalAction === 'confirm' && (
              <button
                onClick={handleApprove}
                disabled={localIsSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {localIsSubmitting ? 'Processing...' : 'Approve'}
              </button>
            )}

            {approvalAction === 'reject' && (
              <button
                onClick={handleReject}
                disabled={localIsSubmitting || !selectedReason}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {localIsSubmitting ? 'Processing...' : 'Reject'}
              </button>
            )}

            {!approvalAction && (
              <div className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-500 font-semibold text-center">
                Select an action above
              </div>
            )}

            <button
              onClick={onClose}
              disabled={localIsSubmitting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
