import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        if (!firstName.trim()) {
          throw new Error('Please enter your first name.');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
            },
          },
        });

        if (error) throw error;

        if (!data.session) {
          setMessage(
            'Account created. Please check your email to confirm your account.'
          );
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900 px-4 font-sans text-dark-50">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
             <img
                src="/favicon.png"
                alt="Outlay"
                className="mb-4 h-16 w-16 rounded-2xl object-cover"
                />
            <h1 className="text-3xl font-extrabold tracking-tight text-dark-50">
                Outlay
            </h1>

          <p className="mt-2 text-sm text-dark-300">
            Simple Spending. Smarter Insights.
          </p>
        </div>

        <div className="rounded-2xl border border-dark-600/50 bg-dark-800/70 p-6 shadow-xl shadow-black/10 backdrop-blur-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-dark-50">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>

            <p className="mt-1 text-sm text-dark-300">
              {mode === 'login'
                ? 'Sign in to manage your expenses.'
                : 'Start managing your spending with Outlay.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-200">
                  First name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Priyanshu"
                  required
                  className="w-full rounded-xl border border-dark-600 bg-dark-900 px-4 py-3 text-sm text-dark-50 outline-none transition placeholder:text-dark-400 focus:border-accent-primary"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-200">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-dark-600 bg-dark-900 px-4 py-3 text-sm text-dark-50 outline-none transition placeholder:text-dark-400 focus:border-accent-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-200">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-dark-600 bg-dark-900 px-4 py-3 text-sm text-dark-50 outline-none transition placeholder:text-dark-400 focus:border-accent-primary"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-accent-primary/20 bg-accent-primary/10 px-4 py-3 text-sm text-accent-primary">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-dark-300">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setMessage('');
                  }}
                  className="font-semibold text-accent-primary hover:text-accent-hover"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setMessage('');
                  }}
                  className="font-semibold text-accent-primary hover:text-accent-hover"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}