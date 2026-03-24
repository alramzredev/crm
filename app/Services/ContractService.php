<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractType;
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

    // public function getContractsForReservation($reservationId, array $with = [])
    // {
    //     return $this->repo->getReservationContracts($reservationId, $with);
    // }

    public function createContractForReservation(Reservation $reservation, array $attributes = [])
    {
        return DB::transaction(function () use ($reservation, $attributes) {
            // Only allow contract generation if reservation is approved/confirmed
             if ($reservation->status->value  !== 'confirmed') {
                throw new \Exception('Contract can only be generated for approved reservations.');
            }

            if (empty($attributes['contract_type_code'])) {
                throw new \Exception('Contract type code is required.');
            }

            // Support multiple contract types
            $contractTypeCode = $attributes['contract_type_code'];
            $contractType = ContractType::where('code', $contractTypeCode)->first();
            if (!$contractType) {
                throw new \Exception('Invalid contract type.');
            }

            // Prevent duplicate contract of same type for this reservation
            $exists = $reservation->contracts()->where('contract_type_id', $contractType->id)->exists();
            if ($exists) {
                throw new \Exception('Contract of this type already exists for this reservation.');
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
                'contract_type_id' => $contractType->id,
            ]);

            // --- Signit API Integration ---
            $templateId = $contractType->template_id ?? null;
            if (!$templateId) {
                throw new \Exception('No Signit template ID configured for this contract type.');
            }


             $payload = $this->getSignitPayloadForTemplate($templateId, $reservation, $contractType);
 
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
            // dd($response->body());

        if ($response->successful()) {
            return $response->json();
        }

        // Optionally log error or throw exception
        return null;
    }

    /**
     * Return the correct payload for the given templateId.
     * You can expand this method to handle more templates as needed.
     */
    protected function getSignitPayloadForTemplate($templateId, Reservation $reservation, ContractType $contractType)
    {
        switch ($templateId) {
            case 'badf2ece-52e6-48f4-8f6a-13286c9a5b8a':
                return [
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
             case 'fdad572e-50d2-4613-bf71-80b2fc66b492':

    $salesManagerFields = [
        "26740114-bb1d-4190-955b-91bead13b358" => $reservation->unit->unit_code, // Unit Code
        "fd64d77e-668d-4974-87db-7c8ab0184bd8" => $reservation->city->name ?? 'N/A', // City Name
        "040f4a3d-7301-4980-91d9-9467fd859f51" => auth()->user()->name ?? 'N/A', // Sales Manager Name
        "377f898a-81ae-42cf-98de-84e933ee7baf" => "Sales Manager", // Job Title
        "26af353d-b567-4d33-a52c-4a5c1bae8b71" => $reservation->customer->name ?? 'N/A', // Customer Name
        "f14a2b77-409c-4056-9810-389b73fa3c1b" => $reservation->customer->nationality ?? 'N/A', // Customer Nationality
        "6ff84b85-f04f-4a06-ade5-1d0e5916a2f0" => $reservation->customer->lead->national_id ?? 'N/A', // Text field
        "792044b5-9621-464e-b3ed-2efbfd3c0d8d" => '966580339372' ?? 'N/A', // Text field
        "ff1dc3d2-72bf-4f28-936b-16ec79298ffc" => '966580339372' ?? 'N/A', // Phone Number
        "c6caf4c8-0c51-4c1d-b37a-53931e7049b5" => 'b_mansour77@outlook.com' ?? 'N/A', // Email
        "736b0bae-955b-425f-80da-5c8ada6e1493" => $reservation->unit_code ?? 'N/A', // Unit Code
        "d8723ea5-8a43-43ed-b26f-acbfc47194a9" => $reservation->property_code ?? 'N/A', // Property Code
        "4776ba7d-381b-4edf-8024-7dcf75669f76" => $reservation->project->name ?? 'N/A', // Project Name
        "619e2970-2413-4216-a528-db7ac0d42ca3" => $reservation->street ?? 'N/A', // Street Name
        "2d1f6d2e-8193-441f-86dd-913652ffd9e1" => $reservation->neighborhood ?? 'N/A', // City
        "d74de377-6a3d-4923-9442-f9a1eea9d632" => $reservation->unit->area ?? 'N/A', // Space
        "356551f2-7b3a-44a6-8dd6-83511d94d18a" => now()->format('Y-m-d'), // Date
        "daf154af-2d5b-49e0-8c34-81a2919724c8" => $reservation->price ?? 'N/A', // Unit Price
        "1f94f182-dddf-4fdd-9d78-cd4f82e35fbc" => $reservation->deposit_amount ?? 'N/A', // Deposit Amount
        "dcf367f0-4c76-4a85-acb7-840c9a474b06" => $reservation->transaction_number ?? 'N/A', // Transaction Number
        "1a538906-651a-485e-b49c-754a9d6fa925" => $reservation->payment_method ?? 'N/A', // Payment Method
        "fa75a087-56aa-49a9-ad4b-5518b54a7ac8" => $reservation->payment_date ?? now()->format('Y-m-d'), // Payment Date
        "00a37cee-18ae-4c6f-b3e3-56690954a532" => $reservation->customer->name ?? 'N/A', // Customer Name
        "871f576d-02ac-4240-8045-768b0913fe11" => auth()->user()->name ?? 'N/A', // Sales Manager Name
        "8f05c936-8c29-4ce0-b8ba-dc7a25c8007e" => $reservation->deposit_amount ?? 'N/A', // Deposit amount
        "748e866f-5b50-4c2d-a87f-c33fed0fc3ee" => now()->format('Y-m-d'), // Date
    ];

    $fields = [];

    foreach ($salesManagerFields as $id => $value) {
        $fields[] = [
            "id" => $id,
            "properties" => [
                "required" => true,
                "read_only" => true,
                "prefilled_value" => $value
            ]
        ];
    }

    // signature field
    $fields[] = [
        "id" => "35c27672-770d-4b08-a16d-fbb162e560c7", // Signature
        "properties" => [
            "required" => true,
            "read_only" => false,
            "prefilled_value" => ""
        ]
    ];

    return [
        "name" => "Private_Ownership_Deposit_Contract_Template_V01",
        "roles" => [
            [
                "role" => "Sales Manager",
                "name" => auth()->user()->name,
                "fields" => $fields,
                "verification_method" => null,
                "notification_method" => [
                    "email" => auth()->user()->email
                ]
            ],
            [
                "role" => "Customer",
                "name" => $reservation->customer->name ?? '',
                "fields" => [
                    [
                        "id" => "8b6db56c-7ff9-4cde-8f29-6e64b724ab9e", // Customer Signature
                        "properties" => [
                            "required" => true,
                            "read_only" => false,
                            "prefilled_value" => ""
                        ]
                    ]
                ],
                "verification_method" => null,
                "notification_method" => [
                    "email" => $reservation->customer->email ?? ''
                ]
            ]
        ]
    ];
            
            default:
                throw new \Exception('No payload defined for this contract template.');
        }
    }
}
