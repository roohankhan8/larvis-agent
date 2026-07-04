<?php

namespace App\Http\Middleware;

use App\Models\Device;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackGuestDevice
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() !== null) {
            return $next($request);
        }

        $device = Device::recordGuestVisit($request);

        $response = $next($request);

        if ($request->cookie(Device::COOKIE_NAME) === null) {
            $response->headers->setCookie(cookie(
                Device::COOKIE_NAME,
                $device->guest_uuid,
                60 * 24 * 365,
            ));
        }

        return $response;
    }
}
