<?php

namespace App\Models;

use Database\Factories\ContentProjectFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int|null $device_id
 * @property string $title
 * @property string|null $source_content
 * @property string|null $content_type
 * @property string|null $audience
 * @property string|null $tone
 * @property string|null $goal
 * @property string $status
 * @property string|null $current_draft
 * @property array<string, mixed>|null $latest_analysis
 * @property array<string, mixed>|null $model_settings
 * @property array<int, array<string, mixed>> $drafts
 * @property string|null $conversation_id
 * @property string|null $final_output
 */
class ContentProject extends Model
{
    /** @use HasFactory<ContentProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_id',
        'title',
        'source_content',
        'content_type',
        'audience',
        'tone',
        'goal',
        'status',
        'current_draft',
        'latest_analysis',
        'model_settings',
        'drafts',
        'conversation_id',
        'final_output',
    ];

    protected function casts(): array
    {
        return [
            'latest_analysis' => 'array',
            'model_settings' => 'array',
            'drafts' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function scopeVisibleTo(Builder $query, Request $request): Builder
    {
        if ($request->user() instanceof User) {
            return $query->where('user_id', $request->user()->id);
        }

        $device = Device::query()
            ->where('session_id', $request->session()->getId())
            ->orWhere('guest_uuid', $request->cookie(Device::COOKIE_NAME))
            ->first();

        if ($device === null) {
            return $query->whereRaw('1 = 0');
        }

        return $query->where('device_id', $device->id);
    }

    /**
     * @param  array<string, mixed>  $metadata
     */
    public function pushDraft(string $label, string $content, string $source, array $metadata = []): void
    {
        $drafts = $this->drafts ?? [];

        $drafts[] = [
            'id' => (string) Str::uuid(),
            'label' => $label,
            'content' => $content,
            'source' => $source,
            'metadata' => $metadata,
            'created_at' => now()->toIso8601String(),
        ];

        $this->forceFill([
            'drafts' => $drafts,
            'current_draft' => $content,
            'status' => $source === 'streaming-final' ? 'finalized' : 'drafting',
        ])->save();
    }
}
