<?php

use Illuminate\Support\Facades\Route;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth
Route::get('login')->name('login')->uses('Auth\LoginController@showLoginForm')->middleware('guest');
Route::post('login')->name('login.attempt')->uses('Auth\LoginController@login')->middleware('guest');
Route::post('logout')->name('logout')->uses('Auth\LoginController@logout');

// Dashboard
Route::get('/')->name('dashboard')->uses('DashboardController')->middleware('auth');

// Users
Route::get('users')->name('users')->uses('UsersController@index')->middleware('remember', 'auth');
Route::get('users/create')->name('users.create')->uses('UsersController@create')->middleware('auth');
Route::post('users')->name('users.store')->uses('UsersController@store')->middleware('auth');
Route::get('users/{user}/edit')->name('users.edit')->uses('UsersController@edit')->middleware('auth');
Route::put('users/{user}')->name('users.update')->uses('UsersController@update')->middleware('auth');
Route::delete('users/{user}')->name('users.destroy')->uses('UsersController@destroy')->middleware('auth');
Route::put('users/{user}/restore')->name('users.restore')->uses('UsersController@restore')->middleware('auth');

// Images
Route::get('/img/{path}', 'ImagesController@show')->where('path', '.*');

// Projects
Route::get('projects')->name('projects')->uses('ProjectsController@index')->middleware('remember', 'auth');
Route::get('projects/create')->name('projects.create')->uses('ProjectsController@create')->middleware('auth');
Route::post('projects')->name('projects.store')->uses('ProjectsController@store')->middleware('auth');
Route::get('projects/{project}', function (Project $project) {
    abort_unless($project->account_id === Auth::user()->account_id, 403);

    $project->load('contacts');

    return Inertia::render('Projects/Show', [
        'project' => $project,
    ]);
})->name('projects.show')->middleware('auth');
Route::get('projects/{project}/edit')->name('projects.edit')->uses('ProjectsController@edit')->middleware('auth');
Route::put('projects/{project}')->name('projects.update')->uses('ProjectsController@update')->middleware('auth');
Route::delete('projects/{project}')->name('projects.destroy')->uses('ProjectsController@destroy')->middleware('auth');
Route::put('projects/{project}/restore')->name('projects.restore')->uses('ProjectsController@restore')->middleware('auth');

// Contacts
Route::get('contacts')->name('contacts')->uses('ContactsController@index')->middleware('remember', 'auth');
Route::get('contacts/create')->name('contacts.create')->uses('ContactsController@create')->middleware('auth');
Route::post('contacts')->name('contacts.store')->uses('ContactsController@store')->middleware('auth');
Route::get('contacts/{contact}/edit')->name('contacts.edit')->uses('ContactsController@edit')->middleware('auth');
Route::put('contacts/{contact}')->name('contacts.update')->uses('ContactsController@update')->middleware('auth');
Route::delete('contacts/{contact}')->name('contacts.destroy')->uses('ContactsController@destroy')->middleware('auth');
Route::put('contacts/{contact}/restore')->name('contacts.restore')->uses('ContactsController@restore')->middleware('auth');

// Reports
Route::get('reports')->name('reports')->uses('ReportsController')->middleware('auth');

// 500 error
Route::get('500', function () {
    //echo $fail;
});
