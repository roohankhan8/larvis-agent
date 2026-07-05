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
    const page = usePage();
    const { auth } = page.props;
    const currentPath = page.url.split('?')[0];
    const project = page.props.project as { id: number } | null | undefined;

    type WorkflowStep = {
        key: 'workspace' | 'analyze' | 'prompt' | 'tool' | 'conversation' | 'streaming';
        label: string;
        href: string;
    };

    const workflowSteps: WorkflowStep[] = [
        { key: 'workspace', label: 'Workspace', href: home.url() },
        { key: 'analyze', label: 'Analyze Content', href: analyzeContent.url() },
        { key: 'prompt', label: 'Draft Writer', href: promptPlayground.url() },
        { key: 'tool', label: 'Content Tools', href: toolLab.url() },
        { key: 'conversation', label: 'Revision Chat', href: conversationLab.url() },
        { key: 'streaming', label: 'Final Pass', href: streamingLab.url() },
    ];

    const activeStepIndex = workflowSteps.findIndex((step) => step.href === currentPath);
    const visibleWorkflowSteps =
        activeStepIndex === -1
            ? workflowSteps.slice(0, 3)
            : workflowSteps.slice(0, Math.min(activeStepIndex + 2, workflowSteps.length));

    function withProject(url: string): string {
        if (project === undefined || project === null) {
            return url;
        }

        return `${url}?project=${project.id}`;
    }

    function navLinkClass(href: string): string {
        const isActive = currentPath === href;

        return isActive
            ? 'border border-[#1a2620] bg-[#1a2620] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#f4f6f3] dark:border-[#e5eae6] dark:bg-[#e5eae6] dark:text-[#101412] transition'
            : 'font-mono text-xs uppercase tracking-wider text-[#607267] dark:text-[#7fa08d] hover:text-[#1a2620] dark:hover:text-[#e5eae6] transition';
    }

    return (
        <div className="min-h-screen bg-[#f4f6f3] text-[#1a2620] dark:bg-[#101412] dark:text-[#e5eae6] transition-colors duration-200">
            <header className="sticky top-0 z-30 border-b border-[#d5dbd7] bg-[#f4f6f3]/90 backdrop-blur-sm dark:border-[#222b27] dark:bg-[#101412]/90">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <Link href={home()} className="group flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-[#1a2620] bg-[#1a2620] font-serif text-xl font-bold italic text-[#f4f6f3] dark:border-[#e5eae6] dark:bg-[#e5eae6] dark:text-[#101412] transition duration-200">
                            L
                        </span>
                        <div className="min-w-0">
                            {/* <p className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-[#607267] uppercase">
                                Laravel AI
                            </p> */}
                            <h2 className="font-serif text-lg font-bold tracking-tight text-[#1a2620] dark:text-[#e5eae6]">
                                Larvis Writer
                            </h2>
                        </div>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-center">
                        {/* <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                            Writing flow
                        </span>
                        <span className="text-[#d5dbd7] dark:text-[#222b27]">/</span> */}
                        {visibleWorkflowSteps.map((step) => (
                            <Link
                                key={step.key}
                                href={withProject(step.href)}
                                prefetch
                                className={navLinkClass(step.href)}
                            >
                                {step.label}
                            </Link>
                        ))}
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
                                    className="btn-editorial-primary px-4 py-2 font-mono text-xs uppercase tracking-wider"
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
