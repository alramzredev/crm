import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import LoadingButton from '@/Shared/LoadingButton';

const PaymentFormModal = ({ isOpen, payment, reservationId, onClose }) => {
  const { data, setData, errors, post, put, processing, reset } = useForm({
    amount: '',
    payment_method: '',
    payment_date: '',
    reference_no: '',
    notes: '',
  });

  // Update form data when payment prop changes
  useEffect(() => {
    if (payment) {
      setData({
        amount: payment.amount || '',
        payment_method: payment.payment_method || '',
        payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
        reference_no: payment.reference_no || '',
        notes: payment.notes || '',
      });
    } else {
      reset();
      setData({
        amount: '',
        payment_method: '',
        payment_date: new Date().toISOString().split('T')[0],
        reference_no: '',
        notes: '',
      });
    }
  }, [payment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payment?.id) {
      put(route('payments.update', payment.id), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      post(route('payments.store', reservationId), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {payment ? 'Edit Payment' : 'Record Payment'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <TextInput
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            errors={errors.amount}
            value={data.amount}
            onChange={(e) => setData('amount', e.target.value)}
          />

          <SelectInput
            label="Payment Method"
            name="payment_method"
            errors={errors.payment_method}
            value={data.payment_method}
            onChange={(e) => setData('payment_method', e.target.value)}
          >
            <option value="">Select Method</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="check">Check</option>
          </SelectInput>

          <TextInput
            label="Payment Date"
            name="payment_date"
            type="date"
            errors={errors.payment_date}
            value={data.payment_date}
            onChange={(e) => setData('payment_date', e.target.value)}
          />

          <TextInput
            label="Reference Number"
            name="reference_no"
            errors={errors.reference_no}
            value={data.reference_no}
            onChange={(e) => setData('reference_no', e.target.value)}
          />

          <TextInput
            label="Notes"
            name="notes"
            errors={errors.notes}
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
          />

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={processing}
              className="flex-1 btn-indigo"
            >
              {payment ? 'Update' : 'Record'} Payment
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentFormModal;
