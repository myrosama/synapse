'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LearnSessionState, Session, Topic } from './types';
import { mockUser, mockSessions } from './mock-data';

// App state interface
interface AppState {
    // Auth
    user: User | null;
    isAuthenticated: boolean;
    authLoading: boolean;

    // Sessions
    sessions: Session[];
    currentSession: Session | null;

    // Learn flow
    learnState: LearnSessionState;

    // UI
    sidebarCollapsed: boolean;
    toasts: Toast[];
}

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

// Initial learn state
const initialLearnState: LearnSessionState = {
    step: 1,
    sessionLength: 10,
    showHints: true,
    strictCorrections: false,
    harderQuestions: false,
    qaTranscript: [],
    currentQuestionIndex: 0,
};

// Initial app state
const initialState: AppState = {
    user: null,
    isAuthenticated: false,
    authLoading: true,
    sessions: [],
    currentSession: null,
    learnState: initialLearnState,
    sidebarCollapsed: false,
    toasts: [],
};

// Action types
type AppAction =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_AUTH_LOADING'; payload: boolean }
    | { type: 'SET_SESSIONS'; payload: Session[] }
    | { type: 'SET_CURRENT_SESSION'; payload: Session | null }
    | { type: 'UPDATE_LEARN_STATE'; payload: Partial<LearnSessionState> }
    | { type: 'RESET_LEARN_STATE' }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
    | { type: 'REMOVE_TOAST'; payload: string }
    | { type: 'SIGN_OUT' };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                authLoading: false,
            };
        case 'SET_AUTH_LOADING':
            return { ...state, authLoading: action.payload };
        case 'SET_SESSIONS':
            return { ...state, sessions: action.payload };
        case 'SET_CURRENT_SESSION':
            return { ...state, currentSession: action.payload };
        case 'UPDATE_LEARN_STATE':
            return {
                ...state,
                learnState: { ...state.learnState, ...action.payload },
            };
        case 'RESET_LEARN_STATE':
            return { ...state, learnState: initialLearnState };
        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [...state.toasts, { ...action.payload, id: Date.now().toString() }],
            };
        case 'REMOVE_TOAST':
            return {
                ...state,
                toasts: state.toasts.filter(t => t.id !== action.payload),
            };
        case 'SIGN_OUT':
            return {
                ...initialState,
                authLoading: false,
            };
        default:
            return state;
    }
}

// Context
const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load persisted state on mount
    useEffect(() => {
        // Check for saved auth state
        const savedAuth = localStorage.getItem('synapse_auth');
        if (savedAuth) {
            try {
                const user = JSON.parse(savedAuth);
                dispatch({ type: 'SET_USER', payload: user });
            } catch {
                dispatch({ type: 'SET_USER', payload: null });
            }
        } else {
            dispatch({ type: 'SET_AUTH_LOADING', payload: false });
        }

        // Load saved learn state
        const savedLearnState = localStorage.getItem('synapse_learn_state');
        if (savedLearnState) {
            try {
                const learnState = JSON.parse(savedLearnState);
                dispatch({ type: 'UPDATE_LEARN_STATE', payload: learnState });
            } catch {
                // Ignore parse errors
            }
        }

        // Load mock sessions
        dispatch({ type: 'SET_SESSIONS', payload: mockSessions });
    }, []);

    // Persist learn state changes
    useEffect(() => {
        if (state.learnState.step > 1) {
            localStorage.setItem('synapse_learn_state', JSON.stringify(state.learnState));
        }
    }, [state.learnState]);

    // Persist auth state
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('synapse_auth', JSON.stringify(state.user));
        } else if (!state.authLoading) {
            localStorage.removeItem('synapse_auth');
        }
    }, [state.user, state.authLoading]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// Hook
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Helper hooks
export function useUser() {
    const { state } = useApp();
    return state.user;
}

export function useAuth() {
    const { state, dispatch } = useApp();
    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.authLoading,
        signIn: (user: User) => dispatch({ type: 'SET_USER', payload: user }),
        signOut: () => {
            localStorage.removeItem('synapse_auth');
            localStorage.removeItem('synapse_learn_state');
            dispatch({ type: 'SIGN_OUT' });
        },
    };
}

export function useLearnState() {
    const { state, dispatch } = useApp();
    return {
        learnState: state.learnState,
        updateLearnState: (updates: Partial<LearnSessionState>) =>
            dispatch({ type: 'UPDATE_LEARN_STATE', payload: updates }),
        resetLearnState: () => {
            localStorage.removeItem('synapse_learn_state');
            dispatch({ type: 'RESET_LEARN_STATE' });
        },
    };
}

export function useToast() {
    const { dispatch } = useApp();

    const addToast = (type: Toast['type'], message: string) => {
        const toastId = Date.now().toString();
        dispatch({ type: 'ADD_TOAST', payload: { type, message } });

        // Auto-remove after 4 seconds
        setTimeout(() => {
            dispatch({ type: 'REMOVE_TOAST', payload: toastId });
        }, 4000);
    };

    return {
        success: (message: string) => addToast('success', message),
        error: (message: string) => addToast('error', message),
        info: (message: string) => addToast('info', message),
    };
}

export function useSidebar() {
    const { state, dispatch } = useApp();
    return {
        collapsed: state.sidebarCollapsed,
        toggle: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    };
}
