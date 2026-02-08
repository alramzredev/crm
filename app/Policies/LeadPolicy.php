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
        // Permission check
        if (!$user->hasPermissionTo('leads.view')) {
            return false;
        }

        // Sales employee: Can only view leads assigned to them from their projects
        if ($user->hasRole('sales_employee')) {
            // Check: Is this lead assigned to me?
            $isAssignedToMe = $lead->activeAssignment?->employee_id === $user->id;


            // Check: Is the lead's project in my allowed projects?
            $isInMyProject = $user->activeProjects()
                ->where('projects.id', $lead->project_id)
                ->exists();

            return $isAssignedToMe && $isInMyProject;
        }

        // Sales supervisor: Can view leads from their assigned projects
        if ($user->hasRole('sales_supervisor')) {
            return $user->activeProjects()
                ->where('projects.id', $lead->project_id)
                ->exists();
        }

        // Project manager and above: Can view all leads
        return true;
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('leads.create');
    }

    public function update(User $user, Lead $lead)
    {
        // Permission check
        if (!$user->hasPermissionTo('leads.edit')) {
            return false;
        }
        

        // Sales employee: Can only edit leads assigned to them
        if ($user->hasRole('sales_employee')) {
            $isAssignedToMe = $lead->activeAssignment?->employee_id === $user->id;

            // $isInMyProject = $user->activeProjects()
            //     ->where('projects.id', $lead->project_id)
            //     ->exists();

 

            // return $isAssignedToMe && $isInMyProject;
            return $isAssignedToMe;
        }

        // Supervisors and above: Can edit leads from their projects
        if ($user->hasRole('sales_supervisor')) {
            return $user->activeProjects()
                ->where('projects.id', $lead->project_id)
                ->exists();
        }

        return true;
    }

    public function delete(User $user, Lead $lead)
    {
        return $user->hasPermissionTo('leads.delete') && $this->update($user, $lead);
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
