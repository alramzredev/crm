<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Project;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $account = Account::create(['name' => 'Acme Corporation']);

        User::factory()->create([
            'account_id' => $account->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'johndoe@example.com',
            'owner' => true,
        ]);

        User::factory()->count(5)->create([
            'account_id' => $account->id
        ]);

        $projects = Project::factory()->count(100)->create([
            'account_id' => $account->id
        ]);

        Contact::factory()->count(100)->create([
            'account_id' => $account->id
        ])
            ->each(function (Contact  $contact) use ($projects) {
                $contact->update(['project_id' => $projects->random()->id]);
            });
    }
}
