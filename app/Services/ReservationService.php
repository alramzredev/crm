<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Customer;
use App\Models\User;
use App\Http\Resources\ReservationResource;
use App\Http\Requests\ReservationStoreRequest;
use App\Repositories\ReservationRepository;
use Illuminate\Support\Facades\DB;

class ReservationService
{
    protected $repo;

    public function __construct(ReservationRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getPaginatedReservations(User $user, array $filters = [])
    {
        return $this->repo->getPaginatedReservations($user, $filters);
    }

    public function getCreateData(int $leadId, User $user): array
    {
        $lead = Lead::findOrFail($leadId);

        $paymentMethods = \App\Models\PaymentMethod::where('is_active', 1)->get();
        $paymentPlans = \App\Models\PaymentPlan::where('is_active', 1)->get();

        return compact('lead', 'paymentMethods', 'paymentPlans');
    }

    public function storeReservation(array $validated, array $leadData, $request): Reservation
    {
        return DB::transaction(function () use ($validated, $leadData, $request) {
            // Lead update
            $lead = Lead::findOrFail($validated['lead_id']);
            $lead->update($leadData);

            // Create or update customer with lead data
            $customer = Customer::firstOrCreate(
                ['lead_id' => $lead->id],
                [
                    'first_name' => $lead->first_name,
                    'last_name' => $lead->last_name,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                ]
            );

            // Update customer if needed
            if ($customer->wasRecentlyCreated === false) {
                $customer->update([
                    'first_name' => $lead->first_name,
                    'last_name' => $lead->last_name,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                ]);
            }

            // Create required documents for customer
            if ($customer->wasRecentlyCreated) {
                $requiredTypes = \App\Models\DocumentType::where('applies_to', 'customer')->get();
                foreach ($requiredTypes as $type) {
                    // Optionally, you can initialize empty media collections if needed,
                    // but Spatie Media Library will handle collections automatically.
                }
            }

            $validated['customer_id'] = $customer?->id;

            return $this->createReservation($validated, $leadData, $request);
        });
    }

    
    protected function createReservation(array $validated, array $leadData, $request): Reservation
    {
        return DB::transaction(function () use ($validated, $leadData, $request) {
            $lead = Lead::findOrFail($validated['lead_id']);
            $lead->update($leadData);

            $total = $validated['total_price'] ?? null;
            $down = $validated['down_payment'] ?? null;

            if (empty($validated['remaining_amount']) && $total !== null && $down !== null) {
                $validated['remaining_amount'] = max(0, (float) $total - (float) $down);
            }

            if ($request->hasFile('national_address_file')) {
                $validated['national_address_file'] = $request->file('national_address_file')
                    ->store('reservations/national-address', 'public');
            }

            if ($request->hasFile('national_id_file')) {
                $validated['national_id_file'] = $request->file('national_id_file')
                    ->store('reservations/national-id', 'public');
            }

            // Get unit and its project to calculate expiration
            $unit = Unit::with('property.project')->findOrFail($validated['unit_id']);
            $project = $unit->property?->project;
            $reservationPeriodDays = $project?->reservation_period_days ?? 30;

            $reservation = new Reservation();
            $reservation->lead_id = $validated['lead_id'];
            $reservation->unit_id = $validated['unit_id'];
            $reservation->customer_id = $validated['customer_id'];
            $reservation->status = $validated['status'] ?? 'draft';
            $reservation->started_at = now();
            $reservation->expires_at = now()->addDays($reservationPeriodDays);
            $reservation->payment_method_id = $validated['payment_method_id'] ?? null;
            $reservation->payment_plan_id = $validated['payment_plan_id'] ?? null;
            $reservation->base_price = $validated['total_price'] ?? null;
            $reservation->total_price = $validated['total_price'] ?? null;
            $reservation->down_payment = $validated['down_payment'] ?? null;
            $reservation->remaining_amount = $validated['remaining_amount'] ?? null;
            $reservation->currency = $validated['currency'] ?? 'SAR';
            $reservation->terms_accepted = $validated['terms_accepted'] ?? false;
            $reservation->privacy_accepted = $validated['privacy_accepted'] ?? false;
            $reservation->notes = $validated['notes'] ?? null;
            $reservation->created_by = auth()->id();
            $reservation->updated_by = auth()->id();
            $reservation->save();

            return $reservation;
        });
    }

    public function getShowData(Reservation $reservation): ReservationResource
    {
        return new ReservationResource(
            $reservation->load([
                'lead', 'unit.project', 'customer', 'payments.receipts', 'cancelReason',
                'contracts', 'contract' , 'paymentMethod', 'paymentPlan'
            ])
        );   
    }

    public function getEditData(Reservation $reservation): ReservationResource
    {
        return new ReservationResource(
            $reservation->load([
                'lead', 'unit.project', 'customer', 'payments.receipts', 'cancelReason',
                'contracts', 'contract' , 'paymentMethod', 'paymentPlan'
            ])
        );
    }

    public function getShowPageData(Reservation $reservation): array
    {
        $approvalService = new \App\Services\ReservationApprovalService();
        $canApprove = $approvalService->canApproveReservation($reservation);

        // Discount requests
        $discountRequests = $reservation->discountRequests()->with('requester')->orderByDesc('created_at')->get();

        // Customer documents
        $customer = $reservation->customer;
        $customerDocuments = [];
        if ($customer) {
            $requiredTypes = \App\Models\DocumentType::where('applies_to', 'customer')->get();
            foreach ($requiredTypes as $type) {
                $media = $customer->getMedia($type->code)->first();
                $customerDocuments[] = [
                    'type' => $type->code,
                    'type_name' => $type->name,
                    'is_required' => $type->is_required,
                    'status' => $media ? ($media->getCustomProperty('status') ?? 'approved') : 'pending',
                    'media' => $media ? [
                        'id' => $media->id,
                        'file_name' => $media->file_name,
                        'mime_type' => $media->mime_type,
                        'size' => $media->size,
                        'url' => $media->getFullUrl(),
                        'created_at' => $media->created_at,
                    ] : null,
                    'expires_at' => $media ? $media->getCustomProperty('expires_at') : null,
                    'rejection_reason' => $media ? $media->getCustomProperty('rejection_reason') : null,
                ];
            }
        }

        $contractDocuments = \App\Http\Resources\ContractResource::collection($reservation->contracts ?? []);
        $canGenerateContract = true;
        $contractTypes = \App\Models\ContractType::all();

        return [
            'reservation' => $this->getShowData($reservation),
            'cancelReasons' => \App\Models\ReservationCancelReason::active()->ordered()->get(),
            'canApprove' => $canApprove,
            'discountRequests' => $discountRequests,
            'customerDocuments' => $customerDocuments,
            'canGenerateContract' => $canGenerateContract,
            'contractDocuments' => $contractDocuments,
            'contractTypes' => $contractTypes,
        ];
    }

    public function updateReservation(Reservation $reservation, array $validated)
    {
        // Update reservation fields
        $reservation->update($validated);

         if (
            isset($validated['first_name']) ||
            isset($validated['last_name']) ||
            isset($validated['email']) ||
            isset($validated['phone']) ||
            isset($validated['national_id'])
        ) {
            $customer = $reservation->customer;
            if ($customer) {
                $customer->update([
                    'first_name' => $validated['first_name'] ?? $customer->first_name,
                    'last_name' => $validated['last_name'] ?? $customer->last_name,
                    'email' => $validated['email'] ?? $customer->email,
                    'phone' => $validated['phone'] ?? $customer->phone,
                    'national_id' => $validated['national_id'] ?? $customer->national_id,
                ]);
            }
        }
    }
}
