import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import SelectInput from '@/Shared/SelectInput';
import TextInput from '@/Shared/TextInput';

const Edit = () => {
  const { reservation } = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    status: reservation.status || '',
    payment_method: reservation.payment_method || '',
    payment_plan: reservation.payment_plan || '',
    total_price: reservation.total_price || '',
    down_payment: reservation.down_payment || '',
    remaining_amount: reservation.remaining_amount || '',
    currency: reservation.currency || 'SAR',
    notes: reservation.notes || '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(route('reservations.update', reservation.id));
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <Link href={route('reservations')} className="text-indigo-600 hover:text-indigo-700">
          Reservations
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        Edit
      </h1>

      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Status"
              name="status"
              errors={errors.status}
              value={data.status}
              onChange={e => setData('status', e.target.value)}
            >
              <option value=""></option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="confirmed">Confirmed</option>
              <option value="expired">Expired</option>
              <option value="canceled">Canceled</option>
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Payment Method"
              name="payment_method"
              errors={errors.payment_method}
              value={data.payment_method}
              onChange={e => setData('payment_method', e.target.value)}
            >
              <option value=""></option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Payment Plan"
              name="payment_plan"
              errors={errors.payment_plan}
              value={data.payment_plan}
              onChange={e => setData('payment_plan', e.target.value)}
            >
              <option value=""></option>
              <option value="cash">Cash</option>
              <option value="installment">Installment</option>
              <option value="mortgage">Mortgage</option>
            </SelectInput>

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Total Price"
              name="total_price"
              errors={errors.total_price}
              value={data.total_price}
              onChange={e => setData('total_price', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Down Payment"
              name="down_payment"
              errors={errors.down_payment}
              value={data.down_payment}
              onChange={e => setData('down_payment', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Remaining Amount"
              name="remaining_amount"
              errors={errors.remaining_amount}
              value={data.remaining_amount}
              onChange={e => setData('remaining_amount', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Currency"
              name="currency"
              errors={errors.currency}
              value={data.currency}
              onChange={e => setData('currency', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6"
              label="Notes"
              name="notes"
              errors={errors.notes}
              value={data.notes}
              onChange={e => setData('notes', e.target.value)}
            />
          </div>
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton loading={processing} type="submit" className="ml-auto btn-indigo">
              Update Reservation
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout title="Edit Reservation" children={page} />;

export default Edit;
