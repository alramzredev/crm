<?php

namespace App\Services;

use App\Models\StagingUnit;
use App\Models\Unit;
use App\Models\Owner;

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

        // Uniqueness check in main units table
        if (!empty($row->unit_code)) {
            $exists = Unit::where('unit_code', $row->unit_code)->exists();
            if ($exists) {
                $errors[] = 'Unit code already exists in database';
            }

            $duplicateInStaging = StagingUnit::where('unit_code', $row->unit_code)
                ->where('import_batch_id', $row->import_batch_id)
                ->where('id', '!=', $row->id)
                ->exists();

            if ($duplicateInStaging) {
                $errors[] = 'Duplicate unit code found in this import batch';
            }
        }

        return $errors;
    }
}
