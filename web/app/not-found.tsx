import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}
