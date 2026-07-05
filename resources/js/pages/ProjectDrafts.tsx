import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FormattedContent from '@/components/FormattedContent';
import ProjectContextPanel from '@/components/ProjectContextPanel';
import AppLayout from '@/layouts/AppLayout';
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
    const [selectedDraft, setSelectedDraft] = useState<DraftItem | null>(null);
    const [draftToDelete, setDraftToDelete] = useState<DraftItem | null>(null);

    // Keyboard handlers (Escape key) for closing popups
    useEffect(() => {
        if (!selectedDraft && !draftToDelete) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSelectedDraft(null);
                setDraftToDelete(null);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedDraft, draftToDelete]);

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

                                    <div className="mt-4 divide-y divide-[#d5dbd7] dark:divide-[#222b27]">
                                        {drafts.length > 0 ? (
                                            drafts.map((draft, index) => (
                                                <div
                                                    key={draft.id}
                                                    className="flex items-center justify-between py-4 group hover:bg-[#eedcd2]/20 dark:hover:bg-[#151c19]/30 px-2 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedDraft(draft)}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                                Version {index + 1}
                                                            </span>
                                                            <span className="border border-[#d5dbd7] bg-[#eedcd2] px-2 py-0.5 font-mono text-[9px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                                                                {draft.source}
                                                            </span>
                                                        </div>
                                                        <h3 className="mt-1 font-serif text-lg font-bold text-[#1a2620] dark:text-[#e5eae6] group-hover:underline">
                                                            {draft.label}
                                                        </h3>
                                                        {draft.content && (
                                                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#607267] dark:text-[#7fa08d] pr-8">
                                                                {draft.content.replace(/[#*`_-]/g, ' ').replace(/\s+/g, ' ').trim()}
                                                            </p>
                                                        )}
                                                        <p className="mt-2 font-mono text-[10px] text-[#607267] dark:text-[#7fa08d]">
                                                            Saved: {formatDate(draft.created_at)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3" onClick={(event) => event.stopPropagation()}>
                                                        {/* Open button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedDraft(draft)}
                                                            className="inline-flex h-9 px-4 items-center justify-center border border-[#d5dbd7] text-[#1a2620] hover:border-[#1a2620] dark:border-[#222b27] dark:text-[#e5eae6] dark:hover:border-[#e5eae6] font-mono text-[10px] uppercase tracking-wider transition bg-transparent cursor-pointer"
                                                        >
                                                            Open
                                                        </button>

                                                        {/* Delete button */}
                                                        <button
                                                            type="button"
                                                            aria-label={`Delete version ${index + 1}`}
                                                            onClick={() => setDraftToDelete(draft)}
                                                            className="inline-flex h-9 w-9 items-center justify-center border border-[#d5dbd7] text-[#a8552a] hover:border-[#a8552a] hover:bg-[#fff1ea] dark:border-[#222b27] dark:text-[#f08a57] dark:hover:bg-[#2b1912] transition cursor-pointer"
                                                        >
                                                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                                                                <path d="M7 4h6m-8 2h10m-8 0 .6 8.2A1 1 0 0 0 8.6 15h2.8a1 1 0 0 0 1-.8L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M9 8v4m2-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M6 6l.4 8.7A1.5 1.5 0 0 0 7.9 16h4.2a1.5 1.5 0 0 0 1.5-1.3L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center text-sm italic text-[#607267] dark:text-[#7fa08d]">
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
                                        <div className="mt-3">
                                            {project?.current_draft ? (
                                                <FormattedContent text={project.current_draft} />
                                            ) : (
                                                <p className="italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                                    No active draft yet.
                                                </p>
                                            )}
                                        </div>
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
                                        <div className="mt-3">
                                            {project?.final_output ? (
                                                <FormattedContent text={project.final_output} />
                                            ) : (
                                                <p className="italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                                    No final output saved yet.
                                                </p>
                                            )}
                                        </div>
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

                {/* Open Draft Detail Modal */}
                {selectedDraft && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a2620]/65 backdrop-blur-xs transition-opacity"
                        onClick={() => setSelectedDraft(null)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className="paper-sheet w-full max-w-2xl max-h-[85vh] bg-[#f5e4da] p-6 dark:bg-[#141a17] relative flex flex-col transition-all overflow-hidden"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {/* Close button in top-right */}
                            <button
                                type="button"
                                onClick={() => setSelectedDraft(null)}
                                className="absolute top-4 right-4 text-[#607267] hover:text-[#1a2620] dark:text-[#7fa08d] dark:hover:text-[#e5eae6] p-1 cursor-pointer"
                                aria-label="Close popup"
                            >
                                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                                    <path d="M6 6l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>

                            <div>
                                <span className="inline-block border border-[#d5dbd7] bg-[#eedcd2] px-2 py-0.5 font-mono text-[9px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d] mb-2">
                                    Source: {selectedDraft.source}
                                </span>
                                <h3 className="font-serif text-2xl font-light text-[#1a2620] dark:text-[#e5eae6] pr-8 leading-tight">
                                    {selectedDraft.label}
                                </h3>
                                <p className="mt-1 font-mono text-[10px] text-[#607267] dark:text-[#7fa08d]">
                                    Saved: {formatDate(selectedDraft.created_at)}
                                </p>
                            </div>

                            {/* Scrollable Formatted Content */}
                            <div className="flex-1 overflow-y-auto mt-4 pr-1 border-t border-b border-[#d5dbd7] py-4 dark:border-[#222b27]">
                                <FormattedContent text={selectedDraft.content} />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setSelectedDraft(null)}
                                    className="btn-editorial-secondary px-5 py-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {draftToDelete && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a2620]/65 backdrop-blur-xs transition-opacity"
                        onClick={() => setDraftToDelete(null)}
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
                                Delete Draft?
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                Are you sure you want to permanently delete the draft <strong className="text-[#1a2620] dark:text-[#e5eae6]">"{draftToDelete.label}"</strong>? This action is irreversible.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#d5dbd7] pt-4 dark:border-[#222b27]">
                                <button
                                    type="button"
                                    onClick={() => setDraftToDelete(null)}
                                    className="btn-editorial-secondary px-5 py-2.5 font-mono text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (project) {
                                            router.delete(`/projects/${project.id}/drafts/${draftToDelete.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => setDraftToDelete(null),
                                                onFinish: () => setDraftToDelete(null),
                                            });
                                        }
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
