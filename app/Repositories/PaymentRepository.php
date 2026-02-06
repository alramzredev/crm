<?php

namespace App\Repositories;

use App\Models\Payment;
use App\Models\PaymentReceipt;
use App\Models\Reservation;

class PaymentRepository
{
    public function createForReservation(Reservation $reservation, array $validated, array $paymentReceipts = []): Payment
    {
        $payment = Payment::create([
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

        foreach ($paymentReceipts as $file) {
            if (!$file) {
                continue;
            }

            $path = $file->store('assets/peyment_receipts', 'public');

            PaymentReceipt::create([
                'payment_id' => $payment->id,
                'uploaded_by' => auth()->id(),
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_type' => $file->extension(),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
            ]);
        }

        return $payment;
    }

    public function update(Payment $payment, array $validated, array $paymentReceipts = []): Payment
    {
        $payment->update($validated);

        foreach ($paymentReceipts as $file) {
            if (!$file) {
                continue;
            }

            $path = $file->store('assets/peyment_receipts', 'public');

            PaymentReceipt::create([
                'payment_id' => $payment->id,
                'uploaded_by' => auth()->id(),
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_type' => $file->extension(),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
            ]);
        }

        return $payment;
    }

    public function delete(Payment $payment): void
    {
        $payment->delete();
    }
}