import { Head, Link } from '@inertiajs/react';
import { analyzeContent, conversationLab, promptPlayground } from '@/routes';
import AppLayout from '@/layouts/AppLayout';

const featureCards = [
    {
        title: 'Prompt playground',
        description:
            'Generate raw Groq responses and tune tone, length, model profile, and sampling controls.',
    },
    {
        title: 'Structured analysis',
        description:
            'Turn pasted content into a clean title, category, summary, and tag list.',
    },
    {
        title: 'Browser-first flow',
        description:
            'Users can review the result in one place without opening a separate tool.',
    },
    {
        title: 'Conversation memory',
        description:
            'Continue the same thread, reload the page, and keep the full message trail in the database.',
    },
    {
        title: 'Built for growth',
        description:
            'The page can expand into moderation, classification, or publishing workflows.',
    },
];

const steps = [
    'Paste an article, draft, memo, or brief.',
    'Submit it to the analyzer.',
    'Use the structured response to organize the content.',
];

// const exampleResponse = {
//     status: 'success',
//     data: {
//         title: 'New Framework Update Boosts Concurrency, Cuts Server Costs',
//         category: 'Software Development',
//         summary:
//             "The latest framework update's concurrency features accelerated background jobs fourfold, significantly lowering server expenses.",
//         tags: [
//             'framework update',
//             'concurrency',
//             'background jobs',
//             'performance',
//             'cost reduction',
//             'server bills',
//         ],
//     },
// };

export default function Welcome() {
    return (
        <>
            <Head title="Content Analyzer" />
            <AppLayout>
                <div className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.16),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_65%)]" />
                    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-400/10 to-transparent" />

                    <main className="relative mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-10">
                        <section id="overview" className="space-y-6 sm:space-y-8">
                            <div className="max-w-2xl space-y-5">
                                <div className="space-y-4">
                                    <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.05]">
                                        Guide users from raw text to structured
                                        content they can act on.
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base lg:text-lg">
                                        This project is turning into a focused AI
                                        lab. Start with raw prompt experiments in
                                        the Groq playground, then compare the
                                        output against the structured analyzer for
                                        classification-style workflows.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* <Link
                                    href={promptPlayground.url()}
                                    prefetch
                                    className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 sm:w-auto"
                                >
                                    Open prompt playground
                                </Link>
                                <Link
                                    href={analyzeContent.url()}
                                    prefetch
                                    className="inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 sm:w-auto"
                                >
                                    Open structured analyzer
                                </Link>
                                <div className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-300 sm:w-auto sm:justify-start">
                                    Designed for mobile and desktop
                                </div> */}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={conversationLab.url()}
                                    prefetch
                                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 sm:w-auto"
                                >
                                    Open conversation lab
                                </Link>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {featureCards.map((item) => (
                                    <article
                                        key={item.title}
                                        className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur"
                                    >
                                        <h3 className="text-base font-semibold text-white">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-300">
                                            {item.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <aside className="space-y-5 lg:sticky lg:top-28">
                            <section
                                id="workflow"
                                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/15 backdrop-blur"
                            >
                                <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                                    <p className="text-xs font-semibold tracking-[0.32em] text-cyan-300/80 uppercase">
                                        How it works
                                    </p>
                                </div>
                                <ol className="space-y-3 p-5 sm:p-6">
                                    {steps.map((step, index) => (
                                        <li
                                            key={step}
                                            className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-slate-950">
                                                {index + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        </aside>
                    </main>

                    <footer className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 border-t border-white/10 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-xl leading-6">
                            A focused entry point for users who need structured
                            content analysis, not a generic marketing splash.
                        </p>
                        <Link
                            href={promptPlayground.url()}
                            prefetch
                            className="inline-flex w-full items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 font-medium text-amber-100 transition hover:bg-amber-300/15 sm:w-auto"
                        >
                            Go to /prompt-playground
                        </Link>
                        <Link
                            href={conversationLab.url()}
                            prefetch
                            className="inline-flex w-full items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 font-medium text-emerald-100 transition hover:bg-emerald-300/15 sm:w-auto"
                        >
                            Go to /conversation-lab
                        </Link>
                    </footer>
                </div>
            </AppLayout>
        </>
    );
}
