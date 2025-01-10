import { useState, useEffect } from "react"

import styles from "./UpdateNotification.module.css"

const useVersionCheck = () => {
  const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false)

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch("/version.json")
        if (!response.ok) return
        const data = await response.json()
        if (data.buildHash !== process.env.BUILD_HASH) {
          setIsNewVersionAvailable(true)
        }
      } catch (error) {
        console.error("Error checking version:", error)
      }
    }

    checkVersion()
    const interval = setInterval(checkVersion, 30000)
    return () => clearInterval(interval)
  }, [])

  return isNewVersionAvailable
}

export function UpdateNotification() {
  const isNewVersionAvailable = useVersionCheck()

  if (!isNewVersionAvailable) return null

  return (
    <div className={styles.container}>
      <p className={styles.text}>A new version is available. Please refresh to update.</p>
      <button className={styles.button} onClick={() => window.location.reload()}>
        Update Now
      </button>
    </div>
  )
}
