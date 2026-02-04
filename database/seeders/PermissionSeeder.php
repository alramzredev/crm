<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Hard reset permissions/roles + pivots
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('model_has_permissions')->truncate();
        DB::table('roles')->truncate();
        DB::table('permissions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

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
            'dashboard.view',
            'projects.view',
            'projects.create',
            'projects.edit',
            'projects.delete',
            'projects.restore',
            'properties.view',
            'properties.create',
            'properties.edit',
            'properties.delete',
            'properties.restore',
            'units.view',
            'units.create',
            'units.edit',
            'units.delete',
            'units.restore',
            'leads.view',
            'reservations.view',
            'owners.view',
        ]);

        // ============================================
        // SALES SUPERVISOR
        // ============================================
        $salesSupervisor->syncPermissions([
            'dashboard.view',
            'leads.view',
            'leads.create',
            'leads.edit',
            'leads.delete',
            'leads.restore',
            'reservations.view',
            'reservations.create',
            'reservations.edit',
            'reservations.delete',
            'reservations.restore',
            'reports.view',
            'reports.export',
            'projects.view',
            'properties.view',
            'units.view',
        ]);

        // ============================================
        // SALES EMPLOYEE
        // ============================================
        $salesEmployee->syncPermissions([
            'dashboard.view',
            'leads.view',
            'leads.create',
            'leads.edit',
            'reservations.view',
            'reservations.create',
            'projects.view',
            'properties.view',
            'units.view',
        ]);
    }
}