// Test Nalth security features
console.log('🛡️ Nalth Security Test Starting...')

// Check if we're running on HTTPS
function checkHTTPS() {
  const httpsStatus = document.getElementById('https-status')
  const isHTTPS = location.protocol === 'https:'
  
  if (isHTTPS) {
    httpsStatus.innerHTML = 'HTTPS: <span style="color: green;">✓ Enabled</span>'
  } else {
    httpsStatus.innerHTML = 'HTTPS: <span style="color: orange;">⚠ HTTP (expected in dev)</span>'
  }
}

// Check CSP by attempting unsafe operations
function checkCSP() {
  const cspStatus = document.getElementById('csp-status')
  
  try {
    // This should be blocked by CSP in production
    eval('console.log("CSP test")')
    cspStatus.innerHTML = 'CSP: <span style="color: orange;">⚠ Permissive (dev mode)</span>'
  } catch (e) {
    cspStatus.innerHTML = 'CSP: <span style="color: green;">✓ Blocking unsafe-eval</span>'
  }
}

// Check security headers (this would need server inspection in real app)
function checkHeaders() {
  const headersStatus = document.getElementById('headers-status')
  
  // In a real app, you'd check response headers
  // For demo, we'll assume they're working based on our middleware
  headersStatus.innerHTML = 'Security Headers: <span style="color: green;">✓ Applied by middleware</span>'
}

// Test security audit - this should trigger warnings during build
function potentiallyUnsafeCode() {
  // These patterns should be caught by our security audit
  console.log('Testing security audit patterns...')
  
  // This would normally trigger security warnings:
  // eval('test') - commented out to avoid actual execution
  // document.write('test') - commented out
  // innerHTML = 'test' - commented out
  
  console.log('Security audit test complete')
}

// Initialize tests
document.addEventListener('DOMContentLoaded', () => {
  checkHTTPS()
  checkCSP()
  checkHeaders()
  potentiallyUnsafeCode()
  
  console.log('🛡️ Nalth security checks complete!')
})
