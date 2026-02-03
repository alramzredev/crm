import React from 'react';

const PaymentSummaryCard = ({ data }) => {
  return (
    <div className="w-full pb-8 pr-6 lg:w-1/2">
      <div className="bg-gray-50 rounded border border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Price</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {data.currency} {data.total_price || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Down Payment</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {data.currency} {data.down_payment || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Remaining Amount</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {data.currency} {data.remaining_amount || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
