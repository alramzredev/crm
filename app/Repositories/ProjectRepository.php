<?php

namespace App\Repositories;

use App\Models\Project;

class ProjectRepository
{
    /**
     * Return a base query for projects, optionally eager loading relations.
     */
    public function query(array $with = [])
    { 
        $user = auth()->user();
        if($user){
             return Project::with($with)->forUser($user);
        }
        return Project::with($with);
    }

    /**
     * Find a project by ID.
     */
    public function find($id, array $with = [])
    {
        return Project::with($with)->find($id);
    }

    /**
     * Get properties for a project (paginated).
     */
    public function getProjectProperties(Project $project, int $perPage = 25)
    {
        return $project->properties()
            ->with(['project', 'owner', 'status'])
            ->orderBy('property_code')
            ->paginate($perPage)
            ->appends(request()->query());
    }
}
