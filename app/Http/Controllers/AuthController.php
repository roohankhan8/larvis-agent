<?php

namespace App\Http\Controllers;

use App\Models\ContentProject;
use App\Models\Device;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function createLogin(Request $request): Response
    {
        Device::recordGuestVisit($request);

        return Inertia::render('Login');
    }

    public function storeLogin(Request $request): RedirectResponse
    {
        $guestSessionId = $request->session()->getId();
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        if (! Auth::attempt(
            [
                'email' => $credentials['email'],
                'password' => $credentials['password'],
            ],
            $request->boolean('remember'),
        )) {
            return back()
                ->withErrors([
                    'email' => __('auth.failed'),
                ])
                ->onlyInput('email');
        }

        $user = Auth::user();

        if ($user instanceof User) {
            $device = Device::attachToUser($user, $request, $guestSessionId);

            if ($device !== null) {
                ContentProject::query()
                    ->where('device_id', $device->id)
                    ->update(['user_id' => $user->id]);
            }
        }

        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    public function createRegister(Request $request): Response
    {
        Device::recordGuestVisit($request);

        return Inertia::render('Register');
    }

    public function storeRegister(Request $request): RedirectResponse
    {
        $guestSessionId = $request->session()->getId();
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        Auth::login($user);
        $device = Device::attachToUser($user, $request, $guestSessionId);

        if ($device !== null) {
            ContentProject::query()
                ->where('device_id', $device->id)
                ->update(['user_id' => $user->id]);
        }
        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
