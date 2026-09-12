import React, { Component, ErrorInfo, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in BharatDoc:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center text-[#292524]">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-2xl font-bold mb-4">
            ⚠️
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#0c0a09] mb-2">Something went wrong</h2>
          <p className="text-xs text-[#777169] mb-6 max-w-md">
            An unexpected render error occurred ({this.state.error?.message}). Don't worry, your session data is safe.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/dashboard';
            }}
            className="px-6 py-2.5 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-[#0c0a09] transition-all shadow-sm"
          >
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
