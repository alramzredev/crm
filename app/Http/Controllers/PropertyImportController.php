<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PropertyImport;
use App\Models\Property;
use App\Exports\PropertiesExport;

class PropertyImportController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('import', Property::class);

        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
        ]);

        $user = $request->user();
        $batchId = (string) Str::uuid();
        $fileName = $request->file('file')->getClientOriginalName();

        Excel::import(
            new PropertyImport($batchId, $fileName, (string) $user->email),
            $request->file('file')
        );

        return back()
            ->with('success', 'Import queued.')
            ->with('batch_id', $batchId);
    }

    public function sample()
    {
        return response()->download(storage_path('app/samples/properties_sample.xlsx'));
    }

    public function export()
    {
        return Excel::download(new PropertiesExport, 'properties.xlsx');
    }
}
