import { useState, useCallback } from 'react'

const CLIENT_ID = '402384987306-ancfagfqpivb19qdll7v3u7gvfgn2g0r.apps.googleusercontent.com'
const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly'

export function useAuth() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signIn = useCallback(() => {
    setLoading(true)
    setError(null)

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        setLoading(false)
        if (response.error) {
          setError(response.error_description || response.error)
        } else {
          setToken(response.access_token)
        }
      },
    })
    client.requestAccessToken()
  }, [])

  const signOut = useCallback(() => {
    if (token) window.google.accounts.oauth2.revoke(token, () => {})
    setToken(null)
    setError(null)
  }, [token])

  return { token, loading, error, signIn, signOut }
}
