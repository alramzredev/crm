<?php

namespace App\Policies;

use App\Models\ImportBatch;
use App\Models\User;

class ImportBatchPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('import-batches.view');
    }

    public function view(User $user, ImportBatch $importBatch)
    {
        return $user->hasPermissionTo('import-batches.view');
    }

    public function retry(User $user, ImportBatch $importBatch)
    {
        return $user->hasPermissionTo('import-batches.retry');
    }

    public function delete(User $user, ImportBatch $importBatch)
    {
        return $user->hasPermissionTo('import-batches.delete');
    }
}
