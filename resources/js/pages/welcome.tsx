import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { destroy as destroyProjectAction, drafts as projectDraftsAction, store as storeProjectAction } from '@/actions/App/Http/Controllers/WriterWorkspaceController';
import ProjectContextPanel from '@/components/ProjectContextPanel';
import AppLayout from '@/layouts/AppLayout';
import {
    analyzeContent,
    conversationLab,
    home,
    promptPlayground,
    streamingLab,
    toolLab,
} from '@/routes';
import type { ContentProject } from '@/types/content-project';

type WelcomeProps = {
    project: ContentProject | null;
    projects: ContentProject[];
};

const workflowCards = [
    {
        title: 'Analyze source',
        description:
            'Turn your brief or draft into a clear title, summary, category, and set of tags.',
        path: analyzeContent.url(),
        label: 'Analyze content',
    },
    {
        title: 'Generate draft',
        description:
            'Generate a new version from your brief and adjust the writing style to match your needs.',
        path: promptPlayground.url(),
        label: 'Write a draft',
    },
    {
        title: 'Tool polish',
        description:
            'Use built-in helpers to sharpen messaging for a specific audience and goal.',
        path: toolLab.url(),
        label: 'Polish this draft',
    },
    {
        title: 'Conversation revise',
        description:
            'Work with the AI in chat to improve structure, clarity, tone, or positioning.',
        path: conversationLab.url(),
        label: 'Open revision chat',
    },
    {
        title: 'Streaming final pass',
        description:
            'Generate a full final version in real time and save it back to the project.',
        path: streamingLab.url(),
        label: 'Create final version',
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
    const [projectToDelete, setProjectToDelete] = useState<ContentProject | null>(null);

    useEffect(() => {
        if (!projectToDelete) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setProjectToDelete(null);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [projectToDelete]);

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
                                        AI writing workspace
                                    </p>
                                    <h1 className="font-serif text-4xl font-light leading-[1.1] text-[#1a2620] dark:text-[#e5eae6] sm:text-5xl lg:text-6xl">
                                        Turn a brief into <span className="italic font-normal">a saved project</span>, then move smoothly from first idea to final copy.
                                    </h1>
                                    <p className="max-w-2xl font-sans text-base leading-relaxed text-[#607267] dark:text-[#7fa08d] sm:text-lg">
                                        This workspace keeps your writing process in one place. Each step uses the same project, so your brief, drafts, and revisions stay connected.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link
                                            href={projectHref(analyzeContent.url(), project)}
                                            prefetch
                                            className="btn-editorial-primary inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                        >
                                            {project ? 'Continue current project' : 'Start with analysis'}
                                        </Link>
                                        <Link
                                            href={projectHref(promptPlayground.url(), project)}
                                            prefetch
                                            className="btn-editorial-secondary inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                        >
                                            Write a draft
                                        </Link>
                                    </div>
                                </div>
                                {!project && (
                                    <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#1a2620] dark:text-[#e5eae6]">
                                            Start a project
                                        </h2>
                                        <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                            Start with a brief, rough draft, or notes. The app will reuse this information across every writing step.
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
                                                Create project
                                            </button>
                                        </form>
                                    </section>
                                )}
                                {project && (
                                    <div className="pt-12 lg:pt-16">
                                        <ProjectContextPanel project={project} currentPage="workspace" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-16 lg:pt-16">
                            <div className="space-y-8">
                                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                    Writing steps
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
                                        Reopen a saved project and continue where you left off instead of starting over.
                                    </p>
                                    <div className="space-y-4">
                                        {projects.length > 0 ? (
                                            projects.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <Link
                                                            href={home.url({ query: { project: item.id } })}
                                                            className="min-w-0 flex-1"
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

                                                        <button
                                                            type="button"
                                                            aria-label={`Delete ${item.title}`}
                                                            onClick={() => setProjectToDelete(item)}
                                                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#d5dbd7] text-[#a8552a] transition hover:border-[#a8552a] hover:bg-[#fff1ea] dark:border-[#222b27] dark:text-[#f08a57] dark:hover:bg-[#2b1912]"
                                                        >
                                                            <span className="sr-only">Delete project</span>
                                                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                                                                <path d="M7 4h6m-8 2h10m-8 0 .6 8.2A1 1 0 0 0 8.6 15h2.8a1 1 0 0 0 1-.8L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M9 8v4m2-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M6 6l.4 8.7A1.5 1.5 0 0 0 7.9 16h4.2a1.5 1.5 0 0 0 1.5-1.3L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".2" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap gap-3">
                                                        <Link
                                                            href={projectDraftsAction({ project: item.id }).url}
                                                            className="font-mono text-xs uppercase tracking-wider text-[#1a2620] underline-offset-4 hover:underline dark:text-[#e5eae6]"
                                                        >
                                                            View drafts
                                                        </Link>
                                                        <Link
                                                            href={home.url({ query: { project: item.id } })}
                                                            className="font-mono text-xs uppercase tracking-wider text-[#607267] underline-offset-4 hover:underline dark:text-[#7fa08d]"
                                                        >
                                                            Open project
                                                        </Link>
                                                    </div>
                                                </div>
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
                                One place to analyze, write, revise, and save better content.
                            </p>
                            <div className="flex items-center gap-4 font-mono">
                                <Link href={home()} className="hover:underline">Workspace</Link>
                                <span>/</span>
                                <Link href={promptPlayground.url()} className="hover:underline">Draft Writer</Link>
                                <span>/</span>
                                <Link href={conversationLab.url()} className="hover:underline">Revision Chat</Link>
                                <span>/</span>
                                <Link href={toolLab.url()} className="hover:underline">Content Tools</Link>
                                <span>/</span>
                                <Link href={streamingLab.url()} className="hover:underline">Final Pass</Link>
                            </div>
                        </div>
                    </div>
                </footer>

                {projectToDelete && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a2620]/65 backdrop-blur-xs transition-opacity"
                        onClick={() => setProjectToDelete(null)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className="paper-sheet w-full max-w-md bg-[#f5e4da] p-6 dark:bg-[#141a17] relative transition-all"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <span className="inline-block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#c2410c] dark:text-[#e8a382] mb-3">
                                [Warning: Permanent Action]
                            </span>
                            <h3 className="font-serif text-2xl font-light text-[#1a2620] dark:text-[#e5eae6]">
                                Delete Project?
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                Are you sure you want to permanently delete <strong className="text-[#1a2620] dark:text-[#e5eae6]">"{projectToDelete.title}"</strong>? This will remove all associated drafts and resources. This action cannot be undone.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#d5dbd7] pt-4 dark:border-[#222b27]">
                                <button
                                    type="button"
                                    onClick={() => setProjectToDelete(null)}
                                    className="btn-editorial-secondary px-5 py-2.5 font-mono text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.delete(destroyProjectAction({ project: projectToDelete.id }).url, {
                                            preserveScroll: true,
                                            onSuccess: () => setProjectToDelete(null),
                                            onFinish: () => setProjectToDelete(null),
                                        });
                                    }}
                                    className="border border-[#c2410c] bg-[#c2410c] text-white px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition hover:bg-[#a8552a] hover:border-[#a8552a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#1a2620] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#1a2620] dark:border-[#e8a382] dark:bg-[#e8a382] dark:text-[#101412] dark:hover:bg-[#f08a57] dark:hover:border-[#f08a57] dark:hover:shadow-[4px_4px_0px_0px_#e5eae6] dark:active:shadow-[1px_1px_0px_0px_#e5eae6] cursor-pointer"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
