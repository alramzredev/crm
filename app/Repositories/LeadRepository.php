<?php

namespace App\Repositories;

use App\Models\Lead;
use Illuminate\Support\Facades\Request;

class LeadRepository
{
    public function getPaginatedLeads(array $filters = [])
    {
        $query = Lead::query();

        if ($search = Request::get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (Request::get('trashed')) {
            $query->onlyTrashed();
        }

        return $query->orderBy('last_name')->orderBy('first_name')->paginate()->appends(Request::all());
    }
}
