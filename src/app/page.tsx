import Content from "@/components/content";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>My Homepage</h1>
      <p>
        <Link href="/api/auth/login">Login</Link>
      </p>
      <p>
        <Link href="/api/auth/logout">Logout</Link>
      </p>
      <p></p>
      <Content />
    </div>
  );
}
