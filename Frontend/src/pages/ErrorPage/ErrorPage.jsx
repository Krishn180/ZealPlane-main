import React from "react";
import "./ErrorPage.scss";

const ErrorPage = ({ errorCode, errorMessage }) => {
  return (
    <div className="error-page">
      <h1>Error {errorCode || 500}</h1>
      <p>
        {errorMessage || "Something went wrong. Please try reloading the page."}
      </p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
};

export default ErrorPage;
