import { useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    browserLocalPersistence,
    setPersistence,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const provider = new GoogleAuthProvider()

type UseAuthReturn = {
    user: User | null
    isAuthenticated: boolean
    login: () => Promise<void>
    logout: () => Promise<void>
    finishedAuth: boolean
    setToken: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [finishedAuth, setIsFinishedAuth] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setIsAuthenticated(true)
                setUser(firebaseUser ?? null)
            }
            setIsFinishedAuth(true)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (!user) return

        return () => setToken()
    }, [user])

    const login = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence)
            await signInWithPopup(auth, provider)
        } catch (err) {
            console.error('Login error:', err)
        }
    }

    const logout = async () => {
        router.push('/login')
        await signOut(auth)
        setIsAuthenticated(false)
        setUser(null)
    }

    const setToken = async () => {
        if (!user) return
        try {
            const idToken = await user.getIdToken(true)

            const result = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-token`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: idToken }),
                    credentials: 'include',
                }
            )

            if (!result.ok) {
                const errorData = await result.json()
                throw new Error(errorData.message || 'Failed to set token')
            }

            setIsAuthenticated(true)
        } catch (e) {
            console.error('Token error:', e)
            toast.warning('Session expired. Please sign in again.')
            await logout()
        }
    }

    return { user, isAuthenticated, login, logout, finishedAuth, setToken }
}
