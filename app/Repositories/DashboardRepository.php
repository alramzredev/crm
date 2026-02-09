<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use App\Models\Lead;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    public function getAdminKPIs()
    {
        return [
            'total_projects' => Project::count(),
            'total_properties' => Property::count(),
            'total_units' => Unit::count(),
            'available_units' => Unit::where('status_id', 1)->count(),
            'sold_units' => Unit::where('status_id', 3)->count(),
            'active_reservations' => Reservation::where('status', 'active')->count(),
            'total_leads' => Lead::count(),
        ];
    }

    public function getAdminCharts()
    {
        return [
            'reservations_over_time' => $this->getReservationsOverTime(),
            'units_sold_per_project' => $this->getUnitsSoldPerProject(),
        ];
    }

    public function getUserStats()
    {
        return [
            'super_admins' => User::role('super_admin')->whereNull('deleted_at')->count(),
            'project_admins' => User::role('project_admin')->whereNull('deleted_at')->count(),
            'sales_supervisors' => User::role('sales_supervisor')->whereNull('deleted_at')->count(),
            'sales_employees' => User::role('sales_employee')->whereNull('deleted_at')->count(),
            'active_users' => User::whereNull('deleted_at')->count(),
            'inactive_users' => User::whereNotNull('deleted_at')->count(),
        ];
    }

    public function getAdminAlerts()
    {
        return [
            'expired_reservations' => Reservation::where('status', 'active')
                ->where('expires_at', '<', now())
                ->count(),
            'low_availability_projects' => Project::whereHas('units', function($q) {
                $q->where('status_id', 1);
            }, '<', 5)->count(),
        ];
    }

    // ==========================================
    // PROJECT ADMIN DASHBOARD
    // ==========================================

    public function getProjectAdminInventory(User $user)
    {
        $projects = Project::whereHas('users', function($q) use ($user) {
            $q->where('project_user.user_id', $user->id)
              ->where('project_user.role_in_project', 'project_admin')
              ->where('project_user.is_active', true);
        })->withCount([
            'properties',
            'units',
            'units as available_units' => function($q) { $q->where('status_id', 1); },
            'units as reserved_units' => function($q) { $q->where('status_id', 2); },
            'units as sold_units' => function($q) { $q->where('status_id', 3); },
        ])->get();

        return $projects;
    }

    public function getProjectManagerAlerts(User $user)
    {
        $projectIds = Project::whereHas('users', function($q) use ($user) {
            $q->where('project_user.user_id', $user->id)
              ->where('project_user.role_in_project', 'project_admin')
              ->where('project_user.is_active', true);
        })->pluck('id');

        return [
            'units_without_price' => Unit::whereIn('project_id', $projectIds)
                ->whereNull('price')
                ->count(),
            'properties_under_maintenance' => Property::whereIn('project_id', $projectIds)
                ->where('status_id', 4)
                ->count(),
        ];
    }

    // ==========================================
    // SALES SUPERVISOR DASHBOARD
    // ==========================================

    public function getSalesSupervisorKPIs(User $user)
    {
        $projectIds = $this->getSupervisorProjectIds($user);

        return [
            'total_leads' => Lead::whereIn('project_id', $projectIds)->count(),
            'new_leads_today' => Lead::whereIn('project_id', $projectIds)
                ->whereDate('created_at', today())
                ->count(),
            'active_reservations' => Reservation::whereHas('unit', function($q) use ($projectIds) {
                $q->whereIn('project_id', $projectIds);
            })->where('status', 'active')->count(),
        ];
    }

    public function getTeamPerformance(User $user)
    {
        // Get team members supervised by this user
        $teamMembers = User::role('sales_employee')
            ->whereHas('supervisor', function($q) use ($user) {
                $q->where('supervisor_id', $user->id);
            })->get();

        // Manually count leads for each team member
        $teamMembers = $teamMembers->map(function($member) {
            $leadsCount = Lead::whereHas('activeAssignment', function($q) use ($member) {
                $q->where('employee_id', $member->id);
            })->count();

            $leadsThisMonthCount = Lead::whereHas('activeAssignment', function($q) use ($member) {
                $q->where('employee_id', $member->id);
            })->whereMonth('leads.created_at', now()->month)->count();

            $member->leads_count = $leadsCount;
            $member->leads_this_month_count = $leadsThisMonthCount;

            return $member;
        });

        return $teamMembers;
    }

    public function getSalesInventory(User $user)
    {
        $projectIds = $this->getSupervisorProjectIds($user);

        return [
            'available_units' => Unit::whereIn('project_id', $projectIds)
                ->where('status_id', 1)
                ->count(),
            'reserved_today' => Unit::whereIn('project_id', $projectIds)
                ->where('status_id', 2)
                ->whereHas('reservations', function($q) {
                    $q->whereDate('created_at', today());
                })->count(),
        ];
    }

    public function getSalesAlerts(User $user)
    {
        $projectIds = $this->getSupervisorProjectIds($user);

        return [
            'expiring_reservations' => Reservation::whereHas('unit', function($q) use ($projectIds) {
                $q->whereIn('project_id', $projectIds);
            })->where('status', 'active')
              ->whereBetween('expires_at', [now(), now()->addDays(3)])
              ->count(),
            'unassigned_leads' => Lead::whereIn('project_id', $projectIds)
                ->whereDoesntHave('activeAssignment')
                ->count(),
        ];
    }

    // ==========================================
    // SALES EMPLOYEE DASHBOARD
    // ==========================================

    public function getEmployeeWork(User $user)
    {
        $assignedLeads = Lead::whereHas('activeAssignment', function($q) use ($user) {
            $q->where('employee_id', $user->id);
        })->with(['project', 'activeAssignment'])->get();

        $activeReservations = Reservation::where('status', 'active')
            ->whereHas('lead.activeAssignment', function($q) use ($user) {
                $q->where('employee_id', $user->id);
            })->with(['lead', 'unit'])->get();

        return [
            'assigned_leads' => $assignedLeads,
            'active_reservations' => $activeReservations,
        ];
    }

    public function getEmployeeReminders(User $user)
    {
        // This would integrate with a follow-up system
        return [
            'today_followups' => [],
            'missed_followups' => [],
        ];
    }

    public function getEmployeePerformance(User $user)
    {
        $reservationsThisMonth = Reservation::whereHas('lead.activeAssignment', function($q) use ($user) {
            $q->where('employee_id', $user->id);
        })->whereMonth('reservations.created_at', now()->month)->count();

        $totalLeads = Lead::whereHas('activeAssignment', function($q) use ($user) {
            $q->where('employee_id', $user->id);
        })->count();

        $convertedLeads = Reservation::whereHas('lead.activeAssignment', function($q) use ($user) {
            $q->where('employee_id', $user->id);
        })->count();

        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 2) : 0;

        return [
            'reservations_this_month' => $reservationsThisMonth,
            'conversion_rate' => $conversionRate,
            'total_leads' => $totalLeads,
            'converted_leads' => $convertedLeads,
        ];
    }

    public function getEmployeeInventory(User $user)
    {
        $projectIds = $this->getEmployeeProjectIds($user);

        return Unit::whereIn('project_id', $projectIds)
            ->where('status_id', 1)
            ->with(['property', 'project'])
            ->limit(10)
            ->get();
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    protected function getSupervisorProjectIds(User $user)
    {
        return Project::whereHas('users', function($q) use ($user) {
            $q->where('project_user.user_id', $user->id)
              ->where('project_user.role_in_project', 'sales_supervisor')
              ->where('project_user.is_active', true);
        })->pluck('id');
    }

    protected function getEmployeeProjectIds(User $user)
    {
        return Project::whereHas('users', function($q) use ($user) {
            $q->where('project_user.user_id', $user->id)
              ->where('project_user.role_in_project', 'sales_employee')
              ->where('project_user.is_active', true);
        })->pluck('id');
    }

    protected function getReservationsOverTime()
    {
        return Reservation::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    protected function getUnitsSoldPerProject()
    {
        return Project::withCount(['units as sold_units' => function($q) {
            $q->where('status_id', 3);
        }])->having('sold_units', '>', 0)->get();
    }
}
