<?php

use Illuminate\Support\Facades\Route;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\PropertyController;
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
    Route::get('users')->name('users')->uses('UserController@index');
    Route::get('users/create')->name('users.create')->uses('UserController@create');
    Route::post('users')->name('users.store')->uses('UserController@store');
    Route::get('users/{user}/edit')->name('users.edit')->uses('UserController@edit');
    Route::put('users/{user}')->name('users.update')->uses('UserController@update');
    Route::delete('users/{user}')->name('users.destroy')->uses('UserController@destroy');
    Route::put('users/{user}/restore')->name('users.restore')->uses('UserController@restore');
});

// Images
Route::get('/img/{path}', 'ImagesController@show')->where('path', '.*');

// Projects
Route::middleware('auth')->group(function () {
    Route::get('projects')->name('projects')->uses('ProjectController@index');
    Route::get('projects/create')->name('projects.create')->uses('ProjectController@create');
    Route::post('projects')->name('projects.store')->uses('ProjectController@store');
    Route::get('projects/{project}')->name('projects.show')->uses('ProjectController@show');
    Route::get('projects/{project}/edit')->name('projects.edit')->uses('ProjectController@edit');
    Route::put('projects/{project}')->name('projects.update')->uses('ProjectController@update');
    Route::delete('projects/{project}')->name('projects.destroy')->uses('ProjectController@destroy');
    Route::put('projects/{project}/restore')->name('projects.restore')->uses('ProjectController@restore');
    Route::post('projects/import')->name('projects.import')->uses('ProjectImportController@store');
});

// Properties
Route::middleware('auth')->group(function () {
    Route::get('properties')->name('properties')->uses('PropertyController@index');
    Route::get('properties/create')->name('properties.create')->uses('PropertyController@create');
    Route::post('properties')->name('properties.store')->uses('PropertyController@store');
    Route::get('properties/{property}')->name('properties.show')->uses('PropertyController@show');
    Route::get('properties/{property}/edit')->name('properties.edit')->uses('PropertyController@edit');
    Route::put('properties/{property}')->name('properties.update')->uses('PropertyController@update');
    Route::delete('properties/{property}')->name('properties.destroy')->uses('PropertyController@destroy');
    Route::put('properties/{property}/restore')->name('properties.restore')->uses('PropertyController@restore');
    Route::post('properties/import')->name('properties.import')->uses('PropertyImportController@store');
});

