<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Inertia\Testing\Assert;

class ProjectsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->make([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'johndoe@example.com',
            'owner' => true,
        ]);
    }

    public function test_can_view_projects()
    {
        Project::factory()->count(5)->create();

        $this->actingAs($this->user)
            ->get('/projects')
            ->assertStatus(200)
            ->assertInertia(function (Assert $page) {
                $page->component('Projects/Index');
                $page->has('projects.data', 5, function (Assert $page) {
                    $page->hasAll(['id', 'name', 'phone', 'city', 'deleted_at']);
                });
            });
    }

    public function test_can_search_for_projects()
    {
        Project::factory()->count(5)->create();
        Project::first()->update(['name' => 'Some Big Fancy Company Name']);

        $this->actingAs($this->user)
            ->get('/projects?search=Some Big Fancy Company Name')
            ->assertStatus(200)
            ->assertInertia(function (Assert $page) {
                $page->where('filters.search', 'Some Big Fancy Company Name');
                $page->has('projects.data', 1, function (Assert $page) {
                    $page->where('name', 'Some Big Fancy Company Name')->etc();
                });
            });
    }

    public function test_cannot_view_deleted_projects()
    {
        Project::factory()->count(5)->create();
        Project::first()->delete();

        $this->actingAs($this->user)
            ->get('/projects')
            ->assertStatus(200)
            ->assertInertia(function (Assert $page) {
                $page->has('projects.data', 4);
            });
    }

    public function test_can_filter_to_view_deleted_projects()
    {
        Project::factory()->count(5)->create();
        Project::first()->delete();

        $this->actingAs($this->user)
            ->get('/projects?trashed=with')
            ->assertStatus(200)
            ->assertInertia(function (Assert $page) {
                $page->where('filters.trashed', 'with');
                $page->has('projects.data', 5);
            });
    }

    public function test_can_delete_project()
    {
        $project = Project::factory()->create();

        $this->actingAs($this->user)
            ->delete("/projects/{$project->id}")
            ->assertStatus(302);

        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }
}
