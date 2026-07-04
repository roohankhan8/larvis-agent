<?php

namespace Database\Factories;

use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Device>
 */
class DeviceFactory extends Factory
{
    protected $model = Device::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'guest_uuid' => (string) Str::uuid(),
            'session_id' => $this->faker->uuid(),
            'name' => $this->faker->optional()->name(),
            'email' => $this->faker->optional()->safeEmail(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'metadata' => [
                'path' => '/',
                'method' => 'GET',
            ],
            'last_seen_at' => now(),
        ];
    }
}
