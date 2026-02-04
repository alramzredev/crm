<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\PaymentStoreRequest;
use App\Http\Requests\PaymentUpdateRequest;

class PaymentController extends Controller
{
    public function store(PaymentStoreRequest $request, Reservation $reservation)
    {
        $this->authorize('create', Payment::class);

        $validated = $request->validated();

        Payment::create([
            'reservation_id' => $reservation->id,
            'customer_id' => $reservation->customer_id,
            'amount' => $validated['amount'],
            'currency' => $validated['currency'] ?? $reservation->currency ?? 'SAR',
            'payment_method' => $validated['payment_method'],
            'payment_date' => $validated['payment_date'] ?? now(),
            'reference_no' => $validated['reference_no'],
            'notes' => $validated['notes'],
            'created_by' => auth()->id(),
        ]);

        return Redirect::back()->with('success', 'Payment recorded.');
    }

    public function update(Payment $payment, PaymentUpdateRequest $request)
    {
        $this->authorize('update', $payment);

        $payment->update($request->validated());

        return Redirect::back()->with('success', 'Payment updated.');
    }

    public function destroy(Payment $payment)
    {
        $this->authorize('delete', $payment);

        $payment->delete();

        return Redirect::back()->with('success', 'Payment deleted.');
    }
}
