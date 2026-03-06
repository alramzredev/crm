<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Models\User;
use App\Models\LeadSource;
use App\Models\Project;
use App\Models\LeadStatus;

class LeadRepository
{
    // Now acts as a dumb data access layer

    public function query(array $with = [])
    {
        return Lead::with($with);
    }

    public function find($id, array $with = [])
    {
        return Lead::with($with)->find($id);
    }

 
    

    public function getCreateData(User $user)
    {
        // Service handles logic, this is just a passthrough for compatibility
        return null;
    }

    public function getEditData(Lead $lead)
    {
        // Service handles logic, this is just a passthrough for compatibility
        return null;
    }
}
