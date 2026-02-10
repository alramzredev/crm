<?php

namespace App\Services;

use App\Models\StagingProject;
use App\Models\Project;
use App\Models\Owner;

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

        if (empty($data['project_code'])) {
            $errors[] = 'Project code is required';
        }

        if (empty($data['owner_name'])) {
            $errors[] = 'Owner name is required';
        } else {
            // Validate owner exists
            $ownerExists = Owner::where('name', $data['owner_name'])->exists();
            if (!$ownerExists) {
                $errors[] = "Owner '{$data['owner_name']}' does not exist in the database";
            }
        }

        if (empty($data['city_name'])) {
            $errors[] = 'City name is required';
        }

        if (empty($data['status_name'])) {
            $errors[] = 'Status is required';
        }

        // Validate project_code uniqueness in main projects table
        if (!empty($data['project_code'])) {
            $exists = Project::where('project_code', $data['project_code'])->exists();
            if ($exists) {
                $errors[] = 'Project code already exists in database';
            }
            
            // Check for duplicates within staging table (same batch)
            $duplicateInStaging = StagingProject::where('project_code', $data['project_code'])
                ->where('import_batch_id', $data['import_batch_id'])
                ->where('id', '!=', $data['id'])
                ->exists();
            
            if ($duplicateInStaging) {
                $errors[] = 'Duplicate project code found in this import batch';
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
