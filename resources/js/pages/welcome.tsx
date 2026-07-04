import { Head, Link } from '@inertiajs/react';
import { analyzeContent, conversationLab, home, promptPlayground } from '@/routes';
import AppLayout from '@/layouts/AppLayout';

const featureCards = [
    {
        title: 'Prompt playground',
        description:
            'Generate raw Groq responses and tune tone, length, model profile, and sampling controls.',
        path: promptPlayground.url(),
        label: 'Open Prompt Lab',
    },
    {
        title: 'Structured analysis',
        description:
            'Turn pasted content into a clean title, category, summary, and tag list.',
        path: analyzeContent.url(),
        label: 'Open Analyzer',
    },
    {
        title: 'Conversation memory',
        description:
            'Continue the same thread, reload the page, and keep the full message trail in the database.',
        path: conversationLab.url(),
        label: 'Open Conversation Lab',
    },
];

const steps = [
    {
        num: 'I',
        title: 'Paste Text',
        text: 'Paste an article, draft, memo, or brief into the analyzer workspace.',
    },
    {
        num: 'II',
        title: 'Submit Request',
        text: 'Select your preferred LLM parameters and send the content for processing.',
    },
    {
        num: 'III',
        title: 'Extract Schema',
        text: 'View and utilize the structured title, category, summary, and tag results.',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Content Analyzer & AI Lab" />
            <AppLayout>
                <div className="editorial-grid min-h-[calc(100vh-5rem)] border-b border-[#d5dbd7] dark:border-[#222b27]">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                        {/* Hero Section */}
                        <div className="border-b border-[#d5dbd7] pb-12 dark:border-[#222b27] lg:pb-16">
                            <div className="max-w-4xl space-y-6">
                                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                    Workspace Overview
                                </p>
                                <h1 className="font-serif text-4xl font-light leading-[1.1] text-[#1a2620] dark:text-[#e5eae6] sm:text-5xl lg:text-6xl">
                                    Transitioning from raw copy to{' '}
                                    <span className="italic font-normal">structured information</span> that builds workflows.
                                </h1>
                                <p className="max-w-2xl font-sans text-base leading-relaxed text-[#607267] dark:text-[#7fa08d] sm:text-lg">
                                    Welcome to the AI Text Lab. A playground for engineering raw prompts, testing content analysis schema, and building multi-turn conversations with structured outputs.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link
                                        href={promptPlayground.url()}
                                        prefetch
                                        className="btn-editorial-primary inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                    >
                                        Prompt Playground
                                    </Link>
                                    <Link
                                        href={analyzeContent.url()}
                                        prefetch
                                        className="btn-editorial-secondary inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-wider"
                                    >
                                        Structured Analyzer
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Feature and Lab Section */}
                        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:gap-16 lg:pt-16">
                            <div className="space-y-8">
                                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#607267] dark:text-[#7fa08d]">
                                    Available Experiments
                                </h2>
                                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                                    {featureCards.map((item) => (
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
                                                    href={item.path}
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
                                        Methodology
                                    </h2>
                                    <ol className="space-y-6">
                                        {steps.map((step) => (
                                            <li
                                                key={step.title}
                                                className="group border-b border-[#d5dbd7] pb-6 last:border-b-0 dark:border-[#222b27]"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <span className="font-serif text-3xl font-light italic text-[#607267] dark:text-[#7fa08d]">
                                                        {step.num}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                                            {step.title}
                                                        </h3>
                                                        <p className="text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                            {step.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                <footer className="bg-[#e2e7e1] py-8 text-xs text-[#607267] dark:bg-[#0a0d0b] dark:text-[#7fa08d]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-xl font-mono uppercase tracking-wider">
                                A focused environment for structured content classification, raw generation, and transcript logging.
                            </p>
                            <div className="flex items-center gap-4 font-mono">
                                <Link href={home()} className="hover:underline">Home</Link>
                                <span>/</span>
                                <Link href={promptPlayground.url()} className="hover:underline">Playground</Link>
                                <span>/</span>
                                <Link href={conversationLab.url()} className="hover:underline">Lab</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </AppLayout>
        </>
    );
}
