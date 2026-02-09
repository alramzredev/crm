<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Repositories\DashboardRepository;

class DashboardController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new DashboardRepository();
    }

    public function __invoke()
    {
        $user = Auth::user();

        // Route to appropriate dashboard based on role
        if ($user->hasRole('super_admin')) {
            return $this->adminDashboard($user);
        } elseif ($user->hasRole('project_admin')) {
            return $this->projectAdminDashboard($user);
        } elseif ($user->hasRole('sales_supervisor')) {
            return $this->salesSupervisorDashboard($user);
        } elseif ($user->hasRole('sales_employee')) {
            return $this->salesEmployeeDashboard($user);
        }

        // Default fallback
        return Inertia::render('Dashboard/Index');
    }

    protected function adminDashboard($user)
    {
        return Inertia::render('Dashboard/AdminDashboard', [
            'kpis' => $this->repo->getAdminKPIs(),
            'charts' => $this->repo->getAdminCharts(),
            'userStats' => $this->repo->getUserStats(),
            'alerts' => $this->repo->getAdminAlerts(),
        ]);
    }

    protected function projectAdminDashboard($user)
    {
        return Inertia::render('Dashboard/ProjectManagerDashboard', [
            'inventory' => $this->repo->getProjectAdminInventory($user),
            'alerts' => $this->repo->getProjectManagerAlerts($user),
        ]);
    }

    protected function salesSupervisorDashboard($user)
    {
        return Inertia::render('Dashboard/SalesSupervisorDashboard', [
            'kpis' => $this->repo->getSalesSupervisorKPIs($user),
            'teamPerformance' => $this->repo->getTeamPerformance($user),
            'inventory' => $this->repo->getSalesInventory($user),
            'alerts' => $this->repo->getSalesAlerts($user),
        ]);
    }

    protected function salesEmployeeDashboard($user)
    {
        return Inertia::render('Dashboard/SalesEmployeeDashboard', [
            'myWork' => $this->repo->getEmployeeWork($user),
            'reminders' => $this->repo->getEmployeeReminders($user),
            'performance' => $this->repo->getEmployeePerformance($user),
            'inventory' => $this->repo->getEmployeeInventory($user),
        ]);
    }
}
