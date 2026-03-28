import React from 'react';
import SelectInput from '@/Shared/SelectInput';
import TextInput from '@/Shared/TextInput';
import { useTranslation } from 'react-i18next'; // Add this

const PaymentInformationStep = ({ data, handleChange, errors = {} }) => {
  const { t } = useTranslation(); // Add this

  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('payment_method')}
        name="payment_method"
        value={data.payment_method}
        onChange={e => handleChange('payment_method', e.target.value)}
        errors={errors.payment_method}
      >
        <option value="">{t('select_payment_method')}</option>
        <option value="cash">{t('cash')}</option>
        <option value="bank_transfer">{t('bank_transfer')}</option>
        <option value="check">{t('check')}</option>
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
        name="payment_plan"
        value={data.payment_plan}
        onChange={e => handleChange('payment_plan', e.target.value)}
        errors={errors.payment_plan}
      >
        <option value="cash">{t('cash')}</option>
        <option value="installment">{t('installment')}</option>
        <option value="mortgage">{t('mortgage')}</option>
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

      {/* <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label={t('currency')}
        name="currency"
        value={data.currency}
        onChange={e => handleChange('currency', e.target.value)}
        errors={errors.currency}
      /> */}

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
