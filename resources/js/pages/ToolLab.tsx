import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { generate as generateToolLabAction } from '@/actions/App/Http/Controllers/ToolLabController';
import AppLayout from '@/layouts/AppLayout';
import { promptPlayground, streamingLab, toolLab } from '@/routes';

type AudienceOption = 'founders' | 'developers' | 'marketers';
type GoalOption = 'signup' | 'demo' | 'launch';

type ToolCall = {
    id: string;
    name: string;
    arguments: Record<string, string>;
    result_id?: string | null;
};

type ToolResult = {
    id: string;
    name: string;
    arguments: Record<string, string>;
    result: string;
    result_id?: string | null;
};

type ToolLabProps = {
    defaults: {
        audience: AudienceOption;
        goal: GoalOption;
    };
    audienceOptions: Array<{
        value: AudienceOption;
        label: string;
        description: string;
    }>;
    goalOptions: Array<{
        value: GoalOption;
        label: string;
        description: string;
    }>;
};

type ToolLabResponse = {
    status: string;
    data: {
        prompt: string;
        answer: string;
        settings: {
            provider: string;
            model: string;
            audience: AudienceOption;
            goal: GoalOption;
        };
        tool_calls: ToolCall[];
        tool_results: ToolResult[];
    };
};

type ErrorPayload = {
    message?: string;
    errors?: Record<string, string[]>;
};

