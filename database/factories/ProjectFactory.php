<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'uuid' => (string) Str::uuid(),
            'project_code' => 'PRJ-' . strtoupper(Str::random(6)),
            'name' => $this->faker->company,
            'owner_id' => null, // set or override when seeding if owners exist
            'city_id' => null,
            'neighborhood' => $this->faker->streetName,
            'location' => $this->faker->address,
            'project_type_id' => null,
            'project_ownership_id' => null,
            'status_id' => null,
            'status_reason' => null,
            'land_area' => $this->faker->randomFloat(2, 50, 10000),
            'built_up_area' => $this->faker->randomFloat(2, 10, 8000),
            'selling_space' => $this->faker->randomFloat(2, 0, 8000),
            'sellable_area_factor' => $this->faker->randomFloat(2, 0.1, 1.0),
            'floor_area_ratio' => $this->faker->randomFloat(2, 0.1, 10.0),
            'no_of_floors' => $this->faker->numberBetween(1, 50),
            'number_of_units' => $this->faker->numberBetween(1, 1000),
            'budget' => $this->faker->randomFloat(2, 10000, 100000000),
            'warranty' => $this->faker->boolean(20),
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
