<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProjectImport;
use App\Models\Project;

class ProjectImportController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('import', Project::class);

        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
        ]);

        $user = $request->user();
        $batchId = (string) Str::uuid();
        $fileName = $request->file('file')->getClientOriginalName();

        Excel::import(
            new ProjectImport($batchId, $fileName, (string) $user->email),
            $request->file('file')
        );

        return back()
            ->with('success', 'Import queued.')
            ->with('batch_id', $batchId);
    }

    public function sample()
    {
        // Return sample Excel file
        return response()->download(storage_path('app/samples/projects_sample.xlsx'));
    }

    public function export()
    {
        // Export current projects
        return Excel::download(new \App\Exports\ProjectsExport, 'projects.xlsx');
    }
}
