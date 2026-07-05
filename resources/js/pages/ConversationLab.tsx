import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { respond as respondConversationAction } from '@/actions/App/Http/Controllers/ConversationLabController';
import ProjectContextPanel from '@/components/ProjectContextPanel';
import AppLayout from '@/layouts/AppLayout';
import { conversationLab, promptPlayground } from '@/routes';
import type { ContentProject } from '@/types/content-project';

type ConversationMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type ConversationPayload = {
    id: string;
    title: string | null;
    messages: ConversationMessage[];
};

type ConversationLabProps = {
    project: ContentProject | null;
    participant: {
        name: string;
    };
    conversation: ConversationPayload | null;
};

type ConversationResponse = {
    status: string;
    data: {
        conversation_id: string;
        reply: string;
        messages: ConversationMessage[];
    };
};

type ErrorPayload = {
    message?: string;
    errors?: Record<string, string[]>;
};

export default function ConversationLab({
    project,
    participant,
    conversation,
}: ConversationLabProps) {
    const [message, setMessage] = useState(
        project?.current_draft
            ? `Revise this draft for clarity and stronger positioning:\n\n${project.current_draft}`
            : 'What is this lab demonstrating, and how should I test follow-up memory?',
    );
    const [conversationId, setConversationId] = useState(
        conversation?.id ?? '',
    );
    const [messages, setMessages] = useState<ConversationMessage[]>(
        conversation?.messages ?? [],
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const transcriptViewportRef = useRef<HTMLDivElement | null>(null);

    const transcriptLength = messages.length;
    const latestAssistantReply = useMemo(
        () =>
            [...messages].reverse().find((entry) => entry.role === 'assistant')
                ?.content ?? null,
        [messages],
    );

    useEffect(() => {
        const viewport = transcriptViewportRef.current;

        if (!viewport) {
            return;
        }

        viewport.scrollTop = viewport.scrollHeight;
    }, [messages]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedMessage = message.trim();
        setErrorMessage(null);

        if (trimmedMessage.length < 2) {
            setErrorMessage('Enter a question or follow-up to continue.');

            return;
        }

        setIsSubmitting(true);

        try {
            const route = respondConversationAction();
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
                    ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
                },
                body: JSON.stringify({
                    message: trimmedMessage,
                    conversation_id: conversationId || null,
                    project_id: project?.id ?? null,
                }),
            });

            const payload = (await response.json()) as
                | ConversationResponse
                | ErrorPayload;

            if (!response.ok) {
                const errorPayload = payload as ErrorPayload;
                const promptError = Array.isArray(errorPayload.errors?.message)
                    ? errorPayload.errors.message[0]
                    : null;

                setErrorMessage(
                    promptError ??
                        errorPayload.message ??
                        'Conversation request failed. Please try again.',
                );

                return;
            }

            const data = (payload as ConversationResponse).data;
            setConversationId(data.conversation_id);
            setMessages(data.messages);
            setMessage('');
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
            <Head title="Conversation Lab" />

            <AppLayout>
                <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <header className="border-b border-[#d5dbd7] pb-6 dark:border-[#222b27]">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                                <div className="space-y-3">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                        Multi-turn Lab
                                    </p>
                                    <h1 className="font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl lg:text-5xl">
                                        Conversation Lab
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Test conversation memory and state persistence. This page uses the Laravel AI SDK memory model, maintaining the message history in the database so the model can recall context across turns.
                                    </p>
                                </div>

                                {/* <div className="border border-[#d5dbd7] bg-[#f5e4da] p-5 dark:border-[#222b27] dark:bg-[#141a17]">
                                    <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                        Session Metadata
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        This card summarizes the active participant and the conversation thread currently bound to the page.
                                    </p>
                                    <table className="mt-3 w-full font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                        <tbody>
                                            <tr className="border-b border-[#d5dbd7]/60 dark:border-[#222b27]/60">
                                                <td className="py-1 uppercase text-[#607267] dark:text-[#7fa08d]">User</td>
                                                <td className="py-1 text-right text-[#1a2620] dark:text-[#e5eae6] font-semibold">{participant.name}</td>
                                            </tr>
                                            <tr className="border-b border-[#d5dbd7]/60 dark:border-[#222b27]/60">
                                                <td className="py-1 uppercase text-[#607267] dark:text-[#7fa08d]">Lab ID</td>
                                                <td className="py-1 text-right text-[#1a2620] dark:text-[#e5eae6] truncate max-w-[120px]" title={conversationId || 'New'}>
                                                    {conversationId ? conversationId.slice(0, 8) + '...' : 'New Thread'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 uppercase text-[#607267] dark:text-[#7fa08d]">Turns</td>
                                                <td className="py-1 text-right text-[#1a2620] dark:text-[#e5eae6] font-semibold">{transcriptLength}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> */}
                            </div>
                        </header>

                        <main className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                            <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                <div className="mb-6">
                                    <ProjectContextPanel project={project} currentPage="conversation" />
                                </div>
                                <h2 className="border-b border-[#d5dbd7] pb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6] dark:border-[#222b27]">
                                    Conversation Transcript
                                </h2>

                                <div
                                    ref={transcriptViewportRef}
                                    className="mt-6 flex max-h-[62vh] min-h-[24rem] flex-col gap-4 overflow-y-auto border border-[#d5dbd7] bg-[#f5e4da]/30 p-4 dark:border-[#222b27] dark:bg-[#151c19]/30"
                                >
                                    {messages.length > 0 ? (
                                        messages.map((entry, index) => (
                                            <div
                                                key={`${entry.role}-${index}-${entry.content.slice(0, 24)}`}
                                                className={`flex ${
                                                    entry.role === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[85%] border px-4 py-3 ${
                                                        entry.role === 'user'
                                                            ? 'border-[#c2410c]/20 bg-[#f5d8c7] dark:border-[#c2410c]/30 dark:bg-[#2b1912]'
                                                            : 'border-[#d5dbd7] bg-[#f4f6f3] dark:border-[#222b27] dark:bg-[#101412]'
                                                    }`}
                                                >
                                                    <p
                                                        className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                                                            entry.role === 'user'
                                                                ? 'text-[#c2410c] dark:text-[#f08a57]'
                                                                : 'text-[#15803d] dark:text-[#34d399]'
                                                        }`}
                                                    >
                                                        {entry.role === 'user' ? 'You' : 'Assistant'}
                                                    </p>
                                                    <p className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                                        {entry.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex min-h-full items-center justify-center border border-dashed border-[#d5dbd7] bg-[#f5e4da] p-6 text-center font-serif italic text-sm text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                                            Initiate a conversation thread to record transcript logs in the database.
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="mt-8 border-t border-[#d5dbd7] pt-6 dark:border-[#222b27] space-y-4">
                                    <label className="block">
                                        <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                            Your response / question
                                        </span>
                                        <textarea
                                            value={message}
                                            onChange={(event) => setMessage(event.target.value)}
                                            rows={5}
                                            placeholder="Ask a follow-up, refine the summary, or shift topics..."
                                            className="w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-4 text-sm leading-relaxed text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        />
                                    </label>

                                    {errorMessage ? (
                                        <div className="border border-[#c2410c]/20 bg-[#c2410c]/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#e95e26]">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap gap-4 font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                            <span>{transcriptLength} messages logged</span>
                                            <span>/</span>
                                            <span>Status: {latestAssistantReply ? 'idle' : 'waiting'}</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Turn'}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                {/* <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        State Persistence
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        The memory layer keeps the thread stable across requests so follow-up prompts can build on earlier turns.
                                    </p>
                                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        <p>
                                            By utilizing unique session IDs, this workspace binds multi-turn prompts back to your thread automatically.
                                        </p>
                                        <p>
                                            Refreshing the page retrieves the saved history, preventing the loss of state context.
                                        </p>
                                    </div>
                                </section> */}

                                {/* <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                        Switch workspace
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Use these actions to reset the current thread or move into another lab without guessing routes manually.
                                    </p>
                                    <div className="mt-4 grid gap-3 font-mono text-xs">
                                        <Link
                                            href={project ? `${conversationLab.url()}?project=${project.id}` : conversationLab.url()}
                                            className="border border-[#1a2620] bg-[#1a2620] px-4 py-3 text-center uppercase tracking-wider text-[#f4f6f3] dark:border-[#e5eae6] dark:bg-[#e5eae6] dark:text-[#101412]"
                                        >
                                            Reset lab session
                                        </Link>
                                        <Link
                                            href={project ? `${promptPlayground.url()}?project=${project.id}` : promptPlayground.url()}
                                            className="border border-[#d5dbd7] px-4 py-3 text-center uppercase tracking-wider text-[#607267] hover:border-[#1a2620] dark:border-[#222b27] dark:text-[#7fa08d] dark:hover:border-[#e5eae6]"
                                        >
                                            Prompt Playground
                                        </Link>
                                    </div>
                                </section> */}
                            </aside>
                        </main>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
