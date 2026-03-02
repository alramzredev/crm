<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    protected $contractService;

    public function __construct(ContractService $contractService)
    {
        $this->contractService = $contractService;
    }

    public function generate(Reservation $reservation)
    {
        $this->authorize('create', Contract::class);

        try {
            $contract = $this->contractService->createContractForReservation($reservation);
            return Redirect::back()->with('success', 'Contract generated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        // ...validation and other logic...

        // Example: get template_id and payload from request or build as needed
        $templateId = $request->input('template_id');
        $payload = $request->input('signit_payload'); // or build the payload array here

        // Generate contract document via Signit
        $signitResponse = $this->contractService->generateSignitContractDocument($templateId, $payload);

        // ...handle $signitResponse as needed...

        // Create contract in DB
        $contract = $this->contractService->createContractForReservation($reservation, $request->all());

        // ...return response...
    }
}
