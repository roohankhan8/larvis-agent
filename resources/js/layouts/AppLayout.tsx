import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import {
    analyzeContent,
    conversationLab,
    home,
    login,
    logout,
    promptPlayground,
    register,
    streamingLab,
    toolLab,
} from '@/routes';

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f4f6f3] text-[#1a2620] dark:bg-[#101412] dark:text-[#e5eae6] transition-colors duration-200">
            <header className="sticky top-0 z-30 border-b border-[#d5dbd7] bg-[#f4f6f3]/90 backdrop-blur-sm dark:border-[#222b27] dark:bg-[#101412]/90">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <Link href={home()} className="group flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-[#1a2620] bg-[#1a2620] font-serif text-xl font-bold italic text-[#f4f6f3] dark:border-[#e5eae6] dark:bg-[#e5eae6] dark:text-[#101412] transition duration-200">
                            L
                        </span>
                        <div className="min-w-0">
                            <p className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-[#607267] uppercase">
                                Laravel AI
                            </p>
                            <h2 className="font-serif text-lg font-bold tracking-tight text-[#1a2620] dark:text-[#e5eae6]">
                                Editorial Lab
                            </h2>
                        </div>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-center">
                        {/* <Link
                            href={home()}
                            className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                        >
                            Overview
                        </Link>
                        <span className="text-[#d5dbd7] dark:text-[#222b27]">/</span> */}
                        <Link
                            href={promptPlayground.url()}
                            prefetch
                            className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                        >
                            Prompt Playground
                        </Link>
                        <span className="text-[#d5dbd7] dark:text-[#222b27]">/</span>
                        <Link
                            href={analyzeContent.url()}
                            prefetch
                            className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                        >
                            Content Analyzer
                        </Link>
                        <span className="text-[#d5dbd7] dark:text-[#222b27]">/</span>
                        <Link
                            href={conversationLab.url()}
                            prefetch
                            className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                        >
                            Conversation Lab
                        </Link>
                        <span className="text-[#d5dbd7] dark:text-[#222b27]">/</span>
                        <Link
                            href={toolLab.url()}
                            prefetch
                            className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                        >
                            Tool Lab
                        </Link>
                        <span className="text-[#d5dbd7] dark:text-[#222b27]">/</span>
                        <Link
                            href={streamingLab.url()}
                            prefetch
                            className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                        >
                            Streaming Lab
                        </Link>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">
                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs tracking-tight text-[#607267] dark:text-[#7fa08d]">
                                    {auth.user.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => router.post(logout())}
                                    className="font-mono text-xs uppercase tracking-wider text-[#c2410c] hover:underline"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={login()}
                                    prefetch
                                    className="font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition"
                                >
                                    Log in
                                </Link>
                                <span className="text-[#d5dbd7] dark:text-[#222b27]">|</span>
                                <Link
                                    href={register()}
                                    prefetch
                                    className="font-mono text-xs uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6] hover:underline font-semibold"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="relative min-h-[calc(100vh-10rem)]">
                {children}
            </main>
        </div>
    );
}
