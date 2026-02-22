<?php

use Illuminate\Support\Facades\Route;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\PropertiesController;
use App\Http\Controllers\ReservationDiscountRequestController;

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
    Route::post('projects/import')->name('projects.import')->uses('ProjectImportController@store');
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
    Route::post('properties/import')->name('properties.import')->uses('PropertyImportController@store');
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
    Route::post('units/import')->name('units.import')->uses('UnitImportController@store');
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
    Route::post('reservations/{reservation}/approve')->uses('ReservationController@approveReservation')->name('reservations.approve');
    Route::post('reservations/{reservation}/reject')->uses('ReservationController@rejectReservation')->name('reservations.reject');
    
    // Payments
    Route::post('reservations/{reservation}/payments')->uses('PaymentController@store')->name('payments.store');
    Route::post('payments/{payment}')->uses('PaymentController@update')->name('payments.update');
    Route::delete('payments/{payment}')->uses('PaymentController@destroy')->name('payments.destroy');

    // Discount requests for specific reservations
    Route::post('reservations/{reservation}/discount-requests')->uses('ReservationDiscountRequestController@store')->name('reservations.discount-requests.store');

    // Customer Documents CRUD
    Route::post('customers/{customer}/documents/{document}/upload')
        ->uses('CustomerDocumentController@upload')
        ->name('customer-documents.upload');
    Route::delete('customers/{customer}/documents/{document}')
        ->uses('CustomerDocumentController@destroy')
        ->name('customer-documents.destroy');
    // Add approve document route
    Route::post('customers/{customer}/documents/{document}/approve')
        ->uses('CustomerDocumentController@approve')
        ->name('customer-documents.approve');
});

// Reports
Route::get('reports')->name('reports')->uses('ReportsController')->middleware('auth');

// Search Routes
Route::middleware('auth')->group(function () {
    Route::get('search/projects')->uses('SearchController@projects')->name('search.projects');
    Route::get('search/properties')->uses('SearchController@properties')->name('search.properties');
    Route::get('search/units')->uses('SearchController@units')->name('search.units');
    Route::get('search/units/{unit}')->uses('SearchController@showUnit')->name('search.unit.show');

});

// Employees (Sales Supervisor Management)
Route::middleware('auth')->group(function () {
    Route::get('employees')->name('employees')->uses('EmployeeController@index');
    Route::get('employees/{employee}')->name('employees.show')->uses('EmployeeController@show');
    Route::post('employees/{employee}/assign-project')->name('employees.assign-project')->uses('EmployeeController@assignProject');
    Route::delete('employees/{employee}/remove-project')->name('employees.remove-project')->uses('EmployeeController@removeProject');
});

// Staging Projects (rows)
Route::middleware('auth')->group(function () {
    Route::get('staging-projects')->name('staging-projects')->uses('StagingProjectController@index');
    Route::post('staging-projects')->name('projects.import')->uses('StagingProjectController@store');
    Route::post('staging-projects/{rowId}/revalidate')->name('staging-projects.revalidate')->uses('StagingProjectController@revalidate');
    Route::post('staging-projects/{rowId}/import')->name('staging-projects.import-row')->uses('StagingProjectController@importRow');
    Route::put('staging-projects/{rowId}')->name('staging-projects.update')->uses('StagingProjectController@update');
});

// Staging Properties (rows)
Route::middleware('auth')->group(function () {
    Route::get('staging-properties')->name('staging-properties')->uses('StagingPropertyController@index');
    Route::post('staging-properties')->name('properties.import')->uses('StagingPropertyController@store');
    Route::post('staging-properties/{rowId}/revalidate')->name('staging-properties.revalidate')->uses('StagingPropertyController@revalidate');
    Route::post('staging-properties/{rowId}/import')->name('staging-properties.import-row')->uses('StagingPropertyController@importRow');
    Route::put('staging-properties/{rowId}')->name('staging-properties.update')->uses('StagingPropertyController@update');
});