// Units
Route::middleware('auth')->group(function () {
    Route::get('units')->name('units')->uses('UnitController@index');
    Route::get('units/create')->name('units.create')->uses('UnitController@create');
    Route::post('units')->name('units.store')->uses('UnitController@store');
    Route::get('units/{unit}')->name('units.show')->uses('UnitController@show');
    Route::get('units/{unit}/edit')->name('units.edit')->uses('UnitController@edit');
    Route::put('units/{unit}')->name('units.update')->uses('UnitController@update');
    Route::delete('units/{unit}')->name('units.destroy')->uses('UnitController@destroy');
    Route::put('units/{unit}/restore')->name('units.restore')->uses('UnitController@restore');
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
    Route::get('leads')->name('leads')->uses('LeadController@index');
    Route::get('leads/create')->name('leads.create')->uses('LeadController@create');
    Route::post('leads')->name('leads.store')->uses('LeadController@store');
    Route::get('leads/{lead}/edit')->name('leads.edit')->uses('LeadController@edit');
    Route::put('leads/{lead}')->name('leads.update')->uses('LeadController@update');
    Route::delete('leads/{lead}')->name('leads.destroy')->uses('LeadController@destroy');
    Route::put('leads/{lead}/restore')->name('leads.restore')->uses('LeadController@restore');
    Route::get('leads/users-by-project', [\App\Http\Controllers\LeadController::class, 'usersByProject'])->name('leads.users-by-project');
    Route::get('leads/{lead}', [\App\Http\Controllers\LeadController::class, 'show'])->name('leads.show');
    Route::post('leads/{lead}/assign', [\App\Http\Controllers\LeadController::class, 'assignEmployee'])->name('leads.assign-employee');
    Route::post('leads/{lead}/unassign', [\App\Http\Controllers\LeadController::class, 'unassignEmployee'])->name('leads.unassign-employee');
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

    // Generate contract for reservation
    Route::post('reservations/{reservation}/generate-contract')->uses('ContractController@generate')->name('contracts.generate');

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
Route::get('reports')->name('reports')->uses('ReportController')->middleware('auth');

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

// Countries (Top Level)
Route::middleware('auth')->group(function () {
    Route::get('countries')->name('countries')->uses('CountryController@index');
    Route::get('countries/create')->name('countries.create')->uses('CountryController@create');
    Route::post('countries')->name('countries.store')->uses('CountryController@store');
    Route::get('countries/{country}')->name('countries.show')->uses('CountryController@show');
    Route::get('countries/{country}/edit')->name('countries.edit')->uses('CountryController@edit');
    Route::put('countries/{country}')->name('countries.update')->uses('CountryController@update');
    Route::delete('countries/{country}')->name('countries.destroy')->uses('CountryController@destroy');
});

// Cities (Scoped by Country)
Route::middleware('auth')->group(function () {
    Route::get('countries/{country}/cities')->name('countries.cities')->uses('CityController@index');
    Route::get('countries/{country}/cities/create')->name('countries.cities.create')->uses('CityController@create');
    Route::post('countries/{country}/cities')->name('countries.cities.store')->uses('CityController@store');
    Route::get('countries/{country}/cities/{city}')->name('countries.cities.show')->uses('CityController@show');
    Route::get('countries/{country}/cities/{city}/edit')->name('countries.cities.edit')->uses('CityController@edit');
    Route::put('countries/{country}/cities/{city}')->name('countries.cities.update')->uses('CityController@update');
    Route::delete('countries/{country}/cities/{city}')->name('countries.cities.destroy')->uses('CityController@destroy');
});

// Municipalities (Scoped by City)
Route::middleware('auth')->group(function () {
    Route::get('countries/{country}/cities/{city}/municipalities')->name('countries.cities.municipalities')->uses('MunicipalityController@index');
    Route::get('countries/{country}/cities/{city}/municipalities/create')->name('countries.cities.municipalities.create')->uses('MunicipalityController@create');
    Route::post('countries/{country}/cities/{city}/municipalities')->name('countries.cities.municipalities.store')->uses('MunicipalityController@store');
    Route::get('countries/{country}/cities/{city}/municipalities/{municipality}')->name('countries.cities.municipalities.show')->uses('MunicipalityController@show');
    Route::get('countries/{country}/cities/{city}/municipalities/{municipality}/edit')->name('countries.cities.municipalities.edit')->uses('MunicipalityController@edit');
    Route::put('countries/{country}/cities/{city}/municipalities/{municipality}')->name('countries.cities.municipalities.update')->uses('MunicipalityController@update');
    Route::delete('countries/{country}/cities/{city}/municipalities/{municipality}')->name('countries.cities.municipalities.destroy')->uses('MunicipalityController@destroy');
});

// Neighborhoods (Scoped by Municipality)
Route::middleware('auth')->group(function () {
    Route::get('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods')->name('countries.cities.municipalities.neighborhoods')->uses('NeighborhoodController@index');
    Route::get('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods/create')->name('countries.cities.municipalities.neighborhoods.create')->uses('MunicipalityController@createNeighborhood');
    Route::post('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods')->name('countries.cities.municipalities.neighborhoods.store')->uses('MunicipalityController@storeNeighborhood');
    Route::get('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods/{neighborhood}')->name('countries.cities.municipalities.neighborhoods.show')->uses('NeighborhoodController@show');
    Route::get('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods/{neighborhood}/edit')->name('countries.cities.municipalities.neighborhoods.edit')->uses('MunicipalityController@editNeighborhood');
    Route::put('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods/{neighborhood}')->name('countries.cities.municipalities.neighborhoods.update')->uses('MunicipalityController@updateNeighborhood');
    Route::delete('countries/{country}/cities/{city}/municipalities/{municipality}/neighborhoods/{neighborhood}')->name('countries.cities.municipalities.neighborhoods.destroy')->uses('MunicipalityController@destroyNeighborhood');
});
