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
                <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_45%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
                    <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-8">
                    <header className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium tracking-[0.28em] text-cyan-300/80 uppercase">
                                    Content workspace
                                </p>
                                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    Analyze content from a simple input page
                                </h1>
                            </div>
                        </div>

                        <p className="max-w-2xl text-sm leading-6 text-slate-300">
                            Paste your draft, notes, or article copy below.
                        </p>
                    </header>

                    <main className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-200">
                                        Content
                                    </span>
                                    <textarea
                                        name="content"
                                        value={content}
                                        onChange={(event) =>
                                            setContent(event.target.value)
                                        }
                                        placeholder="Paste content here..."
                                        rows={14}
                                        className="min-h-64 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white transition outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/7 focus:ring-4 focus:ring-cyan-400/10"
                                    />
                                </label>

                                {errorMessage ? (
                                    <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                                        {errorMessage}
                                    </div>
                                ) : null}

                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                                    <div className="flex flex-wrap gap-4">
                                        <span>{wordCount} words</span>
                                        <span>{characterCount} characters</span>
                                        <span>{lineCount} lines</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex h-11 items-center rounded-full bg-cyan-400 px-5 font-medium text-slate-950 transition hover:bg-cyan-300"
                                    >
                                        {isSubmitting
                                            ? 'Analyzing...'
                                            : 'Analyze content'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <aside className="space-y-6">
                            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10 p-6">
                                <h2 className="text-lg font-semibold text-white">
                                    Analysis result
                                </h2>

                                {analysisResult ? (
                                    <div className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
                                        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                                            <p className="text-xs tracking-[0.24em] text-cyan-200/80 uppercase">
                                                Title
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-white">
                                                {analysisResult.data.title}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                                            <p className="text-xs tracking-[0.24em] text-cyan-200/80 uppercase">
                                                Category
                                            </p>
                                            <p className="mt-2">
                                                {analysisResult.data.category}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                                            <p className="text-xs tracking-[0.24em] text-cyan-200/80 uppercase">
                                                Summary
                                            </p>
                                            <p className="mt-2">
                                                {analysisResult.data.summary}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                                            <p className="text-xs tracking-[0.24em] text-cyan-200/80 uppercase">
                                                Tags
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {analysisResult.data.tags.map(
                                                    (tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm leading-6 text-slate-300">
                                        Submit content to receive a structured
                                        title, category, summary, and tags.
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
