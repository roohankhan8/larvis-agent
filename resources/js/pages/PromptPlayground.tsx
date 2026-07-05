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
    const [prompt, setPrompt] = useState(
        'Write a sharp product announcement for a new AI content workflow that helps small teams ship polished copy faster.',
    );
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
                <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <header className="border-b border-[#d5dbd7] pb-6 dark:border-[#222b27]">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                                <div className="space-y-3">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                        Tuning Console
                                    </p>
                                    <h1 className="font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl lg:text-5xl">
                                        Prompt Playground
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        Execute raw text generation using the Laravel AI SDK. Adjust tone parameters, sampling controls, and model profile selection to examine output shifts.
                                    </p>
                                </div>

                                {/* <div className="border border-[#d5dbd7] bg-[#f5e4da] p-5 dark:border-[#222b27] dark:bg-[#141a17]">
                                    <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                        Playground Architecture
                                    </h3>
                                    <ul className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                            <span>SDK Promptable Interface</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                            <span>Dynamic Model Routing</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1 w-1 bg-[#1a2620] dark:bg-[#e5eae6]" />
                                            <span>Temperature & Top-p tuning</span>
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
                                            Prompt Input
                                        </span>
                                        <textarea
                                            name="prompt"
                                            value={prompt}
                                            onChange={(event) => setPrompt(event.target.value)}
                                            rows={12}
                                            placeholder="Enter generation prompts (minimum 10 characters)..."
                                            className="min-h-64 w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-4 text-sm leading-relaxed text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        />
                                    </label>

                                    <div className="grid grid-cols-3 gap-4">
                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                Tone Profile
                                            </span>
                                            <select
                                                value={tone}
                                                onChange={(event) => setTone(event.target.value as ToneOption)}
                                                className="mt-3 w-full border border-[#d5dbd7] bg-[#eedcd2] px-2 py-2 font-mono text-xs text-[#1a2620] outline-none focus:border-[#5c7368] dark:border-[#222b27] dark:bg-[#141a17] dark:text-[#e5eae6]"
                                            >
                                                {toneOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                Length Constraint
                                            </span>
                                            <select
                                                value={length}
                                                onChange={(event) => setLength(event.target.value as LengthOption)}
                                                className="mt-3 w-full border border-[#d5dbd7] bg-[#eedcd2] px-2 py-2 font-mono text-xs text-[#1a2620] outline-none focus:border-[#5c7368] dark:border-[#222b27] dark:bg-[#141a17] dark:text-[#e5eae6]"
                                            >
                                                {lengthOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                Model Profile
                                            </span>
                                            <select
                                                value={modelProfile}
                                                onChange={(event) => setModelProfile(event.target.value as ModelProfile)}
                                                className="mt-3 w-full border border-[#d5dbd7] bg-[#eedcd2] px-2 py-2 font-mono text-xs text-[#1a2620] outline-none focus:border-[#5c7368] dark:border-[#222b27] dark:bg-[#141a17] dark:text-[#e5eae6]"
                                            >
                                                {modelOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                {selectedModel.description}
                                            </p>
                                            <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                Model profile decides how heavy the selected Groq-routed model should be. Lighter profiles are faster for exploration, while deeper profiles are better for richer output.
                                            </p>
                                        </label>

                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                <span>Temperature</span>
                                                <span className="font-bold text-[#1a2620] dark:text-[#e5eae6]">{temperature.toFixed(2)}</span>
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={temperature}
                                                onChange={(event) => setTemperature(Number(event.target.value))}
                                                className="mt-4 w-full accent-[#1a2620] dark:accent-[#e5eae6]"
                                            />
                                            <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                Lower temperature keeps responses tighter and more predictable. Higher temperature allows more variation and creative phrasing.
                                            </p>
                                        </label>

                                        <label className="block border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                <span>Top-p</span>
                                                <span className="font-bold text-[#1a2620] dark:text-[#e5eae6]">{topP.toFixed(2)}</span>
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={topP}
                                                onChange={(event) => setTopP(Number(event.target.value))}
                                                className="mt-4 w-full accent-[#1a2620] dark:accent-[#e5eae6]"
                                            />
                                            <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                Top-p limits the pool of likely next words. Lower values make the model stay closer to the safest choices, while higher values allow broader exploration.
                                            </p>
                                        </label>

                                        <div className="border border-[#d5dbd7] bg-[#f5e4da] p-4 dark:border-[#222b27] dark:bg-[#151c19]">
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">
                                                Provider Route
                                            </span>
                                            <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                                Groq Only
                                            </p>
                                            <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                                This lab stays on one provider so changes in tone, model profile, temperature, and top-p are easier to compare.
                                            </p>
                                        </div>
                                    </div>

                                    {errorMessage ? (
                                        <div className="border border-[#c2410c]/20 bg-[#c2410c]/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#e95e26]">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-4 border-t border-[#d5dbd7] pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#222b27]">
                                        <div className="flex flex-wrap gap-4 font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                            <span>{wordCount} words</span>
                                            <span>/</span>
                                            <span>{characterCount} chars</span>
                                            <span>/</span>
                                            <span>Provider: Groq</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider"
                                        >
                                            {isSubmitting ? 'Generating...' : 'Generate answer'}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <aside className="space-y-6">
                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <div className="flex items-center justify-between border-b border-[#d5dbd7] pb-3 dark:border-[#222b27]">
                                        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                            Raw Response
                                        </h2>
                                        {/* <span className="border border-[#d5dbd7] bg-[#f5e4da] px-2 py-0.5 font-mono text-[9px] uppercase text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]">
                                            {result?.settings.provider ?? 'groq'}
                                        </span> */}
                                    </div>

                                    {result ? (
                                        <div className="mt-4 space-y-4">
                                            <div className="border border-[#d5dbd7] bg-[#f5e4da]/50 p-4 dark:border-[#222b27] dark:bg-[#151c19]/50">
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                                    Answer
                                                </p>
                                                <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                                                    {result.answer}
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Model Route</p>
                                                    <p className="mt-1 font-bold text-[#1a2620] dark:text-[#e5eae6] break-all">{result.settings.model}</p>
                                                </div>
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Parameters</p>
                                                    <p className="mt-1 text-[#1a2620] dark:text-[#e5eae6]">T {result.settings.temperature.toFixed(2)} / P {result.settings.top_p.toFixed(2)}</p>
                                                </div>
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Tone Settings</p>
                                                    <p className="mt-1 capitalize text-[#1a2620] dark:text-[#e5eae6]">{result.settings.tone}</p>
                                                </div>
                                                <div className="border border-[#d5dbd7] p-3 font-mono text-xs dark:border-[#222b27]">
                                                    <p className="text-[9px] uppercase tracking-wider text-[#607267] dark:text-[#7fa08d]">Length Type</p>
                                                    <p className="mt-1 capitalize text-[#1a2620] dark:text-[#e5eae6]">{result.settings.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-4 font-serif italic text-sm text-[#607267] dark:text-[#7fa08d]">
                                            Enter your prompt copy and click generate to process the response.
                                        </p>
                                    )}
                                </section>

                                <section className="paper-sheet p-6 dark:bg-[#141a17]">
                                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#607267] dark:text-[#7fa08d]">
                                        Next steps
                                    </p>
                                    <div className="mt-4 grid gap-3 font-mono text-xs">
                                        <Link
                                            href={analyzeContent.url()}
                                            className="border border-[#dfdbd5] px-4 py-3 text-center uppercase tracking-wider text-[#656a70] hover:border-[#1c1e20] dark:border-[#2c2e30] dark:text-[#93989e] dark:hover:border-[#e3e4e6]"
                                        >
                                            Content Analyzer &rarr;
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
