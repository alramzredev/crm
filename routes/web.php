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
Route::middleware('auth')->group(function () {
    Route::get('users')->name('users')->uses('UsersController@index');
    Route::get('users/create')->name('users.create')->uses('UsersController@create');
    Route::post('users')->name('users.store')->uses('UsersController@store');
    Route::get('users/{user}/edit')->name('users.edit')->uses('UsersController@edit');
    Route::put('users/{user}')->name('users.update')->uses('UsersController@update');
    Route::delete('users/{user}')->name('users.destroy')->uses('UsersController@destroy');
    Route::put('users/{user}/restore')->name('users.restore')->uses('UsersController@restore');
});

// Images
Route::get('/img/{path}', 'ImagesController@show')->where('path', '.*');

// Projects
Route::middleware('auth')->group(function () {
    Route::get('projects')->name('projects')->uses('ProjectsController@index');
    Route::get('projects/create')->name('projects.create')->uses('ProjectsController@create');
    Route::post('projects')->name('projects.store')->uses('ProjectsController@store');
    Route::get('projects/{project}')->name('projects.show')->uses('ProjectsController@show');
    Route::get('projects/{project}/edit')->name('projects.edit')->uses('ProjectsController@edit');
    Route::put('projects/{project}')->name('projects.update')->uses('ProjectsController@update');
    Route::delete('projects/{project}')->name('projects.destroy')->uses('ProjectsController@destroy');
    Route::put('projects/{project}/restore')->name('projects.restore')->uses('ProjectsController@restore');
});

// Properties
Route::middleware('auth')->group(function () {
    Route::get('properties')->name('properties')->uses('PropertiesController@index');
    Route::get('properties/create')->name('properties.create')->uses('PropertiesController@create');
    Route::post('properties')->name('properties.store')->uses('PropertiesController@store');
    Route::get('properties/{property}')->name('properties.show')->uses('PropertiesController@show');
    Route::get('properties/{property}/edit')->name('properties.edit')->uses('PropertiesController@edit');
    Route::put('properties/{property}')->name('properties.update')->uses('PropertiesController@update');
    Route::delete('properties/{property}')->name('properties.destroy')->uses('PropertiesController@destroy');
    Route::put('properties/{property}/restore')->name('properties.restore')->uses('PropertiesController@restore');
});

// Units
Route::middleware('auth')->group(function () {
    Route::get('units')->name('units')->uses('UnitsController@index');
    Route::get('units/create')->name('units.create')->uses('UnitsController@create');
    Route::post('units')->name('units.store')->uses('UnitsController@store');
    Route::get('units/{unit}')->name('units.show')->uses('UnitsController@show');
    Route::get('units/{unit}/edit')->name('units.edit')->uses('UnitsController@edit');
    Route::put('units/{unit}')->name('units.update')->uses('UnitsController@update');
    Route::delete('units/{unit}')->name('units.destroy')->uses('UnitsController@destroy');
    Route::put('units/{unit}/restore')->name('units.restore')->uses('UnitsController@restore');
});

// Owners
Route::middleware('auth')->group(function () {
    Route::get('owners')->name('owners')->uses('OwnersController@index');
    Route::get('owners/create')->name('owners.create')->uses('OwnersController@create');
    Route::post('owners')->name('owners.store')->uses('OwnersController@store');
    Route::get('owners/{owner}/edit')->name('owners.edit')->uses('OwnersController@edit');
    Route::put('owners/{owner}')->name('owners.update')->uses('OwnersController@update');
    Route::delete('owners/{owner}')->name('owners.destroy')->uses('OwnersController@destroy');
    Route::put('owners/{owner}/restore')->name('owners.restore')->uses('OwnersController@restore');
});

// Leads
Route::middleware('auth')->group(function () {
    Route::get('leads')->name('leads')->uses('LeadsController@index');
    Route::get('leads/create')->name('leads.create')->uses('LeadsController@create');
    Route::post('leads')->name('leads.store')->uses('LeadsController@store');
    Route::get('leads/{lead}/edit')->name('leads.edit')->uses('LeadsController@edit');
    Route::put('leads/{lead}')->name('leads.update')->uses('LeadsController@update');
    Route::delete('leads/{lead}')->name('leads.destroy')->uses('LeadsController@destroy');
    Route::put('leads/{lead}/restore')->name('leads.restore')->uses('LeadsController@restore');
});

// Reservations
Route::middleware('auth')->group(function () {
    Route::get('reservations')->uses('ReservationController@index')->name('reservations');
    Route::get('reservations/create')->uses('ReservationController@create')->name('reservations.create');
    Route::post('reservations')->uses('ReservationController@store')->name('reservations.store');
    Route::get('reservations/{reservation}')->uses('ReservationController@show')->name('reservations.show');
    Route::get('reservations/{reservation}/edit')->uses('ReservationController@edit')->name('reservations.edit');
    Route::put('reservations/{reservation}')->uses('ReservationController@update')->name('reservations.update');
    
    // Payments
    Route::post('reservations/{reservation}/payments')->uses('PaymentController@store')->name('payments.store');
    Route::put('payments/{payment}')->uses('PaymentController@update')->name('payments.update');
    Route::delete('payments/{payment}')->uses('PaymentController@destroy')->name('payments.destroy');
});

// Reports
Route::get('reports')->name('reports')->uses('ReportsController')->middleware('auth');

// Search Routes
Route::middleware('auth')->group(function () {
    Route::get('search/projects')->uses('SearchController@projects')->name('search.projects');
    Route::get('search/properties')->uses('SearchController@properties')->name('search.properties');
    Route::get('search/units')->uses('SearchController@units')->name('search.units');
});

// 500 error
Route::get('500', function () {
    //
});
