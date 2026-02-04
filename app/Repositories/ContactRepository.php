<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Support\Facades\Request;

class UserProjectCollection
{
    public function __construct($projects)
    {
        $this->projects = $projects;
    }

    public function toArray($request)
    {
        return [
            'data' => $this->projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                ];
            }),
        ];
    }
}
