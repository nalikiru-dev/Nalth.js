
import { lookup } from 'node:dns/promises'
import { URL } from 'node:url'

// Private IP ranges (IPv4 and IPv6)
const PRIVATE_IP_RANGES = [
    // IPv4
    /^127\./,           // localhost
    /^10\./,            // Class A private
    /^172\.(1[6-9]|2\d|3[0-1])\./, // Class B private
    /^192\.168\./,      // Class C private
    /^169\.254\./,      // Link-local
    /^0\./,             // "This" network

    // IPv6
    /^::1$/,            // localhost
    /^fc00:/,           // Unique local address
    /^fe80:/,           // Link-local address
]

export interface SafeFetchOptions extends RequestInit {
    allowPrivate?: boolean
    allowedDomains?: string[]
}

/**
 * Validates if an IP address is private
 */
function isPrivateIp(ip: string): boolean {
    return PRIVATE_IP_RANGES.some(regex => regex.test(ip))
}

/**
 * Resolves a hostname to an IP address
 */
async function resolveHostname(hostname: string): Promise<string> {
    // If it's already an IP, return it
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

    if (isPrivateIp(ip)) {
        throw new Error(`Potential SSRF blocked: ${url.hostname} resolves to private IP ${ip}`)
    }

    // In a robust production environment with DNS rebinding attacks in mind, 
    // we would ideally use a custom http agent that connects to the resolved IP directly.
    // For this v0.9.0 release, we enforce the check and then fetch.

    return fetch(input, init)
}
