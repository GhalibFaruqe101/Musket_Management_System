import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(to bottom right, #f8f9fa, #e9ecef)", // Light elegant gradient
      fontFamily: "var(--font-geist-sans), sans-serif"
    }}>
      <h1 style={{
        fontSize: "3rem",
        fontWeight: "800",
        background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "1rem"
      }}>
        Musket Management System
      </h1>
      <p style={{
        fontSize: "1.2rem",
        color: "#64748b",
        marginBottom: "2rem"
      }}>
        Welcome to your management portal.
      </p>

      <Link href="/dashboard" style={{
        padding: "1rem 2rem",
        background: "#2563eb",
        color: "white",
        textDecoration: "none",
        borderRadius: "0.5rem",
        fontSize: "1.1rem",
        fontWeight: "600",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
        transition: "transform 0.2s"
      }}>
        Go to Admin Dashboard
      </Link>
    </div>
  );
}
