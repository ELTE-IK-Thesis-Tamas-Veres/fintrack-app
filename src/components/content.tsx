"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Content() {
  const { user, err, load } = useUser();

  const [state, setState] = useState({
    isLoading: false,
    response: undefined,
    error: undefined,
  });

  const callApi = async () => {
    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      setState((previous) => ({
        ...previous,
        response: data,
        error: undefined,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        response: undefined,
        error: undefined,
      }));
    } finally {
      setState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  const handle = (event, fn) => {
    event.preventDefault();
    fn();
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <div>
        <button
          className="btn btn-blue"
          color="primary"
          onClick={(e) => handle(e, callApi)}
          data-testid="external-action"
        >
          Ping API
        </button>
      </div>
      <div className="result-block-container">
        {isLoading && <div className="loading">Loading...</div>}
        {(error || response) && (
          <div className="result-block" data-testid="external-result">
            <h6 className="muted">Result</h6>
            {error && <p>error</p>}
            {response && <p>{JSON.stringify(response, null, 2)}</p>}
          </div>
        )}
      </div>
      <>
        {user && (
          <div>
            <h2>Welcome {user.name}!</h2>
            <p>{user.email}</p>
            <img src={user.picture} alt={user.name} width={50} height={50} />
          </div>
        )}
        {err && (
          <div>
            <h2>Error</h2>
            <p>{err.message}</p>
          </div>
        )}
        {load && (
          <div>
            <h2>Loading</h2>
          </div>
        )}
      </>
    </>
  );
}
