<?php

namespace App\Repositories;

use App\Models\StagingProject;
use App\Models\ImportBatch;
use App\Models\Project;
use App\Models\Owner;
use App\Models\City;
use App\Models\ProjectType;
use App\Models\ProjectStatus;
use Illuminate\Support\Facades\Request;

class StagingProjectRepository
{
    public function getPaginatedBatches($filters = [])
    {
        return ImportBatch::with('creator')
            ->where('import_type', 'projects')
            ->orderByDesc('created_at')
            ->paginate(25)
            ->appends(Request::all());
    }

    public function getPaginatedRows($batchId, $filters = [])
    {
        $query = StagingProject::where('import_batch_id', $batchId);

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('import_status', Request::get('status'));
        }

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('project_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('row_number')->paginate(50)->appends(Request::all());
    }

    public function getPaginatedRowsAll($filters = [])
    {
        $query = StagingProject::query();

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('import_status', Request::get('status'));
        }

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('project_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%");
            });
        }

        if (Request::get('batch_id')) {
            $query->where('import_batch_id', Request::get('batch_id'));
        }

        return $query->orderByDesc('id')->paginate(50)->appends(Request::all());
    }

    public function getBatchInfo($batchId)
    {
        return ImportBatch::where('batch_uuid', $batchId)->first();
    }

    public function importRow(StagingProject $row)
    {
        // Skip if project code already exists
        $existingProject = Project::where('project_code', $row->project_code)->first();
        if ($existingProject) {
            throw new \Exception("Project with code '{$row->project_code}' already exists in the system");
        }

        // Find or create owner
        $owner = Owner::firstOrCreate(
            ['name' => $row->owner_name],
            ['type' => 'individual']
        );

        // Find or create city
        $city = City::firstOrCreate(
            ['name' => $row->city_name],
            ['code' => strtoupper(str_replace(' ', '_', $row->city_name))]
        );

        // Find or create project type
        $projectType = ProjectType::firstOrCreate(
            ['name' => $row->project_type_name]
        );

        // Find or create project status
        $projectStatus = ProjectStatus::firstOrCreate(
            ['name' => $row->status_name]
        );

        // Create project
        Project::create([
            'project_code' => $row->project_code,
            'name' => $row->name,
            'owner_id' => $owner->id,
            'city_id' => $city->id,
            'project_type_id' => $projectType->id,
            'status_id' => $projectStatus->id,
            'reservation_period_days' => $row->reservation_period_days ?? 30,
            'land_area' => $row->land_area,
            'built_up_area' => $row->built_up_area,
            'selling_space' => $row->selling_space,
            'sellable_area_factor' => $row->sellable_area_factor,
            'floor_area_ratio' => $row->floor_area_ratio,
            'no_of_floors' => $row->no_of_floors,
            'number_of_units' => $row->number_of_units,
            'budget' => $row->budget,
            'warranty' => $row->warranty,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);
    }
}
