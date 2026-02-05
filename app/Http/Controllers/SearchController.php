<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function projects(Request $request)
    {
        $user = Auth::user();
        $search = $request->get('search', '');

        $query = Project::orderBy('name');

        if (!$user->hasRole('super_admin')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.is_active', true);
            });
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%");
            });
        }

        $projects = $query->limit(20)->get();

        return response()->json(
            $projects->map(fn($p) => [
                'value' => $p->id,
                'label' => $p->name,
            ])
        );
    }

    public function properties(Request $request)
    {
        $search = $request->get('search', '');
        $projectId = $request->get('project_id');

        $query = Property::with('project')->orderBy('property_code');

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('property_code', 'like', "%{$search}%")
                  ->orWhere('property_no', 'like', "%{$search}%");
            });
        }

        $properties = $query->limit(20)->get();

        return response()->json(
            $properties->map(fn($p) => [
                'value' => $p->id,
                'label' => $p->property_code,
            ])
        );
    }

    public function units(Request $request)
    {
        $search = $request->get('search', '');
        $propertyId = $request->get('property_id');

        $query = Unit::with(['property', 'status'])
            ->where('status_id', 1)
            ->orderBy('unit_code');

        if ($propertyId) {
            $query->where('property_id', $propertyId);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('unit_code', 'like', "%{$search}%")
                  ->orWhere('unit_number', 'like', "%{$search}%");
            });
        }

        $units = $query->limit(20)->get();

        return response()->json(
            $units->map(fn($u) => [
                'value' => $u->id,
                'label' => $u->unit_code . ($u->unit_number ? " - {$u->unit_number}" : ''),
            ])
        );
    }
}
