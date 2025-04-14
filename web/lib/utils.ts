import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export const truncate = (
    text: string,
    limit: number,
    options: {
        ellipsis?: string
        trim?: boolean
    } = {}
): string => {
    const { ellipsis = '..', trim = true } = options
    if (!text) return text
    const processedText = trim ? text.trim() : text
    if (processedText.length <= limit) return processedText

    return `${processedText.substring(0, limit)}${ellipsis}`
}
