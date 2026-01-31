<?php

use Illuminate\Support\Facades\Route;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\PropertiesController;

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
Route::get('projects/{project}')
    ->name('projects.show')
    ->uses('ProjectsController@show')
    ->middleware('auth');
    
Route::get('projects/{project}/edit')->name('projects.edit')->uses('ProjectsController@edit')->middleware('auth');
Route::put('projects/{project}')->name('projects.update')->uses('ProjectsController@update')->middleware('auth');
Route::delete('projects/{project}')->name('projects.destroy')->uses('ProjectsController@destroy')->middleware('auth');
Route::put('projects/{project}/restore')->name('projects.restore')->uses('ProjectsController@restore')->middleware('auth');

// Owners (basic CRUD routes so Ziggy has 'owners' route names)
Route::get('owners')->name('owners')->uses('OwnersController@index')->middleware('remember', 'auth');
Route::get('owners/create')->name('owners.create')->uses('OwnersController@create')->middleware('auth');
Route::post('owners')->name('owners.store')->uses('OwnersController@store')->middleware('auth');
Route::get('owners/{owner}/edit')->name('owners.edit')->uses('OwnersController@edit')->middleware('auth');
Route::put('owners/{owner}')->name('owners.update')->uses('OwnersController@update')->middleware('auth');
Route::delete('owners/{owner}')->name('owners.destroy')->uses('OwnersController@destroy')->middleware('auth');
Route::put('owners/{owner}/restore')->name('owners.restore')->uses('OwnersController@restore')->middleware('auth');

// Leads (renamed from Contacts)
Route::get('leads')->name('leads')->uses('LeadsController@index')->middleware('remember', 'auth');
Route::get('leads/create')->name('leads.create')->uses('LeadsController@create')->middleware('auth');
Route::post('leads')->name('leads.store')->uses('LeadsController@store')->middleware('auth');
Route::get('leads/{lead}/edit')->name('leads.edit')->uses('LeadsController@edit')->middleware('auth');
Route::put('leads/{lead}')->name('leads.update')->uses('LeadsController@update')->middleware('auth');
Route::delete('leads/{lead}')->name('leads.destroy')->uses('LeadsController@destroy')->middleware('auth');
Route::put('leads/{lead}/restore')->name('leads.restore')->uses('LeadsController@restore')->middleware('auth');

// Reports
Route::get('reports')->name('reports')->uses('ReportsController')->middleware('auth');

// Properties
Route::get('properties')->name('properties')->uses('PropertiesController@index')->middleware('remember', 'auth');
Route::get('properties/create')->name('properties.create')->uses('PropertiesController@create')->middleware('auth');
Route::post('properties')->name('properties.store')->uses('PropertiesController@store')->middleware('auth');
Route::get('properties/{property}')->name('properties.show')->uses('PropertiesController@show')->middleware('auth');
Route::get('properties/{property}/edit')->name('properties.edit')->uses('PropertiesController@edit')->middleware('auth');
Route::put('properties/{property}')->name('properties.update')->uses('PropertiesController@update')->middleware('auth');
Route::delete('properties/{property}')->name('properties.destroy')->uses('PropertiesController@destroy')->middleware('auth');
Route::put('properties/{property}/restore')->name('properties.restore')->uses('PropertiesController@restore')->middleware('auth');

// 500 error
Route::get('500', function () {
    //echo $fail;
});
