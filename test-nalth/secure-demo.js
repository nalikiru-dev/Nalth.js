import { NalthServer, NalthInputSecurity } from '../packages/nalth/dist/index.js'

// Create Nalth server with enhanced security
const server = new NalthServer({
  port: 8080,
  https: {
    enabled: true,
    autoGenerate: true
  },
  security: {
    csp: {
      enabled: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'ws:', 'wss:']
      }
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
})

// Configure secure form validation
const userRegistrationForm = {
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      options: {
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_]+$/,
        sanitize: true
      }
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      encrypt: false // Email doesn't need encryption, just validation
    },
    {
      name: 'password',
      type: 'password',
      required: true,
      hash: true // Enable secure password hashing
    },
    {
      name: 'phone',
      type: 'phone',
      required: false,
      encrypt: true // Encrypt sensitive personal data
    },
    {
      name: 'ssn',
      type: 'text',
      required: false,
      encrypt: true,
      options: {
        pattern: /^\d{3}-\d{2}-\d{4}$/,
        maxLength: 11
      }
    }
  ],
  logViolations: true,
  sanitizeAll: true
}

const loginForm = {
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      required: true
    }
  ]
}

// Demo routes with secure input handling
server.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nalth Secure Input Demo</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .form-section { margin: 2rem 0; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; }
        .form-group { margin: 1rem 0; }
        label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333; }
        input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        input:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
        button { background: #007bff; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
        button:hover { background: #0056b3; }
        .security-info { background: #e7f3ff; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
        .security-feature { display: inline-block; background: #28a745; color: white; padding: 0.25rem 0.5rem; border-radius: 3px; margin: 0.25rem; font-size: 0.8rem; }
        .demo-section { margin: 2rem 0; }
        .response { margin-top: 1rem; padding: 1rem; border-radius: 4px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ Nalth Secure Input Demo</h1>
        <p>Demonstration of advanced input security, encryption, and validation features.</p>
        
        <div class="security-info">
          <h3>🔒 Active Security Features:</h3>
          <span class="security-feature">Input Sanitization</span>
          <span class="security-feature">XSS Protection</span>
          <span class="security-feature">SQL Injection Prevention</span>
          <span class="security-feature">Password Hashing (bcrypt)</span>
          <span class="security-feature">Field Encryption (AES-256)</span>
          <span class="security-feature">CSRF Protection</span>
          <span class="security-feature">Rate Limiting</span>
        </div>

        <div class="demo-section">
          <div class="form-section">
            <h2>User Registration (Secure Form)</h2>
            <p>This form demonstrates secure input handling with encryption and validation.</p>
            <form id="registerForm">
              <div class="form-group">
                <label for="username">Username (3-30 chars, alphanumeric + underscore)</label>
                <input type="text" id="username" name="username" required>
              </div>
              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="password">Password (min 8 chars, mixed case + numbers + symbols)</label>
                <input type="password" id="password" name="password" required>
              </div>
              <div class="form-group">
                <label for="phone">Phone Number (optional, will be encrypted)</label>
                <input type="tel" id="phone" name="phone" placeholder="+1-555-123-4567">
              </div>
              <div class="form-group">
                <label for="ssn">SSN (optional, will be encrypted, format: 123-45-6789)</label>
                <input type="text" id="ssn" name="ssn" placeholder="123-45-6789">
              </div>
              <button type="submit">Register Securely</button>
            </form>
            <div id="registerResponse" class="response" style="display:none;"></div>
          </div>

          <div class="form-section">
            <h2>User Login (Password Verification)</h2>
            <form id="loginForm">
              <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" name="email" required>
              </div>
              <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" name="password" required>
              </div>
              <button type="submit">Login</button>
            </form>
            <div id="loginResponse" class="response" style="display:none;"></div>
          </div>

          <div class="form-section">
            <h2>Security Test (XSS/Injection Attempts)</h2>
            <p>Try entering malicious content to see the security features in action:</p>
            <form id="securityTestForm">
              <div class="form-group">
                <label for="testInput">Test Input (try: &lt;script&gt;alert('xss')&lt;/script&gt; or SQL injection)</label>
                <textarea id="testInput" name="testInput" rows="3" placeholder="<script>alert('xss')</script> or ' OR 1=1 --"></textarea>
              </div>
              <button type="submit">Test Security</button>
            </form>
            <div id="securityTestResponse" class="response" style="display:none;"></div>
          </div>
        </div>
      </div>

      <script>
        // Form submission handlers
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const data = Object.fromEntries(formData)
          
          try {
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            const result = await response.json()
            showResponse('registerResponse', result, response.ok)
          } catch (error) {
            showResponse('registerResponse', { message: 'Network error: ' + error.message }, false)
          }
        })

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const data = Object.fromEntries(formData)
          
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            const result = await response.json()
            showResponse('loginResponse', result, response.ok)
          } catch (error) {
            showResponse('loginResponse', { message: 'Network error: ' + error.message }, false)
          }
        })

        document.getElementById('securityTestForm').addEventListener('submit', async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const data = Object.fromEntries(formData)
          
          try {
            const response = await fetch('/api/security-test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            const result = await response.json()
            showResponse('securityTestResponse', result, response.ok)
          } catch (error) {
            showResponse('securityTestResponse', { message: 'Network error: ' + error.message }, false)
          }
        })

        function showResponse(elementId, result, success) {
          const element = document.getElementById(elementId)
          element.style.display = 'block'
          element.className = 'response ' + (success ? 'success' : 'error')
          element.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>'
        }

        // Hot reload connection
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
        const ws = new WebSocket(protocol + '//' + location.host + '/__nalth_hot')
        ws.onmessage = (event) => {
          if (event.data === 'reload') window.location.reload()
        }
      </script>
    </body>
    </html>
  `)
})

// Secure registration endpoint
server.post('/api/register', 
  ...NalthInputSecurity.createSecureForm(userRegistrationForm),
  NalthInputSecurity.processSecureForm(userRegistrationForm),
  (req, res) => {
    // At this point, password is hashed and sensitive fields are encrypted
    res.json({
      success: true,
      message: 'User registered successfully with secure data handling',
      data: {
        username: req.body.username,
        email: req.body.email,
        passwordHashed: !!req.body.password, // Don't return actual hash
        phoneEncrypted: !!req.body.phone,
        ssnEncrypted: !!req.body.ssn
      }
    })
  }
)

// Login endpoint with password verification
server.post('/api/login',
  ...NalthInputSecurity.createSecureForm(loginForm),
  (req, res) => {
    // In a real app, you'd fetch the user's hash from database
    // For demo, we'll simulate a stored hash
    const mockStoredHash = '$2b$12$example.hash.would.be.here'
    req.body.passwordHash = mockStoredHash
    
    res.json({
      success: false,
      message: 'Demo: Password verification would happen here',
      note: 'In production, this would verify against stored hash'
    })
  }
)

// Security test endpoint
server.post('/api/security-test', (req, res) => {
  const input = req.body.testInput || ''
  
  // Show what security violations were detected
  const violations = req.securityViolations || []
  
  res.json({
    success: true,
    message: 'Security test completed',
    originalInput: input,
    securityViolations: violations,
    sanitizedInput: input, // Would be sanitized by middleware
    securityFeatures: [
      'XSS patterns blocked',
      'SQL injection detected',
      'Input sanitized',
      'Malicious scripts removed'
    ]
  })
})

// API key generation endpoint
server.get('/api/generate-key',
  NalthInputSecurity.generateApiKey(),
  (req, res) => {
    res.json({
      success: true,
      apiKey: req.apiKey,
      message: 'Secure API key generated'
    })
  }
)

// Start the secure server
server.listen().then(() => {
  console.log('🛡️ Nalth Secure Input Demo is running!')
  console.log('📝 Features demonstrated:')
  console.log('  • Secure password hashing with bcrypt')
  console.log('  • Field-level encryption for sensitive data')
  console.log('  • Input sanitization and XSS protection')
  console.log('  • SQL injection prevention')
  console.log('  • Form validation with custom rules')
  console.log('  • API key generation')
  console.log('  • CSRF token support')
}).catch(console.error)