// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const provider = new GoogleAuthProvider()

type UseAuthReturn = {
    user: User | null
    login: () => Promise<void>
    logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null)
        })
        return () => unsubscribe()
    }, [])

    const login = async () => {
        await signInWithPopup(auth, provider)
    }

    const logout = async () => {
        await signOut(auth)
    }

    return { user, login, logout }
}
