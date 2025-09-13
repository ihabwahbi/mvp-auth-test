import { useRouter } from "next/router"
import type { NextPage } from "next"

const ErrorPage: NextPage = () => {
  const router = useRouter()
  const { error } = router.query

  const errorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return "Access denied. Your email is not in the allowlist."
      case "Configuration":
        return "There is a problem with the server configuration."
      case "Verification":
        return "The verification token has expired or has already been used."
      default:
        return "An error occurred during authentication."
    }
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
      <h1>Authentication Error</h1>
      <div style={{
        marginBottom: "2rem",
        padding: "2rem",
        backgroundColor: "#ffebee",
        borderRadius: "8px",
        textAlign: "center",
        maxWidth: "500px"
      }}>
        <p style={{ color: "#c62828", marginBottom: "1rem" }}>
          {errorMessage()}
        </p>
        {error === "AccessDenied" && (
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Please contact your administrator to be added to the allowlist.
          </p>
        )}
      </div>
      <button
        onClick={() => router.push("/")}
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
        Back to Home
      </button>
    </div>
  )
}

export default ErrorPage