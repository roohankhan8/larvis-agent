import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import ProjectContextPanel from '@/components/ProjectContextPanel';
import { home } from '@/routes';
import type { ContentProject } from '@/types/content-project';

type DraftItem = {
    id: string;
    label: string;
    content: string;
    source: string;
    created_at: string | null;
    metadata?: Record<string, unknown>;
};

type ProjectDraftsProps = {
    project: ContentProject | null;
    drafts: DraftItem[];
};

function formatDate(value: string | null): string {
    if (!value) {
        return 'Recently saved';
    }

    return new Date(value).toLocaleString();
}

export default function ProjectDrafts({ project, drafts }: ProjectDraftsProps) {
    return (
        <>
            <Head title="Project Drafts" />

            <AppLayout>
                <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <header className="border-b border-[#d5dbd7] pb-6 dark:border-[#222b27]">
                            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                Project history
                            </p>
                            <h1 className="mt-3 font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl lg:text-5xl">
                                Draft history for {project?.title ?? 'this project'}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                Review every saved version in one place. Use this page to compare earlier drafts, check the latest working copy, and move back into the writing flow.
                            </p>
                        </header>

                        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                            <section className="space-y-6">
                                <ProjectContextPanel project={project} currentPage="workspace" />

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <div className="flex items-center justify-between border-b border-[#d5dbd7] pb-3 dark:border-[#222b27]">
                                        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                            Draft timeline
                                        </h2>
                                        <span className="border border-[#d5dbd7] bg-[#f5e4da] px-2 py-0.5 font-mono text-[9px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                                            {drafts.length} saved drafts
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        {drafts.length > 0 ? (
                                            drafts.map((draft, index) => (
                                                <article
                                                    key={draft.id}
                                                    className="border border-[#d5dbd7] bg-[#f5e4da]/60 p-4 dark:border-[#222b27] dark:bg-[#151c19]/60"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <div>
                                                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                                Version {index + 1}
                                                            </p>
                                                            <h3 className="mt-1 font-serif text-xl text-[#1a2620] dark:text-[#e5eae6]">
                                                                {draft.label}
                                                            </h3>
                                                        </div>
                                                        <div className="text-right font-mono text-[10px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                            <p>{draft.source}</p>
                                                            <p>{formatDate(draft.created_at)}</p>
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                                        {draft.content}
                                                    </p>
                                                </article>
                                            ))
                                        ) : (
                                            <div className="border border-dashed border-[#d5dbd7] p-6 text-sm italic text-[#607267] dark:border-[#222b27] dark:text-[#7fa08d]">
                                                No drafts have been saved yet. Generate copy in the writing flow first.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </section>

                            <aside className="space-y-6">
                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Current copy
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        This is the version currently treated as the active draft for the project.
                                    </p>
                                    <div className="mt-4 border border-[#d5dbd7] bg-[#f5e4da]/50 p-4 dark:border-[#222b27] dark:bg-[#151c19]/50">
                                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                            Active draft
                                        </p>
                                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                            {project?.current_draft ?? 'No active draft yet.'}
                                        </p>
                                    </div>
                                </section>

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Final output
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        When the final pass is complete, the finished version appears here as well.
                                    </p>
                                    <div className="mt-4 border border-[#d5dbd7] bg-[#f5e4da]/50 p-4 dark:border-[#222b27] dark:bg-[#151c19]/50">
                                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                            Final version
                                        </p>
                                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                            {project?.final_output ?? 'No final output saved yet.'}
                                        </p>
                                    </div>
                                </section>

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <Link
                                        href={project ? home.url({ query: { project: project.id } }) : home.url()}
                                        className="btn-editorial-primary inline-flex w-full items-center justify-center px-4 py-3 font-mono text-xs uppercase tracking-wider"
                                    >
                                        Back to workspace
                                    </Link>
                                </section>
                            </aside>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
