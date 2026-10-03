import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#fbfaf7', color: '#273b32', fontFamily: 'system-ui, sans-serif' }}>
        <section style={{ width: 'min(100%, 640px)' }}>
          <p style={{ fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase' }}>ShopInsta could not load</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36 }}>There was a page error.</h1>
          <pre style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', background: '#f1efe9', padding: 16, fontSize: 12 }}>{this.state.error.message}</pre>
          <button onClick={() => window.location.reload()} style={{ minHeight: 44, padding: '0 18px', background: '#273b32', color: 'white', border: 0 }}>Reload ShopInsta</button>
        </section>
      </main>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </StrictMode>,
)
