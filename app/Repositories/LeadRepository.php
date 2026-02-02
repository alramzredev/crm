<?php

namespace App\Repositories;

use App\Models\Lead;
use Illuminate\Support\Facades\Request;

class LeadRepository
{
    public function getPaginatedLeads(array $filters = [])
    {
        return Lead::with('project')
            ->orderByName()
            ->filter($filters)
            ->paginate()
            ->appends(Request::all());
    }
}
