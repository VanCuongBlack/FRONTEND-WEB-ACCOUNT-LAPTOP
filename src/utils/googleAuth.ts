import axios from 'axios'

declare global {
  interface Window {
    google: any
  }
}

// Load the Google GIS script dynamically
export const loadGoogleSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.body.appendChild(script)
  })
}

// Initialize OAuth2 Token Client
let tokenClient: any = null

export const initGoogleAuth = (clientId: string, onSuccess: (accessToken: string) => void) => {
  if (!window.google || !window.google.accounts) return
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'openid email profile',
    callback: (response: any) => {
      if (response.access_token) {
        onSuccess(response.access_token)
      }
    },
  })
}

// Trigger Google Login popup
export const triggerGoogleLogin = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken()
  } else {
    console.error('Google Auth has not been initialized')
  }
}

// Fetch user info from Google's UserInfo API
export const fetchGoogleUserInfo = async (accessToken: string) => {
  const res = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
  return res.data // { email, name, picture, sub }
}
