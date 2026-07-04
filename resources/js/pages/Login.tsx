import { Head, Link, useForm } from '@inertiajs/react';
import { storeLogin } from '@/actions/App/Http/Controllers/AuthController';
import AppLayout from '@/layouts/AppLayout';
import { home, register as registerRoute } from '@/routes';

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
                <div className="editorial-grid min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
                        <section className="paper-sheet flex flex-col justify-between p-6 sm:p-8 dark:bg-[#141a17]">
                            <div className="space-y-6">
                                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                    Identity Workspace
                                </p>
                                <h1 className="font-serif text-3xl font-light text-[#1a2620] dark:text-[#e5eae6] sm:text-4xl">
                                    Authenticate your account to preserve <span className="italic font-normal">lab sessions</span>.
                                </h1>
                                <p className="text-sm leading-relaxed text-[#607267] dark:text-[#7fa08d]">
                                    Device session data collected while anonymous is automatically linked to your authenticated user profile, consolidating your workspace history, parameter preferences, and transcript trails.
                                </p>
                            </div>

                            <div className="my-8 grid gap-4 sm:grid-cols-3">
                                {[
                                    'Session-aware device sync',
                                    'Persistent transcript history',
                                    'Unlocks comprehensive lab access',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="border border-[#d5dbd7] bg-[#f5e4da] p-4 font-mono text-xs text-[#607267] dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#7fa08d]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4 border-t border-[#d5dbd7] pt-6 dark:border-[#222b27]">
                                <Link
                                    href={registerRoute.url()}
                                    prefetch
                                    className="btn-editorial-primary px-6 py-2.5 font-mono text-xs uppercase tracking-wider"
                                >
                                    Create Account
                                </Link>
                                <Link
                                    href={home()}
                                    prefetch
                                    className="btn-editorial-secondary px-6 py-2.5 font-mono text-xs uppercase tracking-wider"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </section>

                        <section className="paper-sheet p-6 sm:p-8 dark:bg-[#141a17] flex flex-col justify-center">
                            <div className="space-y-2 border-b border-[#d5dbd7] pb-4 dark:border-[#222b27]">
                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#607267] dark:text-[#7fa08d]">
                                    Welcome Back
                                </p>
                                <h2 className="font-serif text-2xl font-bold text-[#1a2620] dark:text-[#e5eae6]">
                                    Login
                                </h2>
                            </div>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <label className="block">
                                    <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Email
                                    </span>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData('email', event.target.value)
                                        }
                                        className="mt-2 w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        placeholder="name@domain.com"
                                        autoComplete="email"
                                    />
                                    {form.errors.email ? (
                                        <p className="mt-2 font-mono text-xs text-[#c2410c]">
                                            {form.errors.email}
                                        </p>
                                    ) : null}
                                </label>

                                <label className="block">
                                    <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#1a2620] dark:text-[#e5eae6]">
                                        Password
                                    </span>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(event) =>
                                            form.setData('password', event.target.value)
                                        }
                                        className="mt-2 w-full border border-[#d5dbd7] bg-[#eedcd2] px-4 py-3 text-sm text-[#1a2620] outline-none dark:border-[#222b27] dark:bg-[#151c19] dark:text-[#e5eae6]"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    {form.errors.password ? (
                                        <p className="mt-2 font-mono text-xs text-[#c2410c]">
                                            {form.errors.password}
                                        </p>
                                    ) : null}
                                </label>

                                <label className="flex items-center gap-3 font-mono text-xs text-[#607267] dark:text-[#7fa08d] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(event) =>
                                            form.setData('remember', event.target.checked)
                                        }
                                        className="h-4 w-4 border-[#d5dbd7] text-[#1a2620] accent-[#1a2620] dark:border-[#222b27] dark:accent-[#e5eae6]"
                                    />
                                    Remember session
                                </label>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="btn-editorial-primary w-full py-3 font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing ? 'Verifying...' : 'Sign In'}
                                </button>
                            </form>

                            <p className="mt-6 font-mono text-xs text-[#607267] dark:text-[#7fa08d]">
                                No account register?{' '}
                                <Link
                                    href={registerRoute.url()}
                                    prefetch
                                    className="font-bold text-[#1a2620] dark:text-[#e5eae6] hover:underline"
                                >
                                    Register here
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
