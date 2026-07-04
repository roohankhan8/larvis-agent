<?php

namespace App\Models;

use Database\Factories\DeviceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $guest_uuid
 * @property string|null $session_id
 * @property string|null $name
 * @property string|null $email
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property array<string, mixed>|null $metadata
 * @property Carbon|null $last_seen_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Device extends Model
{
    /** @use HasFactory<DeviceFactory> */
    use HasFactory;

    public const COOKIE_NAME = 'guest_device';

    protected $fillable = [
        'user_id',
        'guest_uuid',
        'session_id',
        'name',
        'email',
        'ip_address',
        'user_agent',
        'metadata',
        'last_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'last_seen_at' => 'datetime',
        ];
    }

    public static function recordGuestVisit(Request $request): self
    {
        $device = static::query()->firstOrNew([
            'session_id' => $request->session()->getId(),
        ]);

        if (! $device->exists) {
            $device->guest_uuid = (string) Str::uuid();
        }

        $device->fill([
            'session_id' => $request->session()->getId(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata' => [
                'path' => $request->path(),
                'method' => $request->method(),
            ],
            'last_seen_at' => now(),
        ]);
        $device->save();

        return $device;
    }

    public static function attachToUser(User $user, Request $request, ?string $sessionId = null): ?self
    {
        $guestUuid = $request->cookie(self::COOKIE_NAME);
        $resolvedSessionId = $sessionId ?? $request->session()->getId();

        $device = static::query()
            ->where(function ($query) use ($guestUuid, $resolvedSessionId): void {
                if ($guestUuid !== null) {
                    $query->where('guest_uuid', $guestUuid);
                }

                $query->orWhere('session_id', $resolvedSessionId);
            })
            ->first();

        if ($device === null) {
            return null;
        }

        $device->fill([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'session_id' => $request->session()->getId(),
            'last_seen_at' => now(),
        ]);
        $device->save();

        return $device;
    }
}
