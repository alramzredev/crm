<?php

namespace App\Repositories;

use App\Models\Reservation;
use App\Models\User;
use App\Http\Resources\ReservationResource;
use Illuminate\Support\Facades\Request;

class ReservationRepository
{
    public function getPaginatedReservations(User $user, array $filters = [])
    {
        return ReservationResource::collection(
            Reservation::with(['lead', 'unit', 'customer'])
                ->filterByUserRole($user)
                ->when(Request::get('search'), fn ($q, $search) =>
                    $q->where(function ($q2) use ($search) {
                        $q2->where('reservation_code', 'like', "%{$search}%")
                           ->orWhereHas('lead', function ($q3) use ($search) {
                               $q3->where('first_name', 'like', "%{$search}%")
                                  ->orWhere('last_name', 'like', "%{$search}%");
                           });
                    })
                )
                ->when(Request::get('status'), fn ($q, $status) =>
                    $q->where('status', $status)
                )
                ->when(Request::get('trashed'), fn ($q, $trashed) =>
                    $trashed === 'with' ? $q->withTrashed() : ($trashed === 'only' ? $q->onlyTrashed() : $q)
                )
                ->orderByDesc('created_at')
                ->paginate()
                ->appends(Request::all())
        );
    }
}
