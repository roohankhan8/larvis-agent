import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import ProjectContextPanel from '@/components/ProjectContextPanel';
import AppLayout from '@/layouts/AppLayout';
import type { ContentProject } from '@/types/content-project';

type StreamingChunk = {
    type?: string;
    delta?: string;
};

type StreamingLabProps = {
    project: ContentProject | null;
    initialPrompt: string | null;
};

export default function StreamingLab({
    project,
    initialPrompt,
}: StreamingLabProps) {
    const [prompt, setPrompt] = useState(
        initialPrompt ??
            'Draft a concise launch announcement for a new analytics dashboard.',
    );
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (isStreaming) {
            return;
        }

        setError('');
        setResponse('');
        setIsStreaming(true);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const csrfToken =
            document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const xsrfToken = decodeURIComponent(
            document.cookie
                .split('; ')
                .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );

        try {
            const res = await fetch('/streaming-lab', {
                method: 'POST',
                headers: {
                    Accept: 'text/event-stream',
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                    ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    prompt,
                    project_id: project?.id ?? null,
                }),
                signal: abortController.signal,
            });

            if (!res.ok || !res.body) {
                throw new Error('Unable to stream a response right now.');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) {
                        continue;
                    }

                    const payload = line.slice(6);

                    if (payload === '[DONE]') {
                        continue;
                    }

                    try {
                        const chunk = JSON.parse(payload) as StreamingChunk;

                        if (chunk.type === 'text_delta' && typeof chunk.delta === 'string') {
                            setResponse((current) => current + chunk.delta);
                        }
                    } catch {
                        continue;
                    }
                }
            }
        } catch (streamError) {
            if ((streamError as DOMException).name !== 'AbortError') {
                setError(
                    streamError instanceof Error
                        ? streamError.message
                        : 'Streaming failed. Try again.',
                );
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    }

    return (
        <AppLayout>
            <Head title="Final Pass" />

            <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                    <header className="border-b border-[#d5dbd7] pb-6 dark:border-[#222b27]">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                            <div className="space-y-3">
                                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                    Final version
                                </p>
                                <h1 className="font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl lg:text-5xl">
                                    Final Pass
                                </h1>
                                <p className="max-w-2xl text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                    Generate a polished final version and watch it appear in real time as the AI writes.
                                </p>
                            </div>

                            {/* <div className="border border-[#d5dbd7] bg-[#f5e4da] p-5 dark:border-[#222b27] dark:bg-[#141a17]">
                                <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                    Stream Specifications
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                    These notes explain how the response reaches the page and why text appears incrementally instead of all at once.
                                </p>
                                <ul className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                    <li className="flex items-center gap-2">
                                        <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                        <span>Transport: Server-sent events</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                        <span>Parsing: SSE JSON envelopes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                        <span>Output: Incremental text deltas</span>
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    </header>

                    <main className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                        <section className="paper-sheet p-6 dark:bg-[#141a17]">
                            <div className="mb-6">
                                <ProjectContextPanel project={project} currentPage="streaming" />
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <label className="block">
                                    <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Final version request
                                    </span>
                                    <textarea
                                        value={prompt}
                                        onChange={(event) => setPrompt(event.target.value)}
                                        placeholder="Describe the final version you want to create..."
                                        rows={8}
                                        className="min-h-44 w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-4 text-sm leading-relaxed text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                    />
                                </label>

                                {error ? (
                                    <div className="border border-[#c2410c]/20 bg-[#c2410c]/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#e95e26]">
                                        {error}
                                    </div>
                                ) : null}

                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d5dbd7] pt-4 dark:border-[#222b27]">
                                    {/* <div className="flex flex-wrap gap-4 font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                        <span>Transport: SSE</span>
                                        <span>/</span>
                                        <span>Format: JSON delta</span>
                                    </div> */}

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isStreaming}
                                            className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isStreaming ? 'Writing...' : 'Generate final version'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                abortControllerRef.current?.abort();
                                            }}
                                            disabled={!isStreaming}
                                            className="btn-editorial-secondary px-6 py-2.5 font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Stop
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </section>

                        <aside className="space-y-6">
                            <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                <div className="flex items-center justify-between border-b border-[#d5dbd7] pb-3 dark:border-[#222b27]">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Live preview
                                    </h2>
                                    <span className="border border-[#d5dbd7] bg-[#f5e4da] px-2 py-0.5 font-mono text-[9px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                                        {isStreaming ? 'Active' : 'Idle'}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                    This preview updates as the AI writes, so you can follow the final version as it is created.
                                </p>

                                <div className="mt-4 border border-[#d5dbd7] bg-[#f5e4da]/50 p-4 dark:border-[#222b27] dark:bg-[#151c19]/50">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                        Final draft
                                    </p>
                                    <p className="mt-2 text-xs leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        The final version appears here as it is generated.
                                    </p>
                                    <pre className="mt-3 min-h-64 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                        {response.length > 0 ? (
                                            response
                                        ) : (
                                            <span className="text-[#607267] dark:text-[#7fa08d] italic">
                                                Your final version will appear here.
                                            </span>
                                        )}
                                    </pre>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                        <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Status</p>
                                        <p className="mt-2 text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                            Shows whether the final version is still being written or is ready.
                                        </p>
                                        <p className="mt-1 font-bold text-[#1a2620] dark:text-[#e5eae6]">
                                            {isStreaming ? 'Writing now' : 'Ready'}
                                        </p>
                                    </div>
                                    <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                        <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Saving</p>
                                        <p className="mt-2 text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                            When the response finishes, it is saved back into your project history.
                                        </p>
                                        <p className="mt-1 text-[#1a2620] dark:text-[#e5eae6]">
                                            Saved to project
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
