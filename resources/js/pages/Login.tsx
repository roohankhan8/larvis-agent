import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { home, register as registerRoute } from '@/routes';
import { storeLogin } from '@/actions/App/Http/Controllers/AuthController';

export default function Login() {
    const form = useForm('LoginForm', {
        email: '',
        password: '',
        remember: false,
    }).dontRemember('password');

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(storeLogin.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset('password'),
        });
    }

    return (
        <>
            <Head title="Login" />
            <AppLayout>
                <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),linear-gradient(180deg,_#0f172a_0%,_#020617_55%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
                    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-10">
                        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_32px_120px_rgba(2,6,23,0.35)] backdrop-blur sm:p-8">
                            <div className="space-y-4">
                                <p className="text-sm font-medium tracking-[0.3em] text-cyan-200/80 uppercase">
                                    Guest device tracking
                                </p>
                                <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    Sign in to keep your AI lab sessions tied to a real account.
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                    Device rows are created for guests, then linked to a user
                                    once they authenticate. That keeps browser data, session
                                    history, and account ownership in one place.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    'Session-aware guest tracking',
                                    'Linked account history',
                                    'Groq lab access after sign-in',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={registerRoute.url()}
                                    prefetch
                                    className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                                >
                                    Create an account
                                </Link>
                                <Link
                                    href={home()}
                                    prefetch
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                                >
                                    Back home
                                </Link>
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:p-8">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-[0.3em] text-cyan-200/70 uppercase">
                                    Welcome back
                                </p>
                                <h2 className="text-2xl font-semibold text-white">
                                    Login
                                </h2>
                            </div>

                            <form onSubmit={submit} className="mt-6 space-y-5">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-200">
                                        Email
                                    </span>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData('email', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                    {form.errors.email ? (
                                        <p className="mt-2 text-sm text-rose-200">
                                            {form.errors.email}
                                        </p>
                                    ) : null}
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-200">
                                        Password
                                    </span>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(event) =>
                                            form.setData('password', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    {form.errors.password ? (
                                        <p className="mt-2 text-sm text-rose-200">
                                            {form.errors.password}
                                        </p>
                                    ) : null}
                                </label>

                                <label className="flex items-center gap-3 text-sm text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(event) =>
                                            form.setData('remember', event.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-300"
                                    />
                                    Remember me
                                </label>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {form.processing ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>

                            <p className="mt-6 text-sm text-slate-400">
                                No account yet?{' '}
                                <Link
                                    href={registerRoute.url()}
                                    prefetch
                                    className="font-medium text-cyan-200 transition hover:text-cyan-100"
                                >
                                    Create one here
                                </Link>
                                .
                            </p>
                        </section>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
