<?php

use App\Models\Device;
use App\Models\User;

test('the login and register pages load for guests', function () {
    $this->get(route('login'))->assertSuccessful();
    $this->get(route('register'))->assertSuccessful();
});

test('guest device data is created and linked when a visitor signs up', function () {
    $this->get(route('login'))->assertSuccessful();

    expect(Device::query()->count())->toBeGreaterThan(0);

    $this->post(route('register'), [
        'name' => 'Guest Tester',
        'email' => 'guest.tester@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('home'));

    $user = User::query()
        ->where('email', 'guest.tester@example.com')
        ->firstOrFail();

    $linkedDevice = Device::query()
        ->where('user_id', $user->id)
        ->firstOrFail();

    expect($linkedDevice->email)->toBe('guest.tester@example.com');
    expect($linkedDevice->name)->toBe('Guest Tester');
});

test('an existing user can sign in from the login page', function () {
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $this->get(route('login'))->assertSuccessful();

    expect(Device::query()->count())->toBeGreaterThan(0);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ])->assertRedirect(route('home'));

    $this->assertAuthenticatedAs($user);

    $linkedDevice = Device::query()
        ->where('user_id', $user->id)
        ->firstOrFail();

    expect($linkedDevice->user_id)->toBe($user->id);
});
