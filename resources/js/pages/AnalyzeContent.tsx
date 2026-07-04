import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { analyzeContent, home } from '@/routes';

export default function AnalyzeContent() {
    const [content, setContent] = useState('');

    const trimmedContent = content.trim();
    const wordCount =
        trimmedContent === '' ? 0 : trimmedContent.split(/\s+/).length;
    const characterCount = content.length;
    const lineCount = content === '' ? 0 : content.split('\n').length;

    return (
        <>
            <Head title="Analyze Content" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_45%,_#020617_100%)] px-6 py-10 text-slate-100 lg:px-10">
                <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center gap-8">
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

                            <Link
                                href={home()}
                                className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                            >
                                Home
                            </Link>
                        </div>

                        <p className="max-w-2xl text-sm leading-6 text-slate-300">
                            Paste your draft, notes, or article copy below. The
                            page keeps the route in{' '}
                            <code className="rounded bg-white/10 px-1.5 py-0.5">
                                web.php
                            </code>
                            and gives you a clean place to start analyzing
                            content.
                        </p>
                    </header>

                    <main className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Input content
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        The text area below is wired to the
                                        existing route.
                                    </p>
                                </div>

                                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                                    Live draft
                                </div>
                            </div>

                            <Form
                                {...analyzeContent.form()}
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

                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                                    <div className="flex flex-wrap gap-4">
                                        <span>{wordCount} words</span>
                                        <span>{characterCount} characters</span>
                                        <span>{lineCount} lines</span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex h-11 items-center rounded-full bg-cyan-400 px-5 font-medium text-slate-950 transition hover:bg-cyan-300"
                                    >
                                        Submit content
                                    </button>
                                </div>
                            </Form>
                        </section>

                        <aside className="space-y-6">
                            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h2 className="text-lg font-semibold text-white">
                                    Preview
                                </h2>
                                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                                    {trimmedContent === '' ? (
                                        <p className="text-slate-500">
                                            Your input will appear here as you
                                            type.
                                        </p>
                                    ) : (
                                        <p className="whitespace-pre-wrap">
                                            {content}
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10 p-6">
                                <h2 className="text-lg font-semibold text-white">
                                    What this page does
                                </h2>
                                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                    <li>
                                        Collects content in a dedicated Inertia
                                        page.
                                    </li>
                                    <li>
                                        Submits through the named
                                        `/analyze-content` route.
                                    </li>
                                    <li>
                                        Keeps the interface light enough to
                                        extend later with analysis results.
                                    </li>
                                </ul>
                            </section>
                        </aside>
                    </main>
                </div>
            </div>
        </>
    );
}
