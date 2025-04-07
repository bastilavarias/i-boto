import { create } from 'zustand'
import { User } from 'firebase/auth'

type AuthState = {
    isAuthenticated: boolean
    user: User | null
    setToken: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    setToken: async (user) => {
        try {
            await fetch('http://localhost:3333/api/auth/set-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: user?.accessToken }),
                credentials: 'include',
            })
            set({ isAuthenticated: true, user })
        } catch (e) {
            console.error(e)
        }
    },
}))
