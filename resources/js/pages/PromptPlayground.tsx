import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { generate as generatePromptAction } from '@/actions/App/Http/Controllers/PromptPlaygroundController';
import AppLayout from '@/layouts/AppLayout';
import { analyzeContent, promptPlayground } from '@/routes';

type PromptPlaygroundProps = {
    defaults: {
        tone: ToneOption;
        length: LengthOption;
        temperature: number;
        top_p: number;
        model_profile: ModelProfile;
    };
    modelOptions: Array<{
        value: ModelProfile;
        label: string;
        description: string;
        model: string | null;
    }>;
};

type ToneOption = 'neutral' | 'concise' | 'persuasive' | 'playful';
type LengthOption = 'brief' | 'standard' | 'detailed';
type ModelProfile = 'default' | 'draft' | 'deep';

type PromptResponse = {
    status: string;
    data: {
        prompt: string;
        answer: string;
        settings: {
            provider: string;
            tone: ToneOption;
            length: LengthOption;
            temperature: number;
            top_p: number;
            model_profile: ModelProfile;
            model: string;
        };
    };
};

type ErrorPayload = {
    message?: string;
    errors?: Record<string, string[]>;
};

const toneOptions: Array<{ value: ToneOption; label: string }> = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'concise', label: 'Concise' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'playful', label: 'Playful' },
];

const lengthOptions: Array<{ value: LengthOption; label: string }> = [
    { value: 'brief', label: 'Brief' },
    { value: 'standard', label: 'Standard' },
    { value: 'detailed', label: 'Detailed' },
];

