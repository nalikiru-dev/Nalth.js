# Changelog

## [0.9.0] - 2025-12-18

### Added
- **SQL Injection Prevention**: Added `sql` tagged template literal for safe parameterized queries.
- **SSRF Protection**: Added `safeFetch` utility to block requests to private internal IP addresses.
- **Security Exports**: Exposed `OWASPSecurity`, `NalthCrypto`, `SecureInput`, and more from the main package entry point.

### Changed
- **Documentation**: Significant improvements to README.md, documenting security primitives and enterprise features.
- **Cleanup**: Removed non-functional test projects and playground directories to streamline the framework structure.
