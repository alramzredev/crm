<?php

namespace App\Repositories;

use App\Models\Owner;
use App\Models\OwnerType;
use Illuminate\Support\Facades\Request;

class OwnerRepository
{
    public function getPaginatedOwners(array $filters = [])
    {
        $query = Owner::query();

        if ($search = Request::get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if (Request::get('trashed')) {
            $query->onlyTrashed();
        }

        return $query->orderBy('name')->paginate()->appends(Request::all());
    }

    public function getCreateData(): array
    {
        return [
            'ownerTypes' => OwnerType::orderBy('name')->get(),
        ];
    }

    public function getEditData(Owner $owner): array
    {
        return [
            'owner' => $owner->load('ownerType'),
            'ownerTypes' => OwnerType::orderBy('name')->get(),
        ];
    }
}
