import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import SelectInput from '@/Shared/SelectInput';
import TextInput from '@/Shared/TextInput';
import { useTranslation } from 'react-i18next';

const Edit = () => {
  const { reservation } = usePage().props;
  const { t } = useTranslation();

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
          {t('reservations')}
        </Link>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {reservation.reservation_code || t('edit')}
      </h1>

      {/* Reservation Form */}
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('status')}
              name="status"
              errors={errors.status}
              value={data.status}
              onChange={e => setData('status', e.target.value)}
            >
              <option value="">{t('all_statuses')}</option>
              <option value="draft">{t('draft')}</option>
              <option value="active">{t('active')}</option>
              <option value="confirmed">{t('confirmed')}</option>
              <option value="expired">{t('expired')}</option>
              <option value="canceled">{t('canceled')}</option>
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('payment_method')}
              name="payment_method"
              errors={errors.payment_method}
              value={data.payment_method}
              onChange={e => setData('payment_method', e.target.value)}
            >
              <option value=""></option>
              <option value="cash">{t('cash')}</option>
              <option value="bank_transfer">{t('bank_transfer')}</option>
              <option value="check">{t('check')}</option>
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('payment_plan')}
              name="payment_plan"
              errors={errors.payment_plan}
              value={data.payment_plan}
              onChange={e => setData('payment_plan', e.target.value)}
            >
              <option value=""></option>
              <option value="cash">{t('cash')}</option>
              <option value="installment">{t('installment')}</option>
              <option value="mortgage">{t('mortgage')}</option>
            </SelectInput>

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('base_price')}
              name="base_price"
              value={reservation.base_price || reservation.total_price || ''}
              readOnly
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('total_price')}
              name="total_price"
              errors={errors.total_price}
              value={data.total_price}
              onChange={e => setData('total_price', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('down_payment')}
              name="down_payment"
              errors={errors.down_payment}
              value={data.down_payment}
              onChange={e => setData('down_payment', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('remaining_amount')}
              name="remaining_amount"
              errors={errors.remaining_amount}
              value={data.remaining_amount}
              onChange={e => setData('remaining_amount', e.target.value)}
            />
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label={t('currency')}
              name="currency"
              errors={errors.currency}
              value={data.currency}
              onChange={e => setData('currency', e.target.value)}
            /> */}
            <TextInput
              className="w-full pb-8 pr-6"
              label={t('notes')}
              name="notes"
              errors={errors.notes}
              value={data.notes}
              onChange={e => setData('notes', e.target.value)}
            />
          </div>
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton loading={processing} type="submit" className="ml-auto btn-indigo">
              {t('update_reservation')}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout title="Edit Reservation" children={page} />;

export default Edit;
