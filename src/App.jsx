import { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabase';
import Auth from './auth/auth';
import { ExpenseProvider } from './context/ExpenseContext';
import { useExpenseContext } from './context/UseExpenseContext';
import { useExpenseStats } from './hooks/useExpenseStats';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Filter from './components/Filter';
import Summary from './components/Summary';
import Chart from './components/Chart';
import {
  LogOut,
  UserCircle,
} from 'lucide-react';

function Dashboard({ session }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { loading, error, loadExpenses } = useExpenseContext();

  const {
    monthlyTotal,
    overallTotal,
    categoryBreakdown,
    categoryCounts,
    filteredExpenses,
  } = useExpenseStats(activeFilter);

  const firstName =
    session?.user?.user_metadata?.first_name ||
    'Account';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-dark-900 px-4 text-center text-dark-200">
        <p>{error}</p>

        <button
          onClick={loadExpenses}
          className="rounded-xl bg-accent-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-900 font-sans text-dark-200">
        Loading expenses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 font-sans text-dark-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-dark-600/40 bg-dark-900/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
              <img
                src="/favicon.png"
                alt="Outlay"
                className="h-full w-full object-cover"
                />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-dark-50">
                Outlay - Spend Smart
              </h1>

              <p className="text-xs text-dark-300">
                Simple Spending. Smarter Insights.
              </p>
            </div>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Open account menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full px-2 py-1.5 text-dark-100 transition hover:bg-dark-800"
            >
              <UserCircle className="h-7 w-7 text-dark-200" />

              <span className="max-w-32 truncate text-sm font-semibold">
                {firstName}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-dark-600/60 bg-dark-800 shadow-2xl shadow-black/30">

                {/* Account */}
                <div className="border-b border-dark-600/50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary/15">
                      <UserCircle className="h-6 w-6 text-accent-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark-50">
                        {firstName}
                      </p>

                      <p className="truncate text-xs text-dark-300">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* Left Column — Form + Filter + List */}
          <div className="flex flex-col gap-5">
            <ExpenseForm />

            <Filter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              categoryCounts={categoryCounts}
            />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-dark-100">
                  Expenses

                  <span className="ml-2 text-xs font-normal text-dark-300">
                    ({filteredExpenses.length})
                  </span>
                </h2>
              </div>

              <ExpenseList filteredExpenses={filteredExpenses} />
            </div>
          </div>

          {/* Right Column — Summary + Chart */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-[73px] lg:self-start">
            <Summary
              monthlyTotal={monthlyTotal}
              overallTotal={overallTotal}
              categoryBreakdown={categoryBreakdown}
            />

            <Chart categoryBreakdown={categoryBreakdown} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-600/30 py-6 text-center text-xs text-dark-400">
        Outlay · Personal Expense Management | 2026
      </footer>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (!currentSession) {
          setSession(null);
          setCheckingSession(false);
          return;
        }

        /*
         * Make sure Supabase has a current access token before
         * mounting the expense provider.
         */
        const {
          data: { session: refreshedSession },
          error,
        } = await supabase.auth.refreshSession();

        if (!mounted) {
          return;
        }

        if (error || !refreshedSession) {
          setSession(currentSession);
        } else {
          setSession(refreshedSession);
        }

        setCheckingSession(false);
      } catch (error) {
        console.error('Failed to initialize session:', error);

        if (mounted) {
          setSession(null);
          setCheckingSession(false);
        }
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted) {
        return;
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setCheckingSession(false);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'INITIAL_SESSION'
      ) {
        setSession(currentSession);
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-900 text-dark-200">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <ExpenseProvider>
      <Dashboard session={session} />
    </ExpenseProvider>
  );
}