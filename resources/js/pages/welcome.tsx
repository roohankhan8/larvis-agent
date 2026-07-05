import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { store as storeProjectAction } from '@/actions/App/Http/Controllers/WriterWorkspaceController';
import ProjectContextPanel from '@/components/ProjectContextPanel';
import {
    analyzeContent,
    conversationLab,
    home,
    promptPlayground,
    streamingLab,
    toolLab,
} from '@/routes';
import AppLayout from '@/layouts/AppLayout';
import type { ContentProject } from '@/types/content-project';

type WelcomeProps = {
    project: ContentProject | null;
    projects: ContentProject[];
};

const workflowCards = [
    {
        title: 'Analyze source',
        description:
            'Extract a structured title, category, summary, and tags from the current brief or draft.',
        path: analyzeContent.url(),
        label: 'Run analysis',
    },
    {
        title: 'Generate draft',
        description:
            'Create a fresh version from the project brief using prompt controls and model settings.',
        path: promptPlayground.url(),
        label: 'Open draft lab',
    },
    {
        title: 'Tool polish',
        description:
            'Apply audience and CTA helpers to turn a rough version into conversion-oriented copy.',
        path: toolLab.url(),
        label: 'Polish current draft',
    },
    {
        title: 'Conversation revise',
        description:
            'Use the active draft as chat context and iterate on structure, tone, or messaging.',
        path: conversationLab.url(),
        label: 'Open revision chat',
    },
    {
        title: 'Streaming final pass',
        description:
            'Run a long final pass and save the streamed output back into the project history.',
        path: streamingLab.url(),
        label: 'Finalize output',
    },
];

function projectHref(path: string, project: ContentProject | null): string {
    if (!project) {
        return path;
    }

    return `${path}?project=${project.id}`;
}

