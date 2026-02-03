import React from 'react';

const ContractTermsStep = ({ data, handleCheckboxChange }) => {
  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <div className="w-full pb-8 pr-6">
        <div className="bg-gray-50 rounded border border-gray-200 p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Reservation Agreement</h4>
          <p className="text-sm text-gray-600 mb-3">
            By signing this contract, you agree to reserve the selected unit under the terms and conditions specified. 
            The down payment is non-refundable unless otherwise specified in the payment plan agreement.
          </p>
          <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
          <p className="text-sm text-gray-600">
            Payment must be made according to the schedule outlined in the payment plan. 
            Failure to meet payment obligations may result in cancellation of the reservation.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.terms_accepted}
              onChange={() => handleCheckboxChange('terms_accepted')}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">I agree to the terms and conditions</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.privacy_accepted}
              onChange={() => handleCheckboxChange('privacy_accepted')}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">I agree to the privacy policy</span>
          </label>
        </div>

        <div className="bg-green-50 rounded border border-green-200 p-4">
          <p className="text-sm text-green-800 font-medium">
            ✓ All information has been verified. Please review the details above before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractTermsStep;
