// Nalth Demo JavaScript
class NalthDemo {
  constructor() {
    this.init()
  }

  init() {
    this.checkHTTPS()
    this.initWebSocket()
    this.addInteractivity()
  }

  checkHTTPS() {
    const httpsIndicator = document.getElementById('https-indicator')
    const httpsStatus = document.getElementById('https-status')
    
    if (location.protocol === 'https:') {
      httpsIndicator.classList.add('active')
      httpsStatus.textContent = '✅ Secure HTTPS Connection'
    } else {
      httpsStatus.textContent = '⚠️ HTTP Mode (Development)'
    }
  }

  initWebSocket() {
    const wsIndicator = document.getElementById('ws-indicator')
    const wsStatus = document.getElementById('ws-status')
    
    try {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//${location.host}/__nalth_hot`)
      
      ws.onopen = () => {
        wsIndicator.classList.add('active')
        wsStatus.textContent = '✅ Hot Reload Connected'
      }
      
      ws.onmessage = (event) => {
        if (event.data === 'reload') {
          this.showReloadNotification()
          setTimeout(() => window.location.reload(), 1000)
        }
      }
      
      ws.onerror = () => {
        wsStatus.textContent = '❌ Connection Failed'
      }
      
      ws.onclose = () => {
        wsStatus.textContent = '🔄 Reconnecting...'
        // Try to reconnect after 3 seconds
        setTimeout(() => this.initWebSocket(), 3000)
      }
    } catch (error) {
      wsStatus.textContent = '❌ WebSocket Not Available'
    }
  }

  showReloadNotification() {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    `
    notification.innerHTML = '🔄 Hot reload triggered - Updating...'
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)
  }

  addInteractivity() {
    // Add click effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card')
    featureCards.forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)'
        setTimeout(() => {
          card.style.transform = ''
        }, 150)
      })
    })

    // Add hover effects to status cards
    const statusCards = document.querySelectorAll('.status-card')
    statusCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const indicator = card.querySelector('.status-indicator')
        if (indicator.classList.contains('active')) {
          indicator.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)'
        }
      })
      
      card.addEventListener('mouseleave', () => {
        const indicator = card.querySelector('.status-indicator')
        if (indicator.classList.contains('active')) {
          indicator.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)'
        }
      })
    })

    // Add performance monitoring
    this.monitorPerformance()
  }

  monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0]
          const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart)
          
          console.log(`🚀 Nalth Performance:
📊 Page Load Time: ${loadTime}ms
🔒 Security: HTTPS + CSP Headers
⚡ Hot Reload: Active
🛡️ Framework: Nalth v1.0.0`)
        }, 100)
      })
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NalthDemo())
} else {
  new NalthDemo()
}