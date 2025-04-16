'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function LoginContent() {
    const { user, login } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await login()
            if (user) {
                router.push('/dashboard')
                setIsLoading(false)
            }
        } catch (e) {
            router.push('/login')
            console.error(e)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
            <Card className="shadow-lg border-gray-200">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                        Sign In
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to access the iBoto
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-700">
                            This is a demo application. Your email will not be
                            stored in any database and is only kept locally in
                            your browser.
                        </AlertDescription>
                    </Alert>

                    <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 h-12"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="border-2 border-gray-300 border-t-gray-600 rounded-full w-5 h-5 animate-spin"></div>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 186.69 190.5"
                            >
                                <g transform="translate(1184.583 765.171)">
                                    <path
                                        d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                                        fill="#4285f4"
                                    />
                                    <path
                                        d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                                        fill="#34a853"
                                    />
                                    <path
                                        d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                                        fill="#fbbc05"
                                    />
                                    <path
                                        d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                                        fill="#ea4335"
                                    />
                                </g>
                            </svg>
                        )}
                        <span>
                            {isLoading
                                ? 'Signing in...'
                                : 'Sign in with Google'}
                        </span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
