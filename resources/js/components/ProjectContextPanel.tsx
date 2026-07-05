import { Link } from '@inertiajs/react';
import { drafts as projectDraftsAction } from '@/actions/App/Http/Controllers/WriterWorkspaceController';
import {
    analyzeContent,
    conversationLab,
    home,
    promptPlayground,
    streamingLab,
    toolLab,
} from '@/routes';
import type { ContentProject } from '@/types/content-project';

type ProjectContextPanelProps = {
    project: ContentProject | null;
    currentPage:
        | 'workspace'
        | 'analyze'
        | 'prompt'
        | 'conversation'
        | 'tool'
        | 'streaming';
};

const stageLabels: Record<string, string> = {
    brief: 'Brief saved',
    analyzed: 'Analysis ready',
    drafting: 'Draft in progress',
    revising: 'Revision in progress',
    finalized: 'Final version saved',
};

function projectHref(baseUrl: string, project: ContentProject | null): string {
    if (project === null) {
        return baseUrl;
    }

    return `${baseUrl}?project=${project.id}`;
}

export default function ProjectContextPanel({
    project,
    currentPage,
}: ProjectContextPanelProps) {
    const actions = [
        { id: 'workspace', label: 'Workspace', href: projectHref(home.url(), project) },
        { id: 'analyze', label: 'Analyze this draft', href: projectHref(analyzeContent.url(), project) },
        { id: 'prompt', label: 'Write a draft', href: projectHref(promptPlayground.url(), project) },
        {
            id: 'drafts',
            label: 'View drafts',
            href: project !== null ? projectDraftsAction({ project: project.id }).url : home.url(),
        },
        { id: 'tool', label: 'Polish the draft', href: projectHref(toolLab.url(), project) },
        { id: 'conversation', label: 'Revise in chat', href: projectHref(conversationLab.url(), project) },
        { id: 'streaming', label: 'Create final version', href: projectHref(streamingLab.url(), project) },
    ] as const;

    if (!project) {
        return (
            <section className="paper-sheet p-5 dark:bg-[#141a17]">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                    Writing workflow
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                    Start in the workspace, create a project, and move from brief to final copy without losing your progress.
                </p>
                <div className="mt-4">
                    <Link
                        href={home()}
                        className="btn-editorial-secondary inline-flex items-center justify-center px-4 py-2 font-mono text-xs uppercase tracking-wider"
                    >
                        Go to workspace
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="paper-sheet p-5 dark:bg-[#141a17]">
            <div className="flex items-start justify-between gap-4 border-b border-[#d5dbd7] pb-4 dark:border-[#222b27]">
                <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                        Current project
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-light text-[#1a2620] dark:text-[#e5eae6]">
                        {project.title}
                    </h2>
                </div>
                <span className="border border-[#d5dbd7] bg-[#f5e4da] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                    {stageLabels[project.status] ?? project.status}
                </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="border border-[#d5dbd7] p-3 dark:border-[#222b27]">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                        Content type
                    </p>
                    <p className="mt-2 text-sm text-[#1a2620] dark:text-[#e5eae6]">
                        {project.content_type ?? 'Not selected'}
                    </p>
                </div>
                <div className="border border-[#d5dbd7] p-3 dark:border-[#222b27]">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                        Current draft
                    </p>
                    <p className="mt-2 text-sm text-[#1a2620] dark:text-[#e5eae6]">
                        {project.current_draft ? `${project.current_draft.split(/\s+/).length} words` : 'No draft yet'}
                    </p>
                </div>
                <div className="border border-[#d5dbd7] p-3 dark:border-[#222b27]">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                        Draft versions
                    </p>
                    <p className="mt-2 text-sm text-[#1a2620] dark:text-[#e5eae6]">
                        {project.drafts.length}
                    </p>
                </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                Every step saves back into this project, so the next page always starts with your latest brief, draft, analysis, or revision.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {actions.map((action) => (
                    <Link
                        key={action.id}
                        href={action.href}
                        className={
                            action.id === currentPage
                                ? 'border border-[#1a2620] bg-[#1a2620] px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-[#f4f6f3] dark:border-[#e5eae6] dark:bg-[#e5eae6] dark:text-[#101412]'
                                : 'border border-[#d5dbd7] px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-[#607267] hover:border-[#1a2620] dark:border-[#222b27] dark:text-[#7fa08d] dark:hover:border-[#e5eae6]'
                        }
                    >
                        {action.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}
