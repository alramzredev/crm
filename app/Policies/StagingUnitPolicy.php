<?php

namespace App\Policies;

use App\Models\StagingUnit;
use App\Models\User;

class StagingUnitPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('units.import');
    }

    public function view(User $user, StagingUnit $stagingUnit)
    {
        return $user->hasPermissionTo('units.import');
    }

    public function revalidate(User $user, StagingUnit $stagingUnit)
    {
        return $user->hasPermissionTo('units.import');
    }

    public function importRow(User $user, StagingUnit $stagingUnit)
    {
        return $user->hasPermissionTo('units.import');
    }

    public function update(User $user, StagingUnit $stagingUnit)
    {
        return $user->hasPermissionTo('units.import');
    }

    public function delete(User $user, StagingUnit $stagingUnit)
    {
        return $user->hasRole('super_admin') && $user->hasPermissionTo('units.import');
    }
}
