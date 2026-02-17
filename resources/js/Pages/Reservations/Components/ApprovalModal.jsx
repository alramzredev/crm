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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-white px-8 py-6 flex flex-col items-start border-b border-gray-200">
          <h3 className="text-2xl font-bold text-black mb-1">Reservation Action</h3>
          <p className="text-black text-base opacity-80">ID: <span className="font-mono">{reservation.reservation_code}</span></p>
        </div>

        <div className="p-8 space-y-8 bg-gray-50">
          {/* Step 1: Action Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-base font-bold shadow">
                1
              </span>
              <label className="text-base font-semibold text-gray-800">Choose Action</label>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Approve Option */}
              <label
                className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${
                  approvalAction === 'confirm'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="action"
                  value="confirm"
                  checked={approvalAction === 'confirm'}
                  onChange={e => {
                    setApprovalAction(e.target.value);
                    setSelectedReason('');
                  }}
                  className="accent-green-600 w-5 h-5"
                />
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Approve
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Confirm and proceed with this reservation</p>
                </div>
              </label>
              {/* Reject Option */}
              <label
                className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${
                  approvalAction === 'reject'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-300'
                }`}
              >
                <input
                  type="radio"
                  name="action"
                  value="reject"
                  checked={approvalAction === 'reject'}
                  onChange={e => {
                    setApprovalAction(e.target.value);
                    setSelectedReason('');
                  }}
                  className="accent-red-600 w-5 h-5"
                />
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Reject
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Decline this reservation with a reason</p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 2: Rejection Reason (conditionally shown) */}
          {approvalAction === 'reject' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white text-base font-bold shadow">
                  2
                </span>
                <label className="text-base font-semibold text-gray-800">Select Reason *</label>
              </div>
              <select
                value={selectedReason}
                onChange={e => setSelectedReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 font-medium transition-all duration-200"
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
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-400 text-white text-base font-bold shadow">
                {approvalAction === 'reject' ? '3' : '2'}
              </span>
              <label className="text-base font-semibold text-gray-800">Additional Notes (Optional)</label>
            </div>
            <textarea
              value={approvalNotes}
              onChange={e => setApprovalNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none text-gray-900 font-medium transition-all duration-200 bg-white"
              placeholder="Add any additional comments or remarks..."
              disabled={localIsSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            {approvalAction === 'confirm' && (
              <button
                onClick={handleApprove}
                disabled={localIsSubmitting}
                className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {localIsSubmitting ? 'Processing...' : 'Reject'}
              </button>
            )}

            {!approvalAction && (
              <div className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-500 font-semibold text-center bg-white">
                Select an action above
              </div>
            )}

            <button
              onClick={onClose}
              disabled={localIsSubmitting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 bg-white"
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
