<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('leads.view');
    }

    public function view(User $user, Lead $lead)
    {
        return $user->hasPermissionTo('leads.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('leads.create');
    }

    public function update(User $user, Lead $lead)
    {
        return $user->hasPermissionTo('leads.edit');
    }

    public function delete(User $user, Lead $lead)
    {
        return $user->hasPermissionTo('leads.delete');
    }

    public function restore(User $user, Lead $lead)
    {
        return $user->hasPermissionTo('leads.restore');
    }

    public function forceDelete(User $user, Lead $lead)
    {
        return $user->hasPermissionTo('leads.delete');
    }
}
