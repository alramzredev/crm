<?php

namespace App\Services;

use App\Models\StagingProject;
use App\Models\Project;
use Illuminate\Support\Facades\Validator;

class StagingProjectValidator
{
    public function validate(StagingProject $stagingProject)
    {
        $errors = [];
        $data = $stagingProject;
 
 
        // Validate required fields
        if (empty($data['name'])) {
            $errors[] = 'Project name is required';
        }

        // Validate project_code uniqueness
        if (!empty($data['project_code'])) {
            $exists = Project::where('project_code', $data['project_code'])->exists();
            if ($exists) {
                $errors[] = 'Project code already exists';
            }
        }

        // Validate reservation period
        if (!empty($data['reservation_period_days'])) {
            if (!is_numeric($data['reservation_period_days']) || 
                $data['reservation_period_days'] < 1 || 
                $data['reservation_period_days'] > 365) {
                $errors[] = 'Reservation period must be between 1 and 365 days';
            }
        }

        return $errors;
    }
}
