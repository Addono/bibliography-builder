import React from "react"

export function Spinner() {
  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "2rem",
          height: "2rem",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
