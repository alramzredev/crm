<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Repositories\SearchRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new SearchRepository();
    }

    public function projects(Request $request)
    {
        $search = $request->get('search', '');
        $projects = $this->repo->searchProjects(Auth::user(), $search);
        
        return response()->json($projects);
    }

    public function properties(Request $request)
    {
        $search = $request->get('search', '');
        $projectId = $request->get('project_id');
        $properties = $this->repo->searchProperties($search, $projectId);
        
        return response()->json($properties);
    }

    public function units(Request $request)
    {
        $search = $request->get('search', '');
        $propertyId = $request->get('property_id');
        $units = $this->repo->searchUnits($search, $propertyId);
        
        return response()->json($units);
    }

    public function showUnit(Unit $unit)
    {
        return $this->repo->getUnit($unit);
    }
}
