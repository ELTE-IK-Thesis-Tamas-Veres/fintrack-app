"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h1>My Homepage</h1>
      <p>
        <a href="/api/auth/login">Login</a>
      </p>
      <p>
        <a href="/api/auth/logout">Logout</a>
      </p>
      <p>{user ? "Hello " + user.name + "!" : "You are not logged in!"}</p>
    </div>
  );
}
