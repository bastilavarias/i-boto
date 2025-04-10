'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    return isAuthenticated ? <>{children}</> : null
}
