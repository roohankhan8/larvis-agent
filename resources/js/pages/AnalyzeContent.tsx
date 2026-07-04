import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { analyzeAndSave as analyzeAndSaveAction } from '@/actions/App/Http/Controllers/AnalyzeContentController';
import AppLayout from '@/layouts/AppLayout';

type AnalysisResult = {
    status: string;
    data: {
        title: string;
        category: string;
        summary: string;
        tags: string[];
    };
};

type ErrorPayload = {
    message?: string;
    errors?: Record<string, string[]>;
};

export default function AnalyzeContent() {
    const [content, setContent] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
        null,
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const trimmedContent = content.trim();
    const wordCount =
        trimmedContent === '' ? 0 : trimmedContent.split(/\s+/).length;
    const characterCount = content.length;
    const lineCount = content === '' ? 0 : content.split('\n').length;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage(null);
        setAnalysisResult(null);

        if (trimmedContent.length < 20) {
            setErrorMessage('Enter at least 20 characters before analyzing.');

            return;
        }

        setIsSubmitting(true);

        try {
            const analyzeContentRoute = analyzeAndSaveAction();
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch(analyzeContentRoute.url, {
                method: analyzeContentRoute.method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({
                    content: trimmedContent,
                }),
            });

            const payload = (await response.json()) as AnalysisResult | ErrorPayload;

            if (!response.ok) {
                const errorPayload = payload as ErrorPayload;
                const validationError = Array.isArray(
                    errorPayload.errors?.content,
                )
                    ? errorPayload.errors.content[0]
                    : null;

                setErrorMessage(
                    validationError ??
                        errorPayload.message ??
                        'Analysis failed. Please try again.',
                );

                return;
            }

            setAnalysisResult(payload as AnalysisResult);
        } catch {
            setErrorMessage(
                'The request could not be completed. Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Head title="Analyze Content" />

            <AppLayout>
                <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-8">
                        <header className="border-b border-[#d5dbd7] pb-6 dark:border-[#222b27]">
                            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                Content Workspace
                            </p>
                            <h1 className="mt-3 font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl">
                                Extract structured schema from <span className="italic font-normal">raw text</span>
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-[#607267] dark:text-[#7fa08d]">
                                Paste your draft, article copy, or raw notes below. The AI analyzer will extract a structured title, categorizations, summary, and keywords.
                            </p>
                        </header>

                        <main className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                            <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <label className="block">
                                        <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                            Source copy
                                        </span>
                                        <textarea
                                            name="content"
                                            value={content}
                                            onChange={(event) => setContent(event.target.value)}
                                            placeholder="Paste your text copy here (minimum 20 characters)..."
                                            rows={14}
                                            className="min-h-64 w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-4 text-sm leading-relaxed text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        />
                                    </label>

                                    {errorMessage ? (
                                        <div className="border border-[#c2410c]/20 bg-[#c2410c]/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#e95e26]">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d5dbd7] pt-4 dark:border-[#222b27]">
                                        <div className="flex flex-wrap gap-4 font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                            <span>{wordCount} words</span>
                                            <span>/</span>
                                            <span>{characterCount} chars</span>
                                            <span>/</span>
                                            <span>{lineCount} lines</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider"
                                        >
                                            {isSubmitting ? 'Analyzing...' : 'Analyze content'}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <h2 className="border-b border-[#d5dbd7] pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6] dark:border-[#222b27]">
                                        Analysis schema
                                    </h2>

                                    {analysisResult ? (
                                        <div className="mt-4 space-y-5 text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                            <div className="border-b border-[#d5dbd7] pb-4 last:border-b-0 dark:border-[#222b27]">
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Suggested Title
                                                </p>
                                                <p className="mt-2 font-serif text-xl font-bold leading-tight text-[#1a2620] dark:text-[#e5eae6]">
                                                    {analysisResult.data.title}
                                                </p>
                                            </div>

                                            <div className="border-b border-[#d5dbd7] pb-4 last:border-b-0 dark:border-[#222b27]">
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Category
                                                </p>
                                                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                                    {analysisResult.data.category}
                                                </p>
                                            </div>

                                            <div className="border-b border-[#d5dbd7] pb-4 last:border-b-0 dark:border-[#222b27]">
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Summary
                                                </p>
                                                <p className="mt-2 text-sm text-[#607267] dark:text-[#7fa08d]">
                                                    {analysisResult.data.summary}
                                                </p>
                                            </div>

                                            <div className="pb-2 last:border-b-0">
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Tags
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                    {analysisResult.data.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="border border-[#d5dbd7] bg-[#f5e4da] px-2 py-0.5 font-mono text-[10px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-4 font-serif italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                            Submit text copy in the workspace to receive a structured analysis.
                                        </p>
                                    )}
                                </section>
                            </aside>
                        </main>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
