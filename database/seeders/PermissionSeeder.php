<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Define permissions grouped by module
        $permissionGroups = [
            'Dashboard' => [
                'dashboard.view',
            ],

            'User Management' => [
                'users.view',
                'users.create',
                'users.edit',
                'users.delete',
                'users.restore',
            ],

            'Project Management' => [
                'projects.view',
                'projects.create',
                'projects.edit',
                'projects.delete',
                'projects.restore',
            ],

            'Property Management' => [
                'properties.view',
                'properties.create',
                'properties.edit',
                'properties.delete',
                'properties.restore',
            ],

            'Unit Management' => [
                'units.view',
                'units.create',
                'units.edit',
                'units.delete',
                'units.restore',
            ],

            'Lead Management' => [
                'leads.view',
                'leads.create',
                'leads.edit',
                'leads.delete',
                'leads.restore',
            ],

            'Reservation Management' => [
                'reservations.view',
                'reservations.create',
                'reservations.edit',
                'reservations.delete',
                'reservations.restore',
            ],

            'Reports' => [
                'reports.view',
                'reports.export',
            ],

            'Owner Management' => [
                'owners.view',
                'owners.create',
                'owners.edit',
                'owners.delete',
                'owners.restore',
            ],
        ];

        // Flatten the permissions array and create them
        $allPermissions = [];
        foreach ($permissionGroups as $group => $permissions) {
            foreach ($permissions as $permission) {
                $allPermissions[] = $permission;
                Permission::firstOrCreate(
                    ['name' => $permission, 'guard_name' => 'web'],
                    ['group' => $group]
                );
            }
        }

        // Create roles
        $superAdmin = Role::firstOrCreate(
            ['name' => 'super_admin', 'guard_name' => 'web'],
            ['description' => 'Super Administrator - Full system access']
        );

        $projectManager = Role::firstOrCreate(
            ['name' => 'project_manager', 'guard_name' => 'web'],
            ['description' => 'Project Manager - Manages projects and properties']
        );

        $salesSupervisor = Role::firstOrCreate(
            ['name' => 'sales_supervisor', 'guard_name' => 'web'],
            ['description' => 'Sales Supervisor - Manages sales team and leads']
        );

        $salesEmployee = Role::firstOrCreate(
            ['name' => 'sales_employee', 'guard_name' => 'web'],
            ['description' => 'Sales Employee - Creates and manages leads and reservations']
        );

        // ============================================
        // SUPER ADMIN - Has all permissions
        // ============================================
        $superAdmin->syncPermissions($allPermissions);

        // ============================================
        // PROJECT MANAGER
        // ============================================
        $projectManager->syncPermissions([
            // Dashboard
            'dashboard.view',

            // Project Management - Full CRUD
            'projects.view',
            'projects.create',
            'projects.edit',
            'projects.delete',
            'projects.restore',

            // Property Management - Full CRUD
            'properties.view',
            'properties.create',
            'properties.edit',
            'properties.delete',
            'properties.restore',

            // Unit Management - Full CRUD
            'units.view',
            'units.create',
            'units.edit',
            'units.delete',
            'units.restore',

            // Lead Management - View only
            'leads.view',

            // Reservation Management - View only
            'reservations.view',

            // Owner Management - View only
            'owners.view',
        ]);

        // ============================================
        // SALES SUPERVISOR
        // ============================================
        $salesSupervisor->syncPermissions([
            // Dashboard
            'dashboard.view',

            // Lead Management - Full CRUD
            'leads.view',
            'leads.create',
            'leads.edit',
            'leads.delete',
            'leads.restore',

            // Reservation Management - Full CRUD
            'reservations.view',
            'reservations.create',
            'reservations.edit',
            'reservations.delete',
            'reservations.restore',

            // Reports - View and export
            'reports.view',
            'reports.export',

            // Projects - View only (to see project details)
            'projects.view',

            // Properties - View only (to see property details)
            'properties.view',

            // Units - View only (to see unit details)
            'units.view',
        ]);

        // ============================================
        // SALES EMPLOYEE
        // ============================================
        $salesEmployee->syncPermissions([
            // Dashboard
            'dashboard.view',

            // Lead Management - Create & View only
            'leads.view',
            'leads.create',
            'leads.edit', // Can edit their own leads

            // Reservation Management - Create & View only
            'reservations.view',
            'reservations.create',

            // Projects - View only
            'projects.view',

            // Properties - View only
            'properties.view',

            // Units - View only
            'units.view',
        ]);
    }
}