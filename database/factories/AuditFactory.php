<?php

namespace Database\Factories;

use App\Models\Audit;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuditFactory extends Factory
{
    protected $model = Audit::class;

    public function definition()
    {
        return [
            'auditable_id' => 1, // Set a valid project ID
            'auditable_type' => 'App\Models\Project',
            'row_checksum' => $this->faker->sha256,
            'source_modified_on' => $this->faker->dateTime,
        ];
    }
}
