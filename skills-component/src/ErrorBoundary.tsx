import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logEvent } from './utils/telemetry';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    logEvent('SYSTEM_FAULT', { error: error.message, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="border border-red-600/50 p-6 bg-red-950/20 text-red-500 rounded font-mono text-sm h-full flex flex-col justify-center" role="alert" aria-live="assertive">
          <h2 className="text-red-400 mb-2 font-bold tracking-widest">[ SYSTEM_FAILURE ]</h2>
          <p>Component rendering failed.</p>
          <p className="text-xs mt-2 text-red-500/70 truncate">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
