import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Candidate } from '@/type'
import Image from 'next/image'

export function CandidateAvatar({ candidate }: { candidate: Candidate }) {
    const source = `/images/candidates/2025/senate/${candidate.code}.png`

    return (
        <Avatar className="h-20 w-20">
            <AvatarImage asChild src={source}>
                <Image
                    src={source}
                    alt={candidate.name}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="object-cover"
                />
            </AvatarImage>
            <AvatarFallback>{candidate.placement}</AvatarFallback>
        </Avatar>
    )
}
