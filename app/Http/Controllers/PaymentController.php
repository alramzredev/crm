<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\PaymentStoreRequest;
use App\Http\Requests\PaymentUpdateRequest;
use App\Repositories\PaymentRepository;

class PaymentController extends Controller
{
    protected $repo;

    public function __construct(PaymentRepository $repo)
    {
        $this->repo = $repo;
    }

    public function store(PaymentStoreRequest $request, Reservation $reservation)
    {
         $this->authorize('create', Payment::class);

        $validated = $request->validated();
        $files = $request->file('payment_receipts', []);

        $this->repo->createForReservation($reservation, $validated, $files);

        return Redirect::back()->with('success', 'Payment recorded.');
    }

    public function update(Payment $payment, PaymentUpdateRequest $request)
    {
         $this->authorize('update', $payment);

        $validated = $request->validated();
        $files = $request->file('payment_receipts', []);

        $this->repo->update($payment, $validated, $files);

        return Redirect::back()->with('success', 'Payment updated.');
    }

    public function destroy(Payment $payment)
    {
        $this->authorize('delete', $payment);

        $this->repo->delete($payment);

        return Redirect::back()->with('success', 'Payment deleted.');
    }
}
