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
        $roleEditor = Role::create(['name' => 'editor']);
        $roleUser = Role::create(['name' => 'user']);

        // Assign roles to existing users
        $admin = User::where('email', 'admin@gmail.com')->first();
        if ($admin) {
            $admin->assignRole($roleAdmin);
        }

        $editor1 = User::where('email', 'editor1@gmail.com')->first();
        if ($editor1) {
            $editor1->assignRole($roleEditor);
        }

        $editor2 = User::where('email', 'editor2@gmail.com')->first();
        if ($editor2) {
            $editor2->assignRole($roleEditor);
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
