<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\Owner;
use App\Models\City;
use App\Models\ProjectType;
use App\Models\ProjectOwnership;
use App\Models\ProjectStatus;
use App\Models\Country;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Request;

class ProjectRepository
{
    public function getPaginatedProjects(array $filters = [])
    {
        return Project::with('owner', 'city', 'projectType', 'ownership', 'status')
            ->orderBy('name')
            ->filter($filters)
            ->paginate()
            ->appends(Request::all());
    }

    public function getCreateData(): array
    {
        return [
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'projectTypes' => ProjectType::orderBy('name')->get(),
            'projectOwnerships' => ProjectOwnership::orderBy('name')->get(),
            'projectStatuses' => ProjectStatus::orderBy('name')->get(),
            'countries' => Country::orderBy('name')->get(),
        ];
    }

    public function getEditData(Project $project): array
    {
        return array_merge($this->getCreateData(), [
            'project' => $project->load('owner', 'city', 'projectType', 'ownership', 'status'),
        ]);
    }

    public function getShowResource(Project $project)
    {
        return new ProjectResource(
            $project->load([
                'owner',
                'city',
                'projectType',
                'ownership',
                'status',
                'properties',
                'properties.owner',
                'properties.status',
                'properties.propertyType',
                'properties.propertyClass',
                'properties.neighborhood'
            ])
        );
    }
}
