<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create roles
        $roleAdmin = Role::create(['name' => 'admin']);
        $roleUser = Role::create(['name' => 'user']);

        // Assign roles to existing users
        $adminUser = User::where('email', 'admin@gmail.com')->first();
        if ($adminUser) {
            $adminUser->assignRole($roleAdmin);
        }

        $user1 = User::where('email', 'user1@gmail.com')->first();
        if ($user1) {
            $user1->assignRole($roleUser);
        }

        $user2 = User::where('email', 'user2@gmail.com')->first();
        if ($user2) {
            $user2->assignRole($roleUser);
        }
    }
}
