import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Candidate } from '@/type'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface CandidateAvatarProps {
    candidate: Candidate
    options?: {
        size?: number
        className?: string
    }
}

export function CandidateAvatar({ candidate, options }: CandidateAvatarProps) {
    const source = `/images/candidates/2025/senate/${candidate.code}.png`

    return (
        <Avatar className={cn('h-25 w-25', options?.className)}>
            <AvatarImage asChild src={source}>
                <Image
                    src={source}
                    alt={candidate.name}
                    width={100}
                    height={100}
                    loading="lazy"
                    className="object-cover"
                />
            </AvatarImage>
            <AvatarFallback>{candidate.placement}</AvatarFallback>
        </Avatar>
    )
}
