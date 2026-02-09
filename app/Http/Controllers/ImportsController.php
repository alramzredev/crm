<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImportsController extends Controller
{
    public function projectsForm()
    {
        $this->authorize('viewAny', \App\Models\Project::class);
        
        return Inertia::render('Imports/ImportProjects');
    }

    public function propertiesForm()
    {
        $this->authorize('viewAny', \App\Models\Property::class);
        
        return Inertia::render('Imports/ImportProperties');
    }

    public function unitsForm()
    {
        $this->authorize('viewAny', \App\Models\Unit::class);
        
        return Inertia::render('Imports/ImportUnits');
    }

    public function sample(Request $request): BinaryFileResponse
    {
        $type = $request->get('type', 'projects');
        $fileName = "sample_{$type}.xlsx";
        $filePath = storage_path("samples/{$fileName}");

        if (!file_exists($filePath)) {
            abort(404, "Sample file not found for type: {$type}");
        }

        return response()->download($filePath, $fileName);
    }
}
