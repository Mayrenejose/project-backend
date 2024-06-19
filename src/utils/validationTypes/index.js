export const isType = (value, type) => {
    switch (type) {
        case 'string':
            return typeof value === 'string'
        case 'number':
            return typeof value === 'number'
        case 'boolean':
            return typeof value === 'boolean'
        case 'array':
            return Array.isArray(value) && value.every(item => typeof item === 'string')
        default:
            return false
    }
}