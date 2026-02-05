<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;

class ProjectPropertyUnitSeeder extends Seeder
{
    public function run()
    {
        Model::unguarded(function () {
            for ($p = 1; $p <= 30; $p++) {
                $project = Project::create([
                    'name' => "Sample Project {$p}",
                    'owner_id' => 2,
                    'reservation_period_days' => 30,
                    'budget' => 1000000 * $p,
                ]);

                for ($r = 1; $r <= 60; $r++) {
                    $property = Property::create([
                        'project_id' => $project->id,
                        'owner_id' => 2,
                        'status_id' => 1,
                        'property_no' => $r,
                        'notes' => "Seeded property {$r} for project {$p}",
                    ]);

                    for ($u = 1; $u <= 120; $u++) {
                        Unit::create([
                            'project_id' => $project->id,
                            'property_id' => $property->id,
                            'owner_id' => 2,
                            'status_id' => 1,
                            'price' => 100000 + ($u * 5000),
                            'currency' => 'SAR',
                            'rooms' => 2 + $u,
                            'floor' => (string) $u,
                        ]);
                    }
                }
            }
        });
    }
}
