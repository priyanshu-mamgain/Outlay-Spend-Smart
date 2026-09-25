import { useEffect, useReducer, useState } from 'react';
import { ExpenseContext } from './ExpenseContextValue';
import { supabase } from '../lib/supabase';

/* ── Reducer ── */
function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_EXPENSES':
      return action.payload;

    case 'ADD_EXPENSE':
      return [{ ...action.payload }, ...state];

    case 'UPDATE_EXPENSE':
      return state.map((exp) =>
        exp.id === action.payload.id
          ? { ...exp, ...action.payload }
          : exp
      );

    case 'DELETE_EXPENSE':
      return state.filter((exp) => exp.id !== action.payload);

    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [expenses, dispatch] = useReducer(expenseReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('You are not authenticated.');
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchExpenses = async () => {
    let headers = await getAuthHeaders();

    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/expenses`,
      {
        headers,
      }
    );

    /*
     * If the access token is stale during login/session refresh,
     * refresh the Supabase session and retry the request once.
     */
    if (response.status === 401) {
      const {
        data: { session },
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (refreshError || !session?.access_token) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      headers = {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      response = await fetch(
        `${import.meta.env.VITE_API_URL}/expenses`,
        {
          headers,
        }
      );
    }

    if (!response.ok) {
      throw new Error('Failed to load expenses');
    }

    return response.json();
  };

  const loadExpenses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchExpenses();

      dispatch({
        type: 'SET_EXPENSES',
        payload: data,
      });
    } catch (error) {
      console.error('Failed to load expenses:', error);
      setError('Unable to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initializeExpenses = async () => {
      try {
        const data = await fetchExpenses();

        if (!cancelled) {
          dispatch({
            type: 'SET_EXPENSES',
            payload: data,
          });

          setError(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load expenses:', error);
          setError('Unable to load expenses. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initializeExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        dispatch,
        loading,
        error,
        loadExpenses,
        getAuthHeaders,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}