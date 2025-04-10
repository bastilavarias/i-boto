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

    const checkTokenExpiration = useCallback(async (firebaseUser: User) => {
        try {
            const tokenResult = await getIdTokenResult(firebaseUser)
            const expirationTime = new Date(
                tokenResult.expirationTime
            ).getTime()
            const currentTime = Date.now()

            if (expirationTime <= currentTime) {
                await logout()
                return false
            }

            const timeUntilExpiration = expirationTime - currentTime
            setTimeout(() => logout(), timeUntilExpiration)

            return true
        } catch (error) {
            console.error('Token check error:', error)
            await logout()
            return false
        }
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setIsAuthenticated(true)
                setUser(firebaseUser ?? null)
                console.log(firebaseUser)
            }
            setIsFinishedAuth(true)
        })vote_tallies
        return () => unsubscribe()
    }, [checkTokenExpiration])

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
            await fetch('http://localhost:3333/api/auth/set-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: user?.accessToken }),
                credentials: 'include',
            })
            setIsAuthenticated(true)
        } catch (e) {
            console.error(e)
            await logout()
        }
    }

    return { user, isAuthenticated, login, logout, finishedAuth, setToken }
}
