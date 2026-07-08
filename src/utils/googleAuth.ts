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

let googleClientReady = false

export const initGoogleAuth = (clientId: string, onSuccess: (idToken: string) => void) => {
  if (!window.google || !window.google.accounts) return

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: any) => {
      if (response.credential) {
        onSuccess(response.credential)
      }
    },
    cancel_on_tap_outside: false,
  })

  googleClientReady = true
}

export const triggerGoogleLogin = () => {
  if (googleClientReady && window.google?.accounts?.id) {
    window.google.accounts.id.prompt()
  } else {
    console.error('Google Auth has not been initialized')
  }
}
