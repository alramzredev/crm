import React, { useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import LoadingButton from '@/Shared/LoadingButton';
import MultiFileInput from '@/Shared/MultiFileInput';

const PaymentFormModal = ({ isOpen, payment, reservationId, onClose }) => {
  const { data, setData, errors, post, put, processing, reset } = useForm({
    amount: '',
    payment_method: '',
    payment_date: '',
    reference_no: '',
    notes: '',
    payment_receipts: [],
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
        payment_receipts: [],
      });
    } else {
      reset();
      setData({
        amount: '',
        payment_method: '',
        payment_date: new Date().toISOString().split('T')[0],
        reference_no: '',
        notes: '',
        payment_receipts: [],
      });
    }
  }, [payment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (payment?.id) {
      post(route('payments.update', payment.id), {
        forceFormData: true,
        onSuccess: () => {
          router.reload({ only: ['reservation'] });
          reset();
          onClose();
        },
      });
    } else {
      post(route('payments.store', reservationId), {
        forceFormData: true,
        onSuccess: () => {
          router.reload({ only: ['reservation'] });
          reset();
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-md shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {payment ? 'Edit Payment' : 'Record Payment'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
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

            {payment?.receipts && payment.receipts.length > 0 && (
              <div className="rounded border border-gray-200 p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Existing Receipts</p>
                <ul className="space-y-1">
                  {payment.receipts.map((r) => (
                    <li key={r.id} className="text-sm">
                      <a
                        href={r.file_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {r.file_name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <MultiFileInput
              label={payment ? 'Add Receipts' : 'Receipts'}
              name="payment_receipts"
              accept=".pdf,.jpg,.jpeg,.png"
              errors={errors.payment_receipts ? [errors.payment_receipts] : []}
              onChange={(files) => setData('payment_receipts', files)}
            />
          </div>

          <div className="flex gap-2 p-6 pt-4 border-t border-gray-200 flex-shrink-0">
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
