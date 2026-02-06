<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('users.view');
    }

    public function view(User $user, User $model)
    {
        return $user->hasPermissionTo('users.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('users.create');
    }

    public function update(User $user, User $model)
    {
        return $user->hasPermissionTo('users.edit');
    }

    public function delete(User $user, User $model)
    {
        return $user->hasPermissionTo('users.delete');
    }

    public function restore(User $user, User $model)
    {
        return $user->hasPermissionTo('users.restore');
    }

    public function forceDelete(User $user, User $model)
    {
        return $user->hasPermissionTo('users.delete');
    }

    /**
     * Check if user can assign projects to an employee
     */
    public function assignProjects(User $user, User $employee)
    {
        // Must be a sales supervisor
        if (!$user->hasRole('sales_supervisor')) {
            return false;
        }

        // Employee must be a sales employee
        if (!$employee->hasRole('sales_employee')) {
            return false;
        }

        // User must supervise this employee
        return $user->salesEmployees()
            ->where('sales_teams.employee_id', $employee->id)
            ->exists();
    }

    /**
     * Check if user can remove an employee from a project
     */
    public function removeFromProject(User $user, User $employee)
    {
        // Must be a sales supervisor
         if (!$user->hasRole('sales_supervisor')) {
            return false;
        }

        // Employee must be a sales employee
        if (!$employee->hasRole('sales_employee')) {
            return false;
        }

        // User must supervise this employee
        return $user->salesEmployees()
            ->where('sales_teams.employee_id', $employee->id)
            ->exists();
    }
}
