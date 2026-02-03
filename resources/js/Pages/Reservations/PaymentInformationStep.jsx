import React from 'react';
import SelectInput from '@/Shared/SelectInput';
import TextInput from '@/Shared/TextInput';

const PaymentInformationStep = ({ data, handleChange }) => {
  return (
    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Payment Method"
        name="payment_method"
        value={data.payment_method}
        onChange={e => handleChange('payment_method', e.target.value)}
      >
        <option value="">Select Payment Method</option>
        <option value="cash">Cash</option>
        <option value="bank_transfer">Bank Transfer</option>
        <option value="check">Check</option>
      </SelectInput>

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Down Payment"
        name="down_payment"
        type="number"
        value={data.down_payment}
        onChange={e => handleChange('down_payment', e.target.value)}
      />

      <SelectInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Payment Plan"
        name="payment_plan"
        value={data.payment_plan}
        onChange={e => handleChange('payment_plan', e.target.value)}
      >
        <option value="cash">Cash</option>
        <option value="installment">Installment</option>
        <option value="mortgage">Mortgage</option>
      </SelectInput>

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Total Price"
        name="total_price"
        type="number"
        value={data.total_price}
        onChange={e => handleChange('total_price', e.target.value)}
      />

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Remaining Amount"
        name="remaining_amount"
        type="number"
        value={data.remaining_amount}
        onChange={e => handleChange('remaining_amount', e.target.value)}
      />

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Currency"
        name="currency"
        value={data.currency}
        onChange={e => handleChange('currency', e.target.value)}
      />

      <TextInput
        className="w-full pb-8 pr-6 lg:w-1/2"
        label="Notes"
        name="notes"
        value={data.notes}
        onChange={e => handleChange('notes', e.target.value)}
      />
    </div>
  );
};

export default PaymentInformationStep;
