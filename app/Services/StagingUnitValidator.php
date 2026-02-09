<?php

namespace App\Services;

use App\Models\StagingUnit;
use App\Models\Unit;

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

        // Uniqueness check
        if (!empty($row->unit_code)) {
            $exists = Unit::where('unit_code', $row->unit_code)->exists();
            if ($exists) {
                $errors[] = 'Unit code already exists in database';
            }
        }

        return $errors;
    }
}
