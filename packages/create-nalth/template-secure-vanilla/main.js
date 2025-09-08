// Nalth Secure Vanilla Template JavaScript
class NalthSecureApp {
  constructor() {
    this.init()
  }

  init() {
    this.checkHTTPS()
    this.initWebSocket()
    this.setupTabs()
    this.setupInteractivity()
    this.monitorPerformance()
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

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn')
    const tabPanes = document.querySelectorAll('.tab-pane')

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab

        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'))
        tabPanes.forEach(pane => pane.classList.remove('active'))

        // Add active class to clicked button and corresponding pane
        button.classList.add('active')
        document.getElementById(targetTab).classList.add('active')
      })
    })
  }

  setupInteractivity() {
    // Add click effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card')
    featureCards.forEach(card => {
      card.addEventListener('click', () => {
        const feature = card.dataset.feature
        this.showFeatureDetails(feature)
        
        // Visual feedback
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

    // Smooth scrolling for navigation
    window.scrollToFeatures = () => {
      document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  showFeatureDetails(feature) {
    const features = {
      security: {
        title: '🔐 Security Features',
        details: [
          '✅ HTTPS by default with auto-generated certificates',
          '✅ Content Security Policy (CSP) headers',
          '✅ Rate limiting and DDoS protection',
          '✅ XSS and CSRF protection built-in',
          '✅ Secure cookie handling'
        ]
      },
      performance: {
        title: '⚡ Performance Features',
        details: [
          '✅ Hot module replacement (HMR)',
          '✅ Optimized asset serving',
          '✅ Compression middleware',
          '✅ Efficient caching strategies',
          '✅ Minimal bundle sizes'
        ]
      },
      dx: {
        title: '🛠️ Developer Experience',
        details: [
          '✅ Zero-config setup',
          '✅ TypeScript support',
          '✅ Modern ES modules',
          '✅ Comprehensive error messages',
          '✅ Built-in development tools'
        ]
      },
      production: {
        title: '🎯 Production Ready',
        details: [
          '✅ Enterprise-grade security',
          '✅ Scalable architecture',
          '✅ Health check endpoints',
          '✅ Monitoring and logging',
          '✅ Docker support'
        ]
      }
    }

    const featureInfo = features[feature]
    if (featureInfo) {
      this.showModal(featureInfo.title, featureInfo.details)
    }
  }

  showModal(title, details) {
    // Create modal
    const modal = document.createElement('div')
    modal.className = 'modal-overlay'
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <ul class="feature-list">
            ${details.map(detail => `<li>${detail}</li>`).join('')}
          </ul>
        </div>
      </div>
    `

    // Add modal styles
    const modalStyles = document.createElement('style')
    modalStyles.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
      }
      .modal-content {
        background: white;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease-out;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .modal-header h3 {
        margin: 0;
        color: #1f2937;
      }
      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-close:hover {
        color: #1f2937;
      }
      .modal-body {
        padding: 1.5rem;
      }
      .feature-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .feature-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .feature-list li:last-child {
        border-bottom: none;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `

    document.head.appendChild(modalStyles)
    document.body.appendChild(modal)

    // Close modal functionality
    const closeModal = () => {
      modal.remove()
      modalStyles.remove()
    }

    modal.querySelector('.modal-close').addEventListener('click', closeModal)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal()
    })

    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', escapeHandler)
      }
    })
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
      animation: slideInRight 0.3s ease-out;
    `
    notification.innerHTML = '🔄 Hot reload triggered - Updating...'
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
      style.remove()
    }, 2000)
  }

  monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0]
          const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart)
          
          console.log(`🛡️ Nalth Performance Metrics:
📊 Page Load Time: ${loadTime}ms
🔒 Security: HTTPS + CSP Headers
⚡ Hot Reload: Active
🛡️ Framework: Nalth v1.0.0
🎯 Template: Secure Vanilla`)

          // Show performance badge
          if (loadTime < 1000) {
            this.showPerformanceBadge('⚡ Lightning Fast!', 'success')
          } else if (loadTime < 2000) {
            this.showPerformanceBadge('✅ Good Performance', 'info')
          } else {
            this.showPerformanceBadge('⚠️ Consider Optimization', 'warning')
          }
        }, 100)
      })
    }
  }

  showPerformanceBadge(message, type) {
    const badge = document.createElement('div')
    const colors = {
      success: '#10b981',
      info: '#3b82f6',
      warning: '#f59e0b'
    }
    
    badge.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: bounceIn 0.5s ease-out;
    `
    badge.textContent = message
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(badge)

    setTimeout(() => {
      badge.remove()
      style.remove()
    }, 5000)
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NalthSecureApp())
} else {
  new NalthSecureApp()
}
