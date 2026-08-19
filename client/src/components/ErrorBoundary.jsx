import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
            <p className="text-red-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={this.reset}
              className="w-full bg-sage-700 hover:bg-sage-800 text-white py-2 rounded font-medium transition"
            >
              Try again
            </button>
            <p className="text-xs text-sage-600 mt-3">
              Check the browser console for details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
