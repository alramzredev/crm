<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use App\Http\Resources\UnitResource;
use Illuminate\Support\Facades\Request;

class SearchRepository
{
    public function searchProjects(User $user,  $search = null)
    {
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

        return $query->limit(20)->get()->map(fn($p) => [
            'value' => $p->id,
            'label' => $p->name,
        ]);
    }

    public function searchProperties( $search = null, ?int $projectId = null)
    {
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

        return $query->limit(20)->get()->map(fn($p) => [
            'value' => $p->id,
            'label' => $p->property_code,
        ]);
    }

    public function searchUnits($search = null, ?int $propertyId = null)
    {
        $query = Unit::with(['property', 'status'])
            ->available()
            ->orderBy('unit_code');

        if ($propertyId) {
            $query->where('property_id', $propertyId);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('unit_code', 'like', "%{$search}%");
            });
        }

        return $query->limit(20)->get()->map(fn($u) => [
            'value' => $u->id,
            'label' => $u->unit_code,
        ]);
    }

    public function getUnit(Unit $unit): UnitResource
    {
        $unit->load(['property.project', 'status']);
        return new UnitResource($unit);
    }
}
