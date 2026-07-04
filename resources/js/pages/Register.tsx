import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { home, login as loginRoute } from '@/routes';
import { storeRegister } from '@/actions/App/Http/Controllers/AuthController';

export default function Register() {
    const form = useForm('RegisterForm', {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    }).dontRemember('password', 'password_confirmation');

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(storeRegister.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Sign up" />
            <AppLayout>
                <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),_transparent_24%),linear-gradient(180deg,_#052e2b_0%,_#020617_58%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
                    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-10">
                        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_32px_120px_rgba(2,6,23,0.35)] backdrop-blur sm:p-8">
                            <div className="space-y-4">
                                <p className="text-sm font-medium tracking-[0.3em] text-emerald-200/80 uppercase">
                                    Device-backed accounts
                                </p>
                                <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    Create an account and keep the guest device record attached to your profile.
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                    When a visitor signs up, the device row collected while
                                    they were anonymous is linked to the new user so the
                                    browser history can follow the account over time.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    'Guest visit captured',
                                    'Device linked on signup',
                                    'Ready for lab usage',
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
                                    href={loginRoute.url()}
                                    prefetch
                                    className="inline-flex items-center justify-center rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
                                >
                                    Sign in instead
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

                        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur sm:p-8">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-[0.3em] text-emerald-200/70 uppercase">
                                    Start here
                                </p>
                                <h2 className="text-2xl font-semibold text-white">
                                    Sign up
                                </h2>
                            </div>

                            <form onSubmit={submit} className="mt-6 space-y-5">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-200">
                                        Name
                                    </span>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(event) =>
                                            form.setData('name', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
                                        placeholder="Your name"
                                        autoComplete="name"
                                    />
                                    {form.errors.name ? (
                                        <p className="mt-2 text-sm text-rose-200">
                                            {form.errors.name}
                                        </p>
                                    ) : null}
                                </label>

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
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
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
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    {form.errors.password ? (
                                        <p className="mt-2 text-sm text-rose-200">
                                            {form.errors.password}
                                        </p>
                                    ) : null}
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-200">
                                        Confirm password
                                    </span>
                                    <input
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(event) =>
                                            form.setData(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    {form.errors.password_confirmation ? (
                                        <p className="mt-2 text-sm text-rose-200">
                                            {form.errors.password_confirmation}
                                        </p>
                                    ) : null}
                                </label>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-emerald-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {form.processing ? 'Creating account...' : 'Create account'}
                                </button>
                            </form>

                            <p className="mt-6 text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link
                                    href={loginRoute.url()}
                                    prefetch
                                    className="font-medium text-emerald-200 transition hover:text-emerald-100"
                                >
                                    Sign in
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
