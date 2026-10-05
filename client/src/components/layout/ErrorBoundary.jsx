import { Component } from 'react';

/**
 * ErrorBoundary — prevents a single component crash from blanking the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <h1 className="heading-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Something went wrong
          </h1>
          <p className="text-muted" style={{ marginTop: '1rem' }}>
            We're sorry — the page hit an unexpected error.
          </p>
          <pre style={{ marginTop: '1.5rem', color: '#d4a017', whiteSpace: 'pre-wrap' }}>
            {String(this.state.error)}
          </pre>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn--primary" onClick={this.handleReset}>
              Try again
            </button>
            <button className="btn btn--outline" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}