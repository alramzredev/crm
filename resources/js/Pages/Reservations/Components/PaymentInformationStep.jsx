import React from 'react';
import SelectInput from '@/Shared/SelectInput';
import TextInput from '@/Shared/TextInput';
import { useTranslation } from 'react-i18next';

const PaymentInformationStep = ({
  data,
  handleChange,
  errors = {},
  paymentMethods = [],
  paymentPlans = [],
}) => {
  const { t, i18n } = useTranslation();

  console.log('PaymentInformationStep data:', paymentMethods, paymentPlans);

  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('payment_method')}
        name="payment_method_id"
        value={data.payment_method_id}
        onChange={e => handleChange('payment_method_id', e.target.value)}
        errors={errors.payment_method_id}
      >
        <option value="">{t('select_payment_method')}</option>
        {paymentMethods.map(pm => (
          <option key={pm.id} value={pm.id}>
            {pm.name || pm.code}
          </option>
        ))}
      </SelectInput>

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('down_payment')}
        name="down_payment"
        type="number"
        min="0"
        step="0.01"
        value={data.down_payment}
        onChange={e => handleChange('down_payment', e.target.value)}
        errors={errors.down_payment}
      />

      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('payment_plan')}
        name="payment_plan_id"
        value={data.payment_plan_id}
        onChange={e => handleChange('payment_plan_id', e.target.value)}
        errors={errors.payment_plan_id}
      >
        <option value="">{t('payment_plan')}</option>
        {paymentPlans.map(pp => (
          <option key={pp.id} value={pp.id}>
            {pp.name || pp.code}
          </option>
        ))}
      </SelectInput>

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('total_price')}
        name="total_price"
        type="number"
        min="0"
        step="0.01"
        value={data.total_price}
        readOnly
        errors={errors.total_price}
      />

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('remaining_amount')}
        name="remaining_amount"
        type="number"
        min="0"
        step="0.01"
        value={data.remaining_amount}
        readOnly
        errors={errors.remaining_amount}
      />

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('notes')}
        name="notes"
        value={data.notes}
        onChange={e => handleChange('notes', e.target.value)}
        errors={errors.notes}
      />
    </div>
  );
};

export default PaymentInformationStep;
