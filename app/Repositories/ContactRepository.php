<?php

namespace App\Repositories;

use App\Http\Resources\UserProjectCollection;
use Illuminate\Support\Facades\Request;

class ContactRepository
{
    public function getPaginatedContacts($account, array $filters = [])
    {
        return $account->contacts()
            ->with('project')
            ->orderByName()
            ->filter($filters)
            ->paginate()
            ->appends(Request::all());
    }

    public function getUserProjects($account)
    {
        return new UserProjectCollection(
            $account->projects()->orderBy('name')->get()
        );
    }
}
