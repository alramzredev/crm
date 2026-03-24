<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use App\Models\ContractType;

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

         request()->validate([
            'contract_type_code' => ['required', 'exists:contract_types,code'],
        ]);

        $contractTypeCode = request('contract_type_code');
        
         try {
            $contract = $this->contractService->createContractForReservation($reservation, [
                'contract_type_code' => $contractTypeCode,
            ]);
            return Redirect::back()->with('success', 'Contract generated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

}
