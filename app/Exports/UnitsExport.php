<?php

namespace App\Exports;

use App\Models\Unit;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UnitsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Unit::with(['project', 'property', 'propertyType', 'status'])
            ->get()
            ->map(function ($unit) {
                return [
                    'unit_code' => $unit->unit_code,
                    'unit_external_id' => $unit->unit_external_id,
                    'project_id' => $unit->project?->id,
                    'project_name' => $unit->project?->name,
                    'property_id' => $unit->property?->id,
                    'property_code' => $unit->property?->property_code,
                    'property_type_id' => $unit->property_type_id,
                    'property_type' => $unit->propertyType?->name,
                    'status_id' => $unit->status_id,
                    'status' => $unit->status?->name,
                    'floor' => $unit->floor,
                    'area' => $unit->area,
                    'building_surface_area' => $unit->building_surface_area,
                    'housh_area' => $unit->housh_area,
                    'rooms' => $unit->rooms,
                    'wc_number' => $unit->wc_number,
                    'price' => $unit->price,
                    'price_base' => $unit->price_base,
                    'currency' => $unit->currency,
                    'model' => $unit->model,
                    'purpose' => $unit->purpose,
                    'unit_type' => $unit->unit_type,
                    'owner' => $unit->owner,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Unit Code',
            'External ID',
            'Project ID',
            'Project Name',
            'Property ID',
            'Property Code',
            'Property Type ID',
            'Property Type',
            'Status ID',
            'Status',
            'Floor',
            'Area',
            'Building Surface Area',
            'Housh Area',
            'Rooms',
            'WC Number',
            'Price',
            'Price Base',
            'Currency',
            'Model',
            'Purpose',
            'Unit Type',
            'Owner',
        ];
    }
}
