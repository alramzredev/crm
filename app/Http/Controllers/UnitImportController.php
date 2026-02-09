<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UnitImport;
use App\Models\Unit;

class UnitImportController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('import', Unit::class);

        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
        ]);

        $user = $request->user();
        $batchId = (string) Str::uuid();
        $fileName = $request->file('file')->getClientOriginalName();

        Excel::import(
            new UnitImport($batchId, $fileName, (string) $user->email),
            $request->file('file')
        );

        return back()
            ->with('success', 'Import queued.')
            ->with('batch_id', $batchId);
    }

    public function sample()
    {
        return response()->download(storage_path('app/samples/units_sample.xlsx'));
    }

    public function export()
    {
        return Excel::download(new \App\Exports\UnitsExport, 'units.xlsx');
    }
}
