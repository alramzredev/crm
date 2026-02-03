<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Http\Resources\UserProjectCollection;
use App\Models\Project;
use Illuminate\Support\Facades\Request;

class ContactRepository
{
    public function getPaginatedContacts(array $filters = [])
    {
        return Contact::with('project')
            ->orderByName()
            ->filter($filters)
            ->paginate()
            ->appends(Request::all());
    }

    public function getUserProjects()
    {
        return new UserProjectCollection(
            Project::orderBy('name')->get()
        );
    }
}
