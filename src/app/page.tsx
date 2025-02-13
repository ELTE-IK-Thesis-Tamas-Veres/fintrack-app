"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
    const res = await fetch("/api/auth");
    const json = await res.json();
    console.log(json);
    setToken(json.token);
  };

  return (
    <div>
      <h1>My Homepage</h1>
      <p>
        <a href="/auth/login">Login</a>
      </p>
      <p>
        <a href="/auth/logout">Logout</a>
      </p>
      <Button className="my-3" onClick={() => fetchToken()}>
        Get token
      </Button>
      <Textarea value={token} rows={10} onChange={() => {}} />
      <p className="text-lg text-red-500">This should be red</p>
    </div>
  );
}