export default function Welcome({ project, projects }: WelcomeProps) {
    const [title, setTitle] = useState('Q3 launch narrative');
    const [sourceContent, setSourceContent] = useState(
        'We need a connected writer workspace that helps a small content team move from scattered product notes to polished launch copy without losing context between analysis, drafting, chat revision, and finalization.',
    );
    const [contentType, setContentType] = useState('launch campaign');
    const [audience, setAudience] = useState('marketers');
    const [tone, setTone] = useState('persuasive');
    const [goal, setGoal] = useState('demo');

    function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const action = storeProjectAction();

        router.post(action.url, {
            title,
            source_content: sourceContent,
            content_type: contentType,
            audience,
            tone,
            goal,
        });
    }

    return (
        <>
            <Head title="Writer Workspace" />
            <AppLayout>
                <div className="editorial-grid min-h-[calc(100vh-5rem)] border-b border-[#d5dbd7] dark:border-[#222b27]">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                        <div className="border-b border-[#d5dbd7] pb-12 dark:border-[#222b27] lg:pb-16">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
                                <div className="max-w-4xl space-y-6">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                        Connected writer workflow
                                    </p>
                                    <h1 className="font-serif text-4xl font-light leading-[1.1] text-[#1a2620] dark:text-[#e5eae6] sm:text-5xl lg:text-6xl">
                                        Turn a brief into <span className="italic font-normal">a saved project</span>, then move through analysis, drafting, polish, revision, and final output.
                                    </h1>
                                    <p className="max-w-2xl font-sans text-base leading-relaxed text-[#607267] dark:text-[#7fa08d] sm:text-lg">
                                        This workspace connects the existing labs into one content-writing flow. Each step reads from the same project and writes its output back into shared state.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link
                                            href={projectHref(analyzeContent.url(), project)}
                                            prefetch
                                            className="btn-editorial-primary inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                        >
                                            {project ? 'Continue current project' : 'Open analyzer'}
                                        </Link>
                                        <Link
                                            href={projectHref(promptPlayground.url(), project)}
                                            prefetch
                                            className="btn-editorial-secondary inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                        >
                                            Prompt Playground
                                        </Link>
                                    </div>
                                </div>

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#1a2620] dark:text-[#e5eae6]">
                                        Create project
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Start with a working brief or source draft. The app will reuse this across every specialist page.
                                    </p>
                                    <form onSubmit={handleCreateProject} className="mt-5 space-y-4">
                                        <input
                                            value={title}
                                            onChange={(event) => setTitle(event.target.value)}
                                            placeholder="Project title"
                                            className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        />
                                        <textarea
                                            value={sourceContent}
                                            onChange={(event) => setSourceContent(event.target.value)}
                                            rows={7}
                                            placeholder="Paste the brief or source material"
                                            className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm leading-relaxed text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        />
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <input
                                                value={contentType}
                                                onChange={(event) => setContentType(event.target.value)}
                                                placeholder="Content type"
                                                className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                            />
                                            <input
                                                value={audience}
                                                onChange={(event) => setAudience(event.target.value)}
                                                placeholder="Audience"
                                                className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                            />
                                            <input
                                                value={tone}
                                                onChange={(event) => setTone(event.target.value)}
                                                placeholder="Tone"
                                                className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                            />
                                            <input
                                                value={goal}
                                                onChange={(event) => setGoal(event.target.value)}
                                                placeholder="Goal"
                                                className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn-editorial-primary w-full px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                        >
                                            Create writer project
                                        </button>
                                    </form>
                                </section>
                            </div>
                        </div>

                        <div className="pt-12 lg:pt-16">
                            <ProjectContextPanel project={project} currentPage="workspace" />
                        </div>

                        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-16 lg:pt-16">
                            <div className="space-y-8">
                                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                    Workflow stages
                                </p>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {workflowCards.map((item) => (
                                        <article
                                            key={item.title}
                                            className="paper-sheet flex flex-col justify-between p-6 dark:bg-[#141a17]"
                                        >
                                            <div>
                                                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a2620] dark:text-[#e5eae6]">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div className="mt-6 border-t border-[#d5dbd7] pt-4 dark:border-[#222b27]">
                                                <Link
                                                    href={projectHref(item.path, project)}
                                                    prefetch
                                                    className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6] hover:underline"
                                                >
                                                    {item.label} &rarr;
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            <aside className="border-t border-[#d5dbd7] pt-12 dark:border-[#222b27] lg:border-t-0 lg:border-l lg:border-[#d5dbd7] lg:pt-0 lg:pl-12 dark:lg:border-[#222b27]">
                                <div className="space-y-8">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#607267] dark:text-[#7fa08d]">
                                        Recent projects
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Return to a saved project and continue from the last completed stage instead of restarting a lab from scratch.
                                    </p>
                                    <div className="space-y-4">
                                        {projects.length > 0 ? (
                                            projects.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={`${home()}?project=${item.id}`}
                                                    className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]"
                                                >
                                                    <p className="font-serif text-xl text-[#1a2620] dark:text-[#e5eae6]">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-2 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                        {item.source_content?.slice(0, 140) ?? 'No source content'}...
                                                    </p>
                                                    <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                        {item.status} / {item.drafts.length} drafts
                                                    </p>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="border border-dashed border-[#d5dbd7] p-5 text-sm italic text-[#607267] dark:border-[#222b27] dark:text-[#7fa08d]">
                                                No saved projects yet. Create one from the brief form above.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                <footer className="bg-[#e2e7e1] py-8 text-xs text-[#607267] dark:bg-[#0a0d0b] dark:text-[#7fa08d]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-xl font-mono uppercase tracking-wider">
                                A connected workspace for analysis, drafting, revision, tool-guided polish, and final output storage.
                            </p>
                            <div className="flex items-center gap-4 font-mono">
                                <Link href={home()} className="hover:underline">Workspace</Link>
                                <span>/</span>
                                <Link href={promptPlayground.url()} className="hover:underline">Playground</Link>
                                <span>/</span>
                                <Link href={conversationLab.url()} className="hover:underline">Lab</Link>
                                <span>/</span>
                                <Link href={toolLab.url()} className="hover:underline">Tools</Link>
                                <span>/</span>
                                <Link href={streamingLab.url()} className="hover:underline">Stream</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </AppLayout>
        </>
    );
}