export default function ToolLab({
    defaults,
    audienceOptions,
    goalOptions,
}: ToolLabProps) {
    const [prompt, setPrompt] = useState(
        'Write a homepage hero paragraph for a developer-focused launch of an AI workflow dashboard, and make the close push readers toward trying it today.',
    );
    const [audience, setAudience] = useState<AudienceOption>(defaults.audience);
    const [goal, setGoal] = useState<GoalOption>(defaults.goal);
    const [result, setResult] = useState<ToolLabResponse['data'] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const trimmedPrompt = prompt.trim();
    const selectedAudience =
        audienceOptions.find((option) => option.value === audience) ??
        audienceOptions[0];
    const selectedGoal =
        goalOptions.find((option) => option.value === goal) ?? goalOptions[0];

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage(null);
        setResult(null);

        if (trimmedPrompt.length < 10) {
            setErrorMessage('Enter at least 10 characters before running the lab.');

            return;
        }

        setIsSubmitting(true);

        try {
            const route = generateToolLabAction();
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');
            const xsrfToken = document.cookie
                .split('; ')
                .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await fetch(route.url, {
                method: route.method.toUpperCase(),
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                    ...(xsrfToken
                        ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }
                        : {}),
                },
                body: JSON.stringify({
                    prompt: trimmedPrompt,
                    audience,
                    goal,
                }),
            });

            const payload = (await response.json()) as ToolLabResponse | ErrorPayload;

            if (!response.ok) {
                const errorPayload = payload as ErrorPayload;
                const promptError = Array.isArray(errorPayload.errors?.prompt)
                    ? errorPayload.errors.prompt[0]
                    : null;

                setErrorMessage(
                    promptError ??
                        errorPayload.message ??
                        'Tool execution failed. Please try again.',
                );

                return;
            }

            setResult((payload as ToolLabResponse).data);
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
            <Head title="Tool Lab" />

            <AppLayout>
                <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <header className="border-b border-[#d5dbd7] pb-6 dark:border-[#222b27]">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                                <div className="space-y-3">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                        Tool Execution
                                    </p>
                                    <h1 className="font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl lg:text-5xl">
                                        Tool Lab
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Run a Groq-backed agent with deterministic Laravel AI tools. Tailor the audience, pick the conversion goal, and inspect the tool calls that shaped the final answer.
                                    </p>
                                </div>

                                {/* <div className="border border-[#d5dbd7] bg-[#f5e4da] p-5 dark:border-[#222b27] dark:bg-[#141a17]">
                                    <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                        Available Tools
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        These deterministic helpers give the model fixed guidance it can reuse while composing the final response.
                                    </p>
                                    <ul className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                            <span>`audience_snapshot` for deterministic audience guidance</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                            <span>`call_to_action` for deterministic conversion framing</span>
                                        </li>
                                    </ul>
                                </div> */}
                            </div>
                        </header>

                        <main className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                            <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <label className="block">
                                        <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                            Copy Request
                                        </span>
                                        <textarea
                                            name="prompt"
                                            value={prompt}
                                            onChange={(event) => setPrompt(event.target.value)}
                                            rows={10}
                                            placeholder="Write a homepage blurb for a developer-focused launch..."
                                            className="min-h-56 w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-4 text-sm leading-relaxed text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        />
                                    </label>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                Audience Lens
                                            </span>
                                            <select
                                                value={audience}
                                                onChange={(event) =>
                                                    setAudience(event.target.value as AudienceOption)
                                                }
                                                className="mt-3 w-full border border-[#d5dbd7] bg-[#eedcd2] px-2 py-2 font-mono text-xs text-[#1a2620] outline-none focus:border-[#5c7368] dark:border-[#222b27] dark:bg-[#141a17] dark:text-[#e5eae6]"
                                            >
                                                {audienceOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                {selectedAudience.description}
                                            </p>
                                        </label>

                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                Conversion Goal
                                            </span>
                                            <select
                                                value={goal}
                                                onChange={(event) =>
                                                    setGoal(event.target.value as GoalOption)
                                                }
                                                className="mt-3 w-full border border-[#d5dbd7] bg-[#eedcd2] px-2 py-2 font-mono text-xs text-[#1a2620] outline-none focus:border-[#5c7368] dark:border-[#222b27] dark:bg-[#141a17] dark:text-[#e5eae6]"
                                            >
                                                {goalOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                {selectedGoal.description}
                                            </p>
                                        </label>
                                    </div>

                                    {errorMessage ? (
                                        <div className="border border-[#c2410c]/20 bg-[#c2410c]/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#e95e26]">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-4 border-t border-[#d5dbd7] pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#222b27]">
                                        <div className="flex flex-wrap gap-4 font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                            <span>{trimmedPrompt === '' ? 0 : trimmedPrompt.split(/\s+/).length} words</span>
                                            <span>/</span>
                                            <span>Provider: Groq</span>
                                            <span>/</span>
                                            <span>Mode: tools</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Running tools...' : 'Run Tool Lab'}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <div className="flex items-center justify-between border-b border-[#d5dbd7] pb-3 dark:border-[#222b27]">
                                        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                            Final Answer
                                        </h2>
                                        <span className="border border-[#d5dbd7] bg-[#f5e4da] px-2 py-0.5 font-mono text-[9px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                                            {result?.settings.provider ?? 'groq'}
                                        </span>
                                    </div>
                                    {/* <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        This panel shows the polished response after the agent has finished using any relevant tools.
                                    </p> */}

                                    {result ? (
                                        <div className="mt-4 space-y-4">
                                            <div className="border border-[#d5dbd7] bg-[#f5e4da]/50 p-4 dark:border-[#222b27] dark:bg-[#151c19]/50">
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Response
                                                </p>
                                                <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                                    {result.answer}
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Audience</p>
                                                    {/* <p className="mt-2 text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                        The selected reader segment that shaped the tone and priorities of the answer.
                                                    </p> */}
                                                    <p className="mt-1 capitalize text-[#1a2620] dark:text-[#e5eae6]">{result.settings.audience}</p>
                                                </div>
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Goal</p>
                                                    {/* <p className="mt-2 text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                        The conversion objective the final copy is trying to support.
                                                    </p> */}
                                                    <p className="mt-1 capitalize text-[#1a2620] dark:text-[#e5eae6]">{result.settings.goal}</p>
                                                </div>
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27] sm:col-span-2">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Model Route</p>
                                                    {/* <p className="mt-2 text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                        The exact Groq-routed model used for the current run.
                                                    </p> */}
                                                    <p className="mt-1 break-all text-[#1a2620] dark:text-[#e5eae6]">{result.settings.model}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-4 font-serif italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                            Submit a copy request to inspect the tool-assisted answer and diagnostics.
                                        </p>
                                    )}
                                </section>

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Tool Diagnostics
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        These records expose what the agent asked the tools to do and what each tool returned.
                                    </p>

                                    {result ? (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Calls
                                                </p>
                                                <p className="mt-2 text-xs leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                    Input arguments passed by the model when it invoked a tool.
                                                </p>
                                                <div className="mt-2 space-y-2">
                                                    {result.tool_calls.length > 0 ? (
                                                        result.tool_calls.map((toolCall) => (
                                                            <div
                                                                key={toolCall.id}
                                                                className="border border-[#d5dbd7] bg-[#f5e4da]/40 p-3 font-mono text-[11px] dark:border-[#222b27] dark:bg-[#151c19]/40"
                                                            >
                                                                <p className="font-semibold text-[#1a2620] dark:text-[#e5eae6]">
                                                                    {toolCall.name}
                                                                </p>
                                                                <pre className="mt-2 whitespace-pre-wrap text-[#607267] dark:text-[#7fa08d]">
                                                                    {JSON.stringify(toolCall.arguments, null, 2)}
                                                                </pre>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="font-serif italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                                            No tool calls were recorded for this run.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Results
                                                </p>
                                                <p className="mt-2 text-xs leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                    Deterministic output returned by the tool and made available to the model.
                                                </p>
                                                <div className="mt-2 space-y-2">
                                                    {result.tool_results.length > 0 ? (
                                                        result.tool_results.map((toolResult) => (
                                                            <div
                                                                key={toolResult.id}
                                                                className="border border-[#d5dbd7] bg-[#f5e4da]/40 p-3 font-mono text-[11px] dark:border-[#222b27] dark:bg-[#151c19]/40"
                                                            >
                                                                <p className="font-semibold text-[#1a2620] dark:text-[#e5eae6]">
                                                                    {toolResult.name}
                                                                </p>
                                                                <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                                    {toolResult.result}
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="font-serif italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                                            Tool output will appear here after execution.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-4 font-serif italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                            Diagnostics stay empty until the agent executes one or more tools.
                                        </p>
                                    )}
                                </section>

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                        Switch workspace
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Use these shortcuts to rerun the tool demo cleanly or jump into adjacent labs.
                                    </p>
                                    <div className="mt-4 grid gap-3 font-mono text-xs">
                                        <Link
                                            href={toolLab.url()}
                                            className="border border-[#1a2620] bg-[#1a2620] px-4 py-3 text-center uppercase tracking-wider text-[#f4f6f3] dark:border-[#e5eae6] dark:bg-[#e5eae6] dark:text-[#101412]"
                                        >
                                            Reset Tool Lab
                                        </Link>
                                        <Link
                                            href={promptPlayground.url()}
                                            className="border border-[#d5dbd7] px-4 py-3 text-center uppercase tracking-wider text-[#607267] hover:border-[#1a2620] dark:border-[#222b27] dark:text-[#7fa08d] dark:hover:border-[#e5eae6]"
                                        >
                                            Prompt Playground
                                        </Link>
                                        <Link
                                            href={streamingLab.url()}
                                            className="border border-[#d5dbd7] px-4 py-3 text-center uppercase tracking-wider text-[#607267] hover:border-[#1a2620] dark:border-[#222b27] dark:text-[#7fa08d] dark:hover:border-[#e5eae6]"
                                        >
                                            Streaming Lab
                                        </Link>
                                    </div>
                                </section>
                            </aside>
                        </main>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
