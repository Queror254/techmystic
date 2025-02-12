export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="/api/proxy"
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
    </div>
  );
}
