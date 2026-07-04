import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { analyzeContent, conversationLab, home, promptPlayground } from '@/routes';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100">
            <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <Link href={home()} className="group flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-semibold text-cyan-100 transition group-hover:border-cyan-300/35 group-hover:bg-cyan-300/15">
                            CA
                        </span>
                        <div className="min-w-0">
                            <p className="text-[0.65rem] font-semibold tracking-[0.4em] text-cyan-300/80 uppercase sm:text-xs">
                                Laravel AI SDK
                            </p>
                            <p className="mt-1 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                                AI Text Lab
                            </p>
                        </div>
                    </Link>

                    {/* <div className="flex flex-wrap items-center gap-2 lg:justify-center">
                        <Link
                            href={home()}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
                        >
                            Home
                        </Link>
                        <a
                            href="/#overview"
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
                        >
                            Overview
                        </a>
                        <a
                            href="/#workflow"
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
                        >
                            Workflow
                        </a>
                        <Link
                            href={promptPlayground.url()}
                            prefetch
                            className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-300/15"
                        >
                            Prompt playground
                        </Link>
                    </div> */}

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Link
                            href={conversationLab.url()}
                            prefetch
                            className="inline-flex items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
                        >
                            Conversation lab
                        </Link>
                        <Link
                            href={promptPlayground.url()}
                            prefetch
                            className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                        >
                            Open prompt lab
                        </Link>
                        <Link
                            href={analyzeContent.url()}
                            prefetch
                            className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Analyze content
                        </Link>
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}
