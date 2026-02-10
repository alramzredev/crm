<?php

namespace App\Services;

use App\Models\StagingProperty;
use App\Models\Property;
use App\Models\Owner;
use App\Models\Project;

class StagingPropertyValidator
{
    public function validate(StagingProperty $row): array
    {
        $errors = [];

        // Required fields
        if (empty($row->property_code)) {
            $errors[] = 'Property code is required';
        }

        if (empty($row->project_code)) {
            $errors[] = 'Project code is required';
        } else {
            // Validate project exists
            $projectExists = Project::where('project_code', $row->project_code)->exists();
            if (!$projectExists) {
                $errors[] = "Project with code '{$row->project_code}' does not exist in the database";
            }
        }

        if (empty($row->owner_name)) {
            $errors[] = 'Owner name is required';
        } else {
            // Validate owner exists
            $ownerExists = Owner::where('name', $row->owner_name)->exists();
            if (!$ownerExists) {
                $errors[] = "Owner '{$row->owner_name}' does not exist in the database";
            }
        }

        if (empty($row->city_name)) {
            $errors[] = 'City name is required';
        }

        if (empty($row->status_name)) {
            $errors[] = 'Status is required';
        }

        // Format validations
        if (!empty($row->total_square_meter)) {
            if (!is_numeric($row->total_square_meter) || $row->total_square_meter < 0) {
                $errors[] = 'Total square meter must be a positive number';
            }
        }

        if (!empty($row->total_units)) {
            if (!is_numeric($row->total_units) || $row->total_units < 1) {
                $errors[] = 'Total units must be a positive integer';
            }
        }

        // Uniqueness check in main properties table
        if (!empty($row->property_code)) {
            $exists = Property::where('property_code', $row->property_code)->exists();
            if ($exists) {
                $errors[] = 'Property code already exists in database';
            }

            $duplicateInStaging = StagingProperty::where('property_code', $row->property_code)
                ->where('import_batch_id', $row->import_batch_id)
                ->where('id', '!=', $row->id)
                ->exists();

            if ($duplicateInStaging) {
                $errors[] = 'Duplicate property code found in this import batch';
            }
        }

        return $errors;
    }
}
