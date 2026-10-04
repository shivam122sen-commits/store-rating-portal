import React from 'react';

class ErrorBoundary extends React.Component {
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

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div className="card" style={{ maxWidth: '500px' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ Something went wrong</h2>
            <p style={{ marginBottom: '20px', color: '#64748b' }}>
              The application encountered an error. Please try refreshing the page.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '20px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#64748b' }}>Error Details</summary>
                <pre style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  background: '#f1f5f9', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
