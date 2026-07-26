import React from 'react';
import Logo from './Logo';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log full component stack trace server-side for debugging
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center page-enter">
          <div className="max-w-md w-full p-8 rounded-2xl bg-surface-elevated shadow-xl border border-border flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-3xl mb-4">
              ⚠️
            </div>
            <Logo size="small" />
            <h2 className="mt-4 text-xl font-bold text-text-primary">Something went wrong</h2>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              We encountered an unexpected visual rendering issue. Don't worry, your data is safe.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-6 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
