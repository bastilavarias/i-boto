import { useEffect, useState, useCallback } from 'react'
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    browserLocalPersistence,
    setPersistence,
    getIdTokenResult,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'

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
        if (user) {
            setToken()
        }
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
        try {
            const result = await fetch(
                'http://localhost:3333/api/auth/set-token',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: user?.accessToken }),
                    credentials: 'include',
                }
            )
            if (!result.ok) {
                throw new Error(result.message)
            }
            setIsAuthenticated(true)
        } catch (e) {
            console.error(e)
            await logout()
        }
    }

    return { user, isAuthenticated, login, logout, finishedAuth, setToken }
}
