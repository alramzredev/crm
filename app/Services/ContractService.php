<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Reservation;
use App\Repositories\ContractRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class ContractService
{
    protected $repo;

    public function __construct(ContractRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getContract($id, array $with = [])
    {
        return $this->repo->find($id, $with);
    }

    public function getContractsForCustomer($customerId, array $with = [])
    {
        return $this->repo->getCustomerContracts($customerId, $with);
    }

    public function getContractsForProject($projectId, array $with = [])
    {
        return $this->repo->getProjectContracts($projectId, $with);
    }

    public function getContractsForReservation($reservationId, array $with = [])
    {
        return $this->repo->getReservationContracts($reservationId, $with);
    }

    public function createContractForReservation(Reservation $reservation, array $attributes = [])
    {
        return DB::transaction(function () use ($reservation, $attributes) {
            // Only allow contract generation if reservation is approved/confirmed
            if ($reservation->status !== 'confirmed') {
                throw new \Exception('Contract can only be generated for approved reservations.');
            }

            if ($reservation->contract) {
                throw new \Exception('Contract already exists for this reservation.');
            }

            $contract = Contract::create([
                'customer_id' => $reservation->customer_id,
                'reservation_id' => $reservation->id,
                'project_id' => $reservation->unit?->project_id,
                'unit_id' => $reservation->unit_id,
                'contract_date' => now(),
                'total_price' => $reservation->total_price,
                'currency' => $reservation->currency,
                'status' => 'pending_signature',
                'notes' => $attributes['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);

            // --- Signit API Integration ---
            $templateId = 'badf2ece-52e6-48f4-8f6a-13286c9a5b8a';
            $payload = [
                "name" => "استلام لاب توب2025",
                "roles" => [
                    [
                        "role" => "Employee",
                        "name" => "Basher",
                        "fields" => [
                            [
                                "id" => "ec16c21f-9bf4-4303-a4b8-5d3b71f4c14c",
                                "properties" => [
                                    "required" => true,
                                    "read_only" => false,
                                    "prefilled_value" => ""
                                ]
                            ],
                            [
                                "id" => "0d5e1aa4-5101-4140-8688-a7dc5f954372",
                                "properties" => [
                                    "required" => true,
                                    "read_only" => false,
                                    "prefilled_value" => ""
                                ]
                            ]
                        ],
                        "verification_method" => null,
                        "notification_method" => [
                            "email" => "b.mansour@alramzre.com"
                        ]
                    ],
                    [
                        "role" => "Client",
                        "name" => "Client",
                        "fields" => [
                            [
                                "id" => "85824fbd-2b23-4bf8-92d8-bbc8d853f9f0",
                                "properties" => [
                                    "required" => true,
                                    "read_only" => false,
                                    "prefilled_value" => ""
                                ]
                            ],
                            [
                                "id" => "9bccaea8-b648-4ea0-b42e-acc54494b0ed",
                                "properties" => [
                                    "required" => true,
                                    "read_only" => false,
                                    "prefilled_value" => ""
                                ]
                            ],
                            [
                                "id" => "e40fd16b-8da8-4818-a2a4-7f3e605a4d53",
                                "properties" => [
                                    "required" => true,
                                    "read_only" => false,
                                    "prefilled_value" => ""
                                ]
                            ]
                        ],
                        "verification_method" => null,
                        "notification_method" => [
                            "sms" => "+966580339372"
                        ]
                    ]
                ]
            ];

            $signitResponse = $this->generateSignitContractDocument($templateId, $payload);

            if (!$signitResponse) {
                throw new \Exception('Failed to generate contract document via Signit API.');
            }

            return $contract;
        });
    }

    /**
     * Get Signit API access token using client credentials.
     *
     * @return string|null
     */
    public function getSignitAccessToken(): ?string
    {
        $baseUrl = rtrim(config('services.signit.base_url'), '/');
        $url = $baseUrl . '/oauth/token';
        $username = config('services.signit.username');
        $password = config('services.signit.password');

        $response = Http::asForm()
            ->withBasicAuth($username, $password)
            ->post($url, [
                'scope' => 'signature-requests:write signature-requests:read',
                'grant_type' => 'client_credentials',
            ]);
 
        if ($response->successful()) {
            return $response->json('access_token');
        }

        // Optionally log error or throw exception
        return null;
    }

    /**
     * Generate a contract document via Signit API.
     *
     * @param string $templateId
     * @param array $payload
     * @return array|null
     */
    public function generateSignitContractDocument(string $templateId, array $payload): ?array
    {
        $accessToken = $this->getSignitAccessToken();
        if (!$accessToken) {
            return null;
        }

        $baseUrl = rtrim(config('services.signit.base_url'), '/');
        $url = "{$baseUrl}/templates/{$templateId}/signature-requests";

        $response = Http::withToken($accessToken)
            ->post($url, $payload);

        if ($response->successful()) {
            return $response->json();
        }

        // Optionally log error or throw exception
        return null;
    }
}
