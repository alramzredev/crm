<?php

namespace App\Services;

use App\Models\StagingUnit;
use App\Models\Unit;
use App\Models\Owner;
use App\Models\Project;
use App\Models\Property;
use App\Models\UnitStatus;

class StagingUnitValidator
{
    public function validate(StagingUnit $row): array
    {
        $errors = [];

        // Required fields
        if (empty($row->unit_code)) {
            $errors[] = 'Unit code is required';
        }

        if (empty($row->property_code)) {
            $errors[] = 'Property code is required';
        }

        if (empty($row->project_code)) {
            $errors[] = 'Project code is required';
        }

        if (empty($row->status_name)) {
            $errors[] = 'Status is required';
        } else {
            // Validate status exists in unit_statuses
            $statusExists = UnitStatus::where('name', $row->status_name)->exists();
            if (!$statusExists) {
                $errors[] = "Unit status '{$row->status_name}' does not exist in the database";
            }
        }

        // Validate project_code exists
        if (!empty($row->project_code)) {
            $projectExists = Project::where('project_code', $row->project_code)->exists();
            if (!$projectExists) {
                $errors[] = "Project code '{$row->project_code}' does not exist in the database";
            }
        }

        // Validate property_code exists
        if (!empty($row->property_code)) {
            $propertyExists = Property::where('property_code', $row->property_code)->exists();
            if (!$propertyExists) {
                $errors[] = "Property code '{$row->property_code}' does not exist in the database";
            }
        }

        // Validate owner if provided
        if (!empty($row->owner_name)) {
            $ownerExists = Owner::where('name', $row->owner_name)->exists();
            if (!$ownerExists) {
                $errors[] = "Owner '{$row->owner_name}' does not exist in the database";
            }
        }

        // Format validations
        if (!empty($row->area)) {
            if (!is_numeric($row->area) || $row->area < 0) {
                $errors[] = 'Area must be a positive number';
            }
        }

        if (!empty($row->rooms)) {
            if (!is_numeric($row->rooms) || $row->rooms < 0) {
                $errors[] = 'Rooms must be a positive integer';
            }
        }

        if (!empty($row->price)) {
            if (!is_numeric($row->price) || $row->price < 0) {
                $errors[] = 'Price must be a positive number';
            }
        }

        // Uniqueness check: unit_code must be unique per property
        if (!empty($row->unit_code) && !empty($row->property_code)) {
            $property = Property::where('property_code', $row->property_code)->first();

            if ($property) {
                // Check if unit code already exists for this property in main table
                $exists = Unit::where('unit_code', $row->unit_code)
                    ->where('property_id', $property->id)
                    ->exists();

                if ($exists) {
                    $errors[] = 'Unit code already exists for this property in database';
                }

                // Check for duplicates within staging batch for same property
                $duplicateInStaging = StagingUnit::where('unit_code', $row->unit_code)
                    ->where('property_code', $row->property_code)
                    ->where('import_batch_id', $row->import_batch_id)
                    ->where('id', '!=', $row->id)
                    ->exists();

                if ($duplicateInStaging) {
                    $errors[] = 'Duplicate unit code found for this property in this import batch';
                }
            }
        }

        return $errors;
    }
}