// Staging Units (rows)
Route::middleware('auth')->group(function () {
    Route::get('staging-units')->name('staging-units')->uses('StagingUnitController@index');
    Route::post('staging-units')->name('units.import')->uses('StagingUnitController@store');
    Route::post('staging-units/{rowId}/revalidate')->name('staging-units.revalidate')->uses('StagingUnitController@revalidate');
    Route::post('staging-units/{rowId}/import')->name('staging-units.import-row')->uses('StagingUnitController@importRow');
    Route::put('staging-units/{rowId}')->name('staging-units.update')->uses('StagingUnitController@update');
});

// Import Batches
Route::middleware('auth')->group(function () {
    Route::get('import-batches')->name('import-batches')->uses('ImportBatchController@index');
    Route::get('import-batches/{batchId}')->name('import-batches.show')->uses('ImportBatchController@show');
    Route::post('import-batches/{batchId}/retry')->name('import-batches.retry')->uses('ImportBatchController@retry');
    Route::post('import-batches/{batchId}/bulk-validate')->name('import-batches.bulk-validate')->uses('ImportBatchController@bulkValidate');
    Route::post('import-batches/{batchId}/bulk-import')->name('import-batches.bulk-import')->uses('ImportBatchController@bulkImport');
    Route::post('import-batches/{batchId}/bulk-validate-rows')->name('import-batches.bulk-validate-rows')->uses('ImportBatchController@bulkValidateRows');
    Route::post('import-batches/{batchId}/bulk-import-rows')->name('import-batches.bulk-import-rows')->uses('ImportBatchController@bulkImportRows');
    Route::post('import-batches/{batchId}/retry-failed')->name('import-batches.retry-failed')->uses('ImportBatchController@retryFailedImports');
    Route::post('import-batches/{batchId}/clear-errors')->name('import-batches.clear-errors')->uses('ImportBatchController@clearErrors');
    Route::delete('import-batches/{batchId}')->name('import-batches.destroy')->uses('ImportBatchController@destroy');
});

// Import Pages
Route::middleware('auth')->group(function () {
    Route::get('imports/projects')->name('imports.projects')->uses('ImportsController@projectsForm');
    Route::get('imports/properties')->name('imports.properties')->uses('ImportsController@propertiesForm');
    Route::get('imports/units')->name('imports.units')->uses('ImportsController@unitsForm');
    Route::get('imports/template')->name('imports.template')->uses('ImportsController@template');
});

// 500 error
Route::get('500', function () {
    //
});

// Reservation Discount Requests
Route::middleware('auth')->group(function () {
    Route::get('discount-requests')->name('discount-requests')->uses('ReservationDiscountRequestController@index');
    Route::get('discount-requests/create')->name('discount-requests.create')->uses('ReservationDiscountRequestController@create');
    Route::post('discount-requests')->name('discount-requests.store')->uses('ReservationDiscountRequestController@store');
    Route::get('discount-requests/{discountRequest}')->name('discount-requests.show')->uses('ReservationDiscountRequestController@show');
    Route::get('discount-requests/{discountRequest}/edit')->name('discount-requests.edit')->uses('ReservationDiscountRequestController@edit');
    Route::put('discount-requests/{discountRequest}')->name('discount-requests.update')->uses('ReservationDiscountRequestController@update');
    Route::delete('discount-requests/{discountRequest}')->name('discount-requests.destroy')->uses('ReservationDiscountRequestController@destroy');
    Route::put('discount-requests/{discountRequest}/restore')->name('discount-requests.restore')->uses('ReservationDiscountRequestController@restore');
    Route::post('discount-requests/{discountRequest}/approve')->name('discount-requests.approve')->uses('ReservationDiscountRequestController@approve');
    Route::post('discount-requests/{discountRequest}/reject')->name('discount-requests.reject')->uses('ReservationDiscountRequestController@reject');
});
