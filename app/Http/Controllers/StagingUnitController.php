<?php

namespace App\Http\Controllers;

use App\Models\StagingUnit;
use App\Repositories\StagingUnitRepository;
use App\Services\StagingUnitValidator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UnitImport;

class StagingUnitController extends Controller
{
    protected $repo;
    protected $validator;

    public function __construct(
        StagingUnitRepository $repo,
        StagingUnitValidator $validator
    ) {
        $this->repo = $repo;
        $this->validator = $validator;
    }

    public function index()
    {
        $this->authorize('viewAny', StagingUnit::class);

        return Inertia::render('StagingUnits/Index', [
            'stagingUnits' => $this->repo->getPaginatedRowsAll(Request::only('search', 'status', 'batch_id')),
            'filters' => Request::all('search', 'status', 'batch_id'),
        ]);
    }

    public function update($rowId)
    {
        $row = StagingUnit::findOrFail($rowId);
        $this->authorize('update', $row);

        $validated = Request::validate([
            'unit_code' => ['nullable', 'string', 'max:100'],
            'property_code' => ['nullable', 'string', 'max:50'],
            'project_code' => ['nullable', 'string', 'max:100'],
            'status_name' => ['nullable', 'string', 'max:100'],
            'floor' => ['nullable', 'string', 'max:50'],
            'area' => ['nullable', 'numeric'],
            'rooms' => ['nullable', 'integer'],
            'price' => ['nullable', 'numeric'],
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
        $row = StagingUnit::findOrFail($rowId);
        $this->authorize('revalidate', $row);

        $errors = $this->validator->validate($row);

        $row->update([
            'import_status' => count($errors) > 0 ? 'error' : 'valid',
            'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
        ]);

        return Redirect::back()->with('success', 'Row revalidated.');
    }

    public function importRow($rowId)
    {
        $row = StagingUnit::findOrFail($rowId);
        $this->authorize('importRow', $row);

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

    public function store()
    {
        $this->authorize('create', StagingUnit::class);

        Request::validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
        ]);

        $user = Request::user();
        $batchId = (string) Str::uuid();
        $fileName = Request::file('file')->getClientOriginalName();

        Excel::import(
            new UnitImport($batchId, $fileName, (string) $user->email),
            Request::file('file')
        );

        return Redirect::route('import-batches')
            ->with('success', 'Import queued.')
            ->with('batch_id', $batchId);
    }
}