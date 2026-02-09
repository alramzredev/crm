<?php

namespace App\Http\Controllers;

use App\Models\StagingProperty;
use App\Repositories\StagingPropertyRepository;
use App\Services\StagingPropertyValidator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;

class StagingPropertyController extends Controller
{
    protected $repo;
    protected $validator;

    public function __construct(
        StagingPropertyRepository $repo,
        StagingPropertyValidator $validator
    ) {
        $this->repo = $repo;
        $this->validator = $validator;
    }

    public function index()
    {
        $this->authorize('viewAny', StagingProperty::class);

        return Inertia::render('StagingProperties/Index', [
            'stagingProperties' => $this->repo->getPaginatedRowsAll(Request::only('search', 'status', 'batch_id')),
            'filters' => Request::all('search', 'status', 'batch_id'),
        ]);
    }

    public function update($rowId)
    {
        $this->authorize('update', StagingProperty::class);

        $row = StagingProperty::findOrFail($rowId);
        $validated = Request::validate([
            'property_code' => ['nullable', 'string', 'max:50'],
            'property_no' => ['nullable', 'integer'],
            'project_code' => ['nullable', 'string', 'max:100'],
            'owner_name' => ['nullable', 'string', 'max:255'],
            'property_type_name' => ['nullable', 'string', 'max:150'],
            'property_class_name' => ['nullable', 'string', 'max:150'],
            'status_name' => ['nullable', 'string', 'max:100'],
            'city_name' => ['nullable', 'string', 'max:150'],
            'neighborhood_name' => ['nullable', 'string', 'max:150'],
            'total_square_meter' => ['nullable', 'numeric'],
            'total_units' => ['nullable', 'integer'],
            'count_available' => ['nullable', 'integer'],
        ]);

        $row->update($validated);

        // Revalidate after update
        $errors = $this->validator->validate($row);
        $row->update([
            'import_status' => count($errors) > 0 ? 'error' : 'valid',
            'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
        ]);

        return Redirect::back()->with('success', 'Row updated and revalidated.');
    }

    public function revalidate($rowId)
    {
        $this->authorize('update', StagingProperty::class);

        $row = StagingProperty::findOrFail($rowId);
        $errors = $this->validator->validate($row);

        $row->update([
            'import_status' => count($errors) > 0 ? 'error' : 'valid',
            'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
        ]);

        return Redirect::back()->with('success', 'Row revalidated.');
    }

    public function importRow($rowId)
    {
        $this->authorize('create', StagingProperty::class);

        $row = StagingProperty::findOrFail($rowId);

        if ($row->import_status !== 'valid') {
            return Redirect::back()->with('error', 'Only valid rows can be imported.');
        }

        try {
            $this->repo->importRow($row);
            $row->update(['import_status' => 'imported']);

            return Redirect::back()->with('success', 'Row imported successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}
