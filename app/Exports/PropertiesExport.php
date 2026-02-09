<?php

namespace App\Exports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PropertiesExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Property::with(['project', 'owner', 'propertyType', 'propertyClass', 'status', 'neighborhood'])
            ->get()
            ->map(function ($property) {
                return [
                    'property_code' => $property->property_code,
                    'property_no' => $property->property_no,
                    'project_id' => $property->project?->id,
                    'project_name' => $property->project?->name,
                    'owner_id' => $property->owner?->id,
                    'owner_name' => $property->owner?->name,
                    'status_id' => $property->status_id,
                    'status' => $property->status?->name,
                    'property_type_id' => $property->property_type_id,
                    'property_type' => $property->propertyType?->name,
                    'property_class_id' => $property->property_class_id,
                    'property_class' => $property->propertyClass?->name,
                    'neighborhood_id' => $property->neighborhood_id,
                    'neighborhood' => $property->neighborhood?->name,
                    'diagram_number' => $property->diagram_number,
                    'instrument_no' => $property->instrument_no,
                    'license_no' => $property->license_no,
                    'lot_no' => $property->lot_no,
                    'total_square_meter' => $property->total_square_meter,
                    'total_units' => $property->total_units,
                    'count_available' => $property->count_available,
                    'notes' => $property->notes,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Property Code',
            'Property No',
            'Project ID',
            'Project Name',
            'Owner ID',
            'Owner Name',
            'Status ID',
            'Status',
            'Property Type ID',
            'Property Type',
            'Property Class ID',
            'Property Class',
            'Neighborhood ID',
            'Neighborhood',
            'Diagram Number',
            'Instrument No',
            'License No',
            'Lot No',
            'Total Square Meter',
            'Total Units',
            'Count Available',
            'Notes',
        ];
    }
}
