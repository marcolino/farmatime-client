import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCatched: null,
      errorInfoCatched: null,
    };
  }

  static getDerivedStateFromError(error) {
    // update state so the next render will show the fallback UI
    this.state.error = error;
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // log the error to an error reporting service
    this.state.errorCatched = error;
    this.state.errorInfoCatched = errorInfo;
    //logErrorToMyService(error, errorInfo); // TODO...
  }

  render() {
    if (this.state.hasError) {
      // render any custom fallback UI
      return (
        <>
          <h1>Something went wrong:</h1>
          <h3>error: {this.state.error}</h3>
          <h4>error catched: {this.state.errorCatched}</h4>
          <h5>error info catched: {this.state.errorInfoCatched}</h5>
          <a href="/">Go back</a>
        </>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;

/**
 * example usage:
 * 

import React from "react";
import ErrorBoundary from "./ErrorBoundary";

const Alert = ({ props }) => {
  return <h1>{props.msg}</h1>; // note: props has no msg propery
};

export const App = () => {
  return (
    <ErrorBoundary>
      <Alert />
    </ErrorBoundary>
    );
};
*/

///////////////////////////////////////////////////////////////////////////////////////

// Catching all errors and retry mechanisms

import { ErrorBoundary } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      {retryCount < 3 && (
        <button onClick={resetErrorBoundary}>Try again</button>
      )}
      {retryCount >= 3 && (
        <button onClick={history.go("/")}>Go home</button>
      )}
    </div>
  )
}

function MyComponent({ retryCount }) {
  // some component logic that may throw JS errors
  throw("Oh no, I'm throwing...")
}

function App() {
  const [retryCount, setRetryCount] = React.useState(0)

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setRetryCount(retryCount + 1)} // increment the retry count on reset
      resetKeys={[retryCount]} // reset the error boundary when `retryCount` changes
    >
      <MyComponent retryCount={retryCount} />
    </ErrorBoundary>
  )
}