export default function PromptPlayground({
    defaults,
    modelOptions,
}: PromptPlaygroundProps) {
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState<ToneOption>(defaults.tone);
    const [length, setLength] = useState<LengthOption>(defaults.length);
    const [temperature, setTemperature] = useState(defaults.temperature);
    const [topP, setTopP] = useState(defaults.top_p);
    const [modelProfile, setModelProfile] = useState<ModelProfile>(
        defaults.model_profile,
    );
    const [result, setResult] = useState<PromptResponse['data'] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const trimmedPrompt = prompt.trim();
    const wordCount =
        trimmedPrompt === '' ? 0 : trimmedPrompt.split(/\s+/).length;
    const characterCount = prompt.length;
    const selectedModel =
        modelOptions.find((option) => option.value === modelProfile) ??
        modelOptions[0];

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage(null);
        setResult(null);

        if (trimmedPrompt.length < 10) {
            setErrorMessage('Enter at least 10 characters before generating.');

            return;
        }

        setIsSubmitting(true);

        try {
            const route = generatePromptAction();
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
                    prompt: trimmedPrompt,
                    tone,
                    length,
                    temperature,
                    top_p: topP,
                    model_profile: modelProfile,
                }),
            });

            const payload = (await response.json()) as PromptResponse | ErrorPayload;

            if (!response.ok) {
                const errorPayload = payload as ErrorPayload;
                const promptError = Array.isArray(errorPayload.errors?.prompt)
                    ? errorPayload.errors.prompt[0]
                    : null;

                setErrorMessage(
                    promptError ??
                        errorPayload.message ??
                        'Generation failed. Please try again.',
                );

                return;
            }

            setResult((payload as PromptResponse).data);
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
            <Head title="Prompt Playground" />

            <AppLayout>
                <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_18%),linear-gradient(180deg,_#1c1917_0%,_#0f172a_45%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <header className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_32px_120px_rgba(2,6,23,0.32)] backdrop-blur lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                            <div className="space-y-4">
                                <p className="text-sm font-medium tracking-[0.3em] text-amber-200/85 uppercase">
                                    Groq text lab
                                </p>
                                <div className="space-y-3">
                                    <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                        Prompt Playground
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                        Try direct text generation with a Groq-backed
                                        agent, then change tone, response length,
                                        model profile, temperature, and top-p to see
                                        how the answer shifts.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-amber-300/15 bg-slate-950/55 p-5">
                                <p className="text-xs font-semibold tracking-[0.24em] text-amber-200/80 uppercase">
                                    What this page teaches
                                </p>
                                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                    <li>`Promptable` for direct agent prompting</li>
                                    <li>Groq-only provider selection</li>
                                    <li>Model selection through Wayfinder-backed requests</li>
                                    <li>Response tuning with temperature and top-p</li>
                                </ul>
                            </div>
                        </header>

                        <main className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                            <section className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-slate-200">
                                            Prompt
                                        </span>
                                        <textarea
                                            name="prompt"
                                            value={prompt}
                                            onChange={(event) =>
                                                setPrompt(event.target.value)
                                            }
                                            rows={12}
                                            placeholder="Ask for a launch tagline, a product description, a summary, or any other text-generation prompt..."
                                            className="min-h-64 w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/45 focus:bg-white/[0.07] focus:ring-4 focus:ring-amber-300/10"
                                        />
                                    </label>

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <label className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                            <span className="text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase">
                                                Tone
                                            </span>
                                            <select
                                                value={tone}
                                                onChange={(event) =>
                                                    setTone(
                                                        event.target
                                                            .value as ToneOption,
                                                    )
                                                }
                                                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none focus:border-amber-300/45"
                                            >
                                                {toneOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                            <span className="text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase">
                                                Length
                                            </span>
                                            <select
                                                value={length}
                                                onChange={(event) =>
                                                    setLength(
                                                        event.target
                                                            .value as LengthOption,
                                                    )
                                                }
                                                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none focus:border-amber-300/45"
                                            >
                                                {lengthOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 md:col-span-2">
                                            <span className="text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase">
                                                Model profile
                                            </span>
                                            <select
                                                value={modelProfile}
                                                onChange={(event) =>
                                                    setModelProfile(
                                                        event.target
                                                            .value as ModelProfile,
                                                    )
                                                }
                                                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none focus:border-amber-300/45"
                                            >
                                                {modelOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                                {selectedModel.description}
                                            </p>
                                        </label>

                                        <label className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                            <span className="flex items-center justify-between text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase">
                                                <span>Temperature</span>
                                                <span>{temperature.toFixed(2)}</span>
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={temperature}
                                                onChange={(event) =>
                                                    setTemperature(
                                                        Number(event.target.value),
                                                    )
                                                }
                                                className="mt-4 w-full accent-amber-300"
                                            />
                                        </label>

                                        <label className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                            <span className="flex items-center justify-between text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase">
                                                <span>Top-p</span>
                                                <span>{topP.toFixed(2)}</span>
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={topP}
                                                onChange={(event) =>
                                                    setTopP(
                                                        Number(event.target.value),
                                                    )
                                                }
                                                className="mt-4 w-full accent-amber-300"
                                            />
                                        </label>
                                    </div>

                                    {errorMessage ? (
                                        <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <span>{wordCount} words</span>
                                            <span>{characterCount} characters</span>
                                            <span>Provider: Groq</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex h-12 items-center justify-center rounded-full bg-amber-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {isSubmitting
                                                ? 'Generating...'
                                                : 'Generate answer'}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300/10 via-white/5 to-orange-300/10 p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="text-lg font-semibold text-white">
                                            Raw answer
                                        </h2>
                                        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">
                                            {result?.settings.provider ?? 'groq'}
                                        </span>
                                    </div>

                                    {result ? (
                                        <div className="mt-4 space-y-4">
                                            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
                                                <p className="text-xs tracking-[0.24em] text-amber-200/80 uppercase">
                                                    Answer
                                                </p>
                                                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100">
                                                    {result.answer}
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                                                    <p className="text-xs tracking-[0.2em] text-amber-200/80 uppercase">
                                                        Model
                                                    </p>
                                                    <p className="mt-2 break-all text-white">
                                                        {result.settings.model}
                                                    </p>
                                                </div>
                                                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                                                    <p className="text-xs tracking-[0.2em] text-amber-200/80 uppercase">
                                                        Tuning
                                                    </p>
                                                    <p className="mt-2 text-white">
                                                        Temp {result.settings.temperature.toFixed(2)}
                                                        {' · '}
                                                        Top-p {result.settings.top_p.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                                                    <p className="text-xs tracking-[0.2em] text-amber-200/80 uppercase">
                                                        Tone
                                                    </p>
                                                    <p className="mt-2 capitalize text-white">
                                                        {result.settings.tone}
                                                    </p>
                                                </div>
                                                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                                                    <p className="text-xs tracking-[0.2em] text-amber-200/80 uppercase">
                                                        Length
                                                    </p>
                                                    <p className="mt-2 capitalize text-white">
                                                        {result.settings.length}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-sm leading-7 text-slate-300">
                                            Submit a prompt to see the direct response
                                            and the exact Groq settings used for that
                                            generation.
                                        </p>
                                    )}
                                </section>

                                <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6">
                                    <p className="text-xs font-semibold tracking-[0.24em] text-slate-300 uppercase">
                                        Next steps
                                    </p>
                                    <div className="mt-4 grid gap-3">
                                        <Link
                                            href={promptPlayground.url()}
                                            className="rounded-[1.25rem] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-300/15"
                                        >
                                            Stay in the prompt lab
                                        </Link>
                                        <Link
                                            href={analyzeContent.url()}
                                            className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-amber-300/20 hover:bg-white/8"
                                        >
                                            Compare with structured analysis
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
