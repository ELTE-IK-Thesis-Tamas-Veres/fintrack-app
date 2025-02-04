"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Tree } from "react-arborist";

export default function Content() {
  const { user } = useUser();

  const [state, setState] = useState({
    isLoading: false,
    response: undefined,
    error: undefined,
  });

  const data = [
    { id: "1", name: "Unread" },
    { id: "2", name: "Threads" },
    {
      id: "3",
      name: "Chat Rooms",
      children: [
        { id: "c1", name: "General" },
        { id: "c2", name: "Random" },
        {
          id: "c3",
          name: "Open Source Projects",
          children: [
            { id: "g1", name: "Alice" },
            { id: "g2", name: "Bob" },
            { id: "g3", name: "Charlie" },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Direct Messages",
      children: [
        { id: "d1", name: "Alice" },
        { id: "d2", name: "Bob" },
        { id: "d3", name: "Charlie" },
      ],
    },
  ];

  const callApi = async () => {
    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/category");
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
      </>
      <Tree
        data={data}
        onMove={({ dragIds, parentId, index }) =>
          console.log(dragIds, parentId, index)
        }
      />
    </>
  );
}
