"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
    const res = await fetch("/api/auth");
    const json = await res.json();
    setToken(json.token);
  };

  return (
    <div>
      <Button className="my-3" onClick={() => fetchToken()}>
        Get token
      </Button>
      <Textarea value={token} rows={10} onChange={() => {}} />
    </div>
  );
}
