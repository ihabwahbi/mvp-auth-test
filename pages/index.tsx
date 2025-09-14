import { useSession, signIn, signOut } from "next-auth/react"
import type { NextPage } from "next"

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div style={{ padding: "2rem", fontFamily: "system-ui" }}>Loading...</div>
  }

  if (!session) {
    return (
      <div style={{
        padding: "2rem",
        fontFamily: "system-ui",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}>
        <h1>Authentication Test - Azure AD with Allowlist</h1>
        <p style={{ marginBottom: "2rem" }}>You are not signed in.</p>
        <button
          onClick={() => signIn(process.env.NODE_ENV === 'development' ? 'mock-credentials' : 'azure-ad')}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#0078d4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: "2rem",
      fontFamily: "system-ui",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh"
    }}>
      <h1>Authentication Test - Azure AD with Allowlist</h1>
      <div style={{
        marginBottom: "2rem",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#2e7d32", marginBottom: "1rem" }}>
          Welcome, {session.user?.name}!
        </h2>
        <p style={{ marginBottom: "0.5rem" }}>
          Your email is: <strong>{session.user?.email}</strong>
        </p>
      </div>
      <button
        onClick={() => signOut()}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Sign Out
      </button>
    </div>
  )
}

export default Home