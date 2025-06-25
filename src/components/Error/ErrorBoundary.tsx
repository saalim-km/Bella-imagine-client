import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack trace:", errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>Oops! Something went wrong.</h2>
          <p style={styles.description}>
            We're sorry for the inconvenience. Please try again or contact support if the issue persists.
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <details style={styles.details}>
              <summary className="text-gray-900">Error Details</summary>
              <pre className="text-gray-900">{error.message}</pre>
            </details>
          )}
          <button onClick={this.handleRetry} style={styles.button}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    textAlign: "center",
    border: "1px solid #f5c2c7",
    backgroundColor: "#f8d7da",
    borderRadius: "8px",
    margin: "2rem auto",
    maxWidth: "600px",
  },
  title: {
    fontSize: "1.5rem",
    color: "#721c24",
  },
  description: {
    color: "#721c24",
    marginBottom: "1rem",
  },
  details: {
    backgroundColor: "#f1f1f1",
    padding: "1rem",
    borderRadius: "5px",
    textAlign: "left",
    margin: "1rem 0",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#721c24",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ErrorBoundary;