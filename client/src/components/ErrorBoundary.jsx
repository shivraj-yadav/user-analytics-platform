import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.box}>
            <p style={styles.icon}>💥</p>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              {this.state.error?.message || "Unexpected error occurred"}
            </p>
            <button
              style={styles.btn}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    padding: "30px",
  },
  box: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  icon: {
    fontSize: "60px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "22px",
    color: "#1a1a2e",
    marginBottom: "12px",
  },
  message: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "24px",
  },
  btn: {
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default ErrorBoundary;
