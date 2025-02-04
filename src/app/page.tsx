import Content from "@/components/content";

export default function Home() {
  return (
    <div>
      <h1>My Homepage</h1>
      <p>
        <a href="/api/auth/login">Login</a>
      </p>
      <p>
        <a href="/api/auth/logout">Logout</a>
      </p>
      <p></p>
      <Content />
    </div>
  );
}
