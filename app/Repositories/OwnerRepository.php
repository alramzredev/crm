<?php

namespace App\Repositories;

use App\Models\Owner;
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
}
