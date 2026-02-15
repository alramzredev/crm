import React from 'react';

const DiscountRequestModal = ({
  isOpen,
  reservation,
  requestedPrice,
  setRequestedPrice,
  discountReason,
  setDiscountReason,
  discountSubmitting,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Request Discount</h3>
          <p className="text-yellow-100 text-sm mt-1">Reservation: {reservation?.reservation_code}</p>
        </div>
        <form className="p-6 space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Requested Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={requestedPrice}
              onChange={e => setRequestedPrice(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              disabled={discountSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={discountReason}
              onChange={e => setDiscountReason(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              placeholder="Explain why you are requesting a discount"
              disabled={discountSubmitting}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={discountSubmitting || !requestedPrice || !discountReason}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {discountSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={discountSubmitting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountRequestModal;
