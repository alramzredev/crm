<?php

namespace App\Exports;

use App\Models\Project;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Facades\Auth;

class ProjectsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        $user = Auth::user();
        
        $query = Project::with(['owner', 'city', 'projectType', 'status']);
        
        // Apply user role filters
        if (!$user->hasRole('super_admin')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.is_active', true);
            });
        }
        
        return $query->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'Project Code',
            'Name',
            'Reservation Period (Days)',
            'Owner Name',
            'City Name',
            'Neighborhood',
            'Location',
            'Project Type',
            'Status',
            'Status Reason',
            'Land Area',
            'Built Up Area',
            'Selling Space',
            'Sellable Area Factor',
            'Floor Area Ratio',
            'No of Floors',
            'Number of Units',
            'Budget',
            'Warranty',
        ];
    }

    public function map($project): array
    {
        return [
            $project->project_code,
            $project->name,
            $project->reservation_period_days,
            $project->owner->name ?? '',
            $project->city->name ?? '',
            $project->neighborhood->name ?? '',
            $project->location,
            $project->projectType->name ?? '',
            $project->status->name ?? '',
            $project->status_reason,
            $project->land_area,
            $project->built_up_area,
            $project->selling_space,
            $project->sellable_area_factor,
            $project->floor_area_ratio,
            $project->no_of_floors,
            $project->number_of_units,
            $project->budget,
            $project->warranty ? 'Yes' : 'No',
        ];
    }
}
