
/**
 * Safe SQL Query Builder using Tagged Templates
 * Prevents SQL Injection by separating logic from data
 */

export interface SqlQuery {
    text: string
    values: any[]
}

/**
 * Creates a safe SQL query object from a template literal
 * Usage: sql`SELECT * FROM users WHERE id = ${userId}`
 */
// Basic validation for SQL values
function validateValue(value: any): void {
    if (value === undefined) {
        throw new Error('SQL injection error: Undefined value passed to query')
    }
    if (typeof value === 'number' && (!Number.isFinite(value) || Number.isNaN(value))) {
        throw new Error('SQL injection error: Invalid number (NaN or Infinity) passed to query')
    }
    if (typeof value === 'object' && value !== null && !(value instanceof Date) && !Buffer.isBuffer(value)) {
        throw new Error('SQL injection error: Invalid object passed to query (only primitives, Date, and Buffer allowed)')
    }
}

export function sql(strings: TemplateStringsArray, ...values: any[]): SqlQuery {
    let text = strings[0]
    const collectedValues: any[] = []

    for (let i = 0; i < values.length; i++) {
        validateValue(values[i])
        text += `$${i + 1}` + strings[i + 1]
        collectedValues.push(values[i])
    }

    return {
        text,
        values: collectedValues
    }
}

/**
 * Helper to join multiple SQL fragments safely
 */
export function joinSql(fragments: SqlQuery[], separator: string = ', '): SqlQuery {
    if (fragments.length === 0) {
        return { text: '', values: [] }
    }

    const text = fragments.map((f, i) => {
        // Adjust parameter indices for subsequent fragments
        const offset = fragments.slice(0, i).reduce((sum, f) => sum + f.values.length, 0)
        return f.text.replace(/\$(\d+)/g, (_, n) => `$${parseInt(n) + offset}`)
    }).join(separator)

    const values = fragments.flatMap(f => f.values)

    return { text, values }
}
