import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Roulette Tracker:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-zinc-900 border border-gold/30 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-xl font-black text-gold uppercase tracking-wider">Application Notice</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              An error occurred while processing calculations. You can recover immediately by tapping reset below.
            </p>
            {this.state.error && (
              <div className="bg-black/60 p-3 rounded-xl border border-gray-800 text-left overflow-x-auto max-h-32 text-[10px] text-red-400 font-mono">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-gold text-black font-black uppercase text-xs rounded-xl shadow-lg hover:bg-amber-400 transition-all active:scale-95"
            >
              Reset Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
