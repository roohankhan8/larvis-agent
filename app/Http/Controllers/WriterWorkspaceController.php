<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithContentProjects;
use App\Models\ContentProject;
use App\Models\Device;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WriterWorkspaceController extends Controller
{
    use InteractsWithContentProjects;

    public function index(Request $request): Response
    {
        $project = $this->resolveProject($request);

        return Inertia::render('welcome', [
            'project' => $this->projectPayload($project),
            'projects' => $this->recentProjects($request),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'source_content' => ['required', 'string', 'min:20'],
            'content_type' => ['nullable', 'string', 'max:120'],
            'audience' => ['nullable', 'string', 'max:120'],
            'tone' => ['nullable', 'string', 'max:120'],
            'goal' => ['nullable', 'string', 'max:120'],
        ]);

        $device = Device::query()
            ->where('session_id', $request->session()->getId())
            ->orWhere('guest_uuid', $request->cookie(Device::COOKIE_NAME))
            ->first();

        $project = ContentProject::query()->create([
            ...$validated,
            'user_id' => $request->user()?->id,
            'device_id' => $device?->id,
            'status' => 'brief',
            'drafts' => [],
        ]);

        return redirect()->route('home', ['project' => $project->id]);
    }
}
