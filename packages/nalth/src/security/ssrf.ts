
import { lookup } from 'node:dns/promises'
import { URL } from 'node:url'

// Comprehensive Private and Reserved IP ranges
const RESTRICTED_IP_RANGES = [
    // IPv4
    /^127\./,                 // Localhost
    /^10\./,                  // Class A private
    /^172\.(1[6-9]|2\d|3[0-1])\./, // Class B private
    /^192\.168\./,            // Class C private
    /^169\.254\./,            // Link-local
    /^0\./,                   // Current network (RFC 1122)
    /^100\.6[4-9]\.|^100\.[7-9]\d\.|^100\.1[0-1]\d\.|^100\.12[0-7]\./, // Shared Address Space (CGNAT) RFC 6598
    /^192\.0\.0\./,           // IETF Protocol Assignments
    /^192\.0\.2\./,           // TEST-NET-1
    /^198\.18\.|^198\.19\./,  // Benchmarking
    /^198\.51\.100\./,        // TEST-NET-2
    /^203\.0\.113\./,         // TEST-NET-3
    /^224\.|^239\./,          // Multicast
    /^240\.|^255\./,          // Reserved/Broadcast

    // IPv6
    /^::1$/,                  // Loopback
    /^::$/,                   // Unspecified
    /^[fF][cCdD]/,            // Unique Local Address (fc00::/7)
    /^[fF][eE][89aAbB]/,      // Link-local (fe80::/10)
    /^[fF][0-9a-fA-F]/,       // Multicast (ff00::/8)
    /^2001:[dD]b8:/,          // Documentation
    /^::[fF]{4}:/,            // IPv4-mapped
    /^::[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/ // IPv4-compatible
]

export interface SafeFetchOptions extends RequestInit {
    allowPrivate?: boolean
    allowedDomains?: string[]
}

/**
 * Validates if an IP address is private or restricted
 */
function isRestrictedIp(ip: string): boolean {
    // Normalization could happen here, but simple regex check for standard string representations is usually sufficient for node's lookup output
    return RESTRICTED_IP_RANGES.some(regex => regex.test(ip))
}

/**
 * Resolves a hostname to an IP address
 */
async function resolveHostname(hostname: string): Promise<string> {
    // Check if it's already an IP address
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || /^[0-9a-fA-F:]+$/.test(hostname)) {
        return hostname
    }

    try {
        const result = await lookup(hostname)
        return result.address
    } catch (error) {
        throw new Error(`Failed to resolve hostname: ${hostname}`)
    }
}

/**
 * SSRF-Safe Fetch Wrapper
 * Validates the destination IP before making the request
 */
export async function safeFetch(input: string | URL, init?: SafeFetchOptions): Promise<Response> {
    const urlStr = input.toString()
    const url = new URL(urlStr)

    // Logic to allow/block domains
    if (init?.allowedDomains && init.allowedDomains.length > 0) {
        const isAllowed = init.allowedDomains.some(domain =>
            url.hostname === domain || url.hostname.endsWith(`.${domain}`)
        )
        if (!isAllowed) {
            throw new Error(`Domain not allowed: ${url.hostname}`)
        }
    }

    // If private access is explicitly allowed, skip IP checks
    if (init?.allowPrivate) {
        // We still use global fetch, but we bypass the check
        return fetch(input, init)
    }

    // Resolve hostname to IP to check for private ranges (DNS rebinding protection would need more complex handling like custom agents, 
    // but this is a solid first layer for a framework utility)
    const ip = await resolveHostname(url.hostname)

    if (isRestrictedIp(ip)) {
        throw new Error(`Potential SSRF blocked: ${url.hostname} resolves to private IP ${ip}`)
    }

    // In a robust production environment with DNS rebinding attacks in mind, 
    // we would ideally use a custom http agent that connects to the resolved IP directly.
    // For this v0.9.0 release, we enforce the check and then fetch.

    return fetch(input, init)
}
