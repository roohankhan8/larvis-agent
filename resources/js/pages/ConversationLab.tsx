import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { respond as respondConversationAction } from '@/actions/App/Http/Controllers/ConversationLabController';
import AppLayout from '@/layouts/AppLayout';
import { conversationLab, promptPlayground } from '@/routes';

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
    participant,
    conversation,
}: ConversationLabProps) {
    const [message, setMessage] = useState('');
    const [conversationId, setConversationId] = useState(
        conversation?.id ?? '',
    );
    const [messages, setMessages] = useState<ConversationMessage[]>(
        conversation?.messages ?? [],
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const transcriptLength = messages.length;
    const latestAssistantReply = useMemo(
        () =>
            [...messages].reverse().find((entry) => entry.role === 'assistant')
                ?.content ?? null,
        [messages],
    );

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

            const response = await fetch(route.url, {
                method: route.method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({
                    message: trimmedMessage,
                    conversation_id: conversationId || null,
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
                <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.18),_transparent_18%),linear-gradient(180deg,_#052e2b_0%,_#0f172a_42%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <header className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_32px_120px_rgba(2,6,23,0.32)] backdrop-blur lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                            <div className="space-y-4">
                                <p className="text-sm font-medium tracking-[0.3em] text-emerald-200/85 uppercase">
                                    Groq conversation lab
                                </p>
                                <div className="space-y-3">
                                    <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                        Conversation Lab
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                        Keep one conversation alive across follow-up
                                        questions. The same conversation ID is
                                        reused so the agent can remember the prior
                                        turns and the database keeps the full trail.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-emerald-300/15 bg-slate-950/55 p-5">
                                <p className="text-xs font-semibold tracking-[0.24em] text-emerald-200/80 uppercase">
                                    Participant
                                </p>
                                <div className="mt-4 space-y-3 text-sm text-slate-300">
                                    <p>
                                        Current user:{' '}
                                        <span className="text-white">
                                            {participant.name}
                                        </span>
                                    </p>
                                    <p>
                                        Conversation ID:{' '}
                                        <span className="break-all text-white">
                                            {conversationId || 'New conversation'}
                                        </span>
                                    </p>
                                    <p>
                                        Turns in transcript:{' '}
                                        <span className="text-white">
                                            {transcriptLength}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </header>

                        <main className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                            <section className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                                <div className="mb-6 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.24em] text-emerald-200/80 uppercase">
                                            Transcript
                                        </p>
                                        <h2 className="mt-1 text-lg font-semibold text-white">
                                            Follow-up questions and replies
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {messages.length > 0 ? (
                                        messages.map((entry, index) => (
                                            <div
                                                key={`${entry.role}-${index}-${entry.content.slice(0, 24)}`}
                                                className={`flex ${
                                                    entry.role === 'user'
                                                        ? 'justify-end'
                                                        : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 ${
                                                        entry.role === 'user'
                                                            ? 'bg-emerald-300 text-slate-950'
                                                            : 'border border-white/10 bg-white/5 text-slate-100'
                                                    }`}
                                                >
                                                    <p className="mb-1 text-[0.65rem] font-semibold tracking-[0.24em] uppercase opacity-80">
                                                        {entry.role}
                                                    </p>
                                                    <p className="whitespace-pre-wrap">
                                                        {entry.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm leading-7 text-slate-300">
                                            Start a conversation and the lab will keep
                                            the full history in the AI SDK tables.
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-slate-200">
                                            Your message
                                        </span>
                                        <textarea
                                            value={message}
                                            onChange={(event) =>
                                                setMessage(event.target.value)
                                            }
                                            rows={5}
                                            placeholder="Ask a follow-up question, refine the answer, or shift the topic while keeping the same thread..."
                                            className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/45 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-300/10"
                                        />
                                    </label>

                                    {errorMessage ? (
                                        <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <span>{transcriptLength} messages</span>
                                            <span>
                                                Last reply:{' '}
                                                {latestAssistantReply ? 'ready' : 'none yet'}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {isSubmitting
                                                ? 'Sending...'
                                                : 'Send message'}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-300/10 via-white/5 to-teal-300/10 p-6">
                                    <h2 className="text-lg font-semibold text-white">
                                        Conversation state
                                    </h2>
                                    <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                                        <p>
                                            This lab reuses the conversation ID on each
                                            turn so the agent gets the previous
                                            messages back from the database.
                                        </p>
                                        <p>
                                            Refreshing the page loads the latest
                                            conversation for the current user if one
                                            exists.
                                        </p>
                                    </div>
                                </section>

                                <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6">
                                    <p className="text-xs font-semibold tracking-[0.24em] text-slate-300 uppercase">
                                        Next steps
                                    </p>
                                    <div className="mt-4 grid gap-3">
                                        <Link
                                            href={conversationLab.url()}
                                            className="rounded-[1.25rem] border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-300/15"
                                        >
                                            Stay in the conversation lab
                                        </Link>
                                        <Link
                                            href={promptPlayground.url()}
                                            className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-emerald-300/20 hover:bg-white/8"
                                        >
                                            Switch to prompt playground
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
