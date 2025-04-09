'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart, Search, Clock, Clock4 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Candidate {
    id: number
    name: string
    party: string
    votes: number
}

export function ResultContent() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)

    useEffect(() => {
        // Load results data
        const loadResults = () => {
            setLoading(true)

            // Get stored results
            const storedResults = localStorage.getItem('mockElectionResults')
            const votesData = storedResults ? JSON.parse(storedResults) : {}

            // Extract last updated timestamp
            if (votesData.lastUpdated) {
                setLastUpdated(votesData.lastUpdated)
                delete votesData.lastUpdated
            }

            // Create candidate list with votes
            const candidateList: Candidate[] = [
                { id: 1, name: 'ABALOS, BENHUR', party: 'PFP', votes: 0 },
                { id: 2, name: 'ADONIS, JEROME', party: 'MKBYN', votes: 0 },
                { id: 3, name: 'AMAD, WILSON', party: 'IND', votes: 0 },
                { id: 4, name: 'ANDAMO, NARS ALYN', party: 'MKBYN', votes: 0 },
                { id: 5, name: 'AQUINO, BAM', party: 'KNP', votes: 0 },
                { id: 6, name: 'ARAMBULO, RONNEL', party: 'MKBYN', votes: 0 },
                { id: 7, name: 'ARELLANO, ERNESTO', party: 'KTPNAN', votes: 0 },
                { id: 8, name: 'BALLON, ROBERTO', party: 'IND', votes: 0 },
                { id: 9, name: 'BINAY, ABBY', party: 'NPC', votes: 0 },
                { id: 10, name: 'BONDOC, JIMMY', party: 'PDPLBN', votes: 0 },
                {
                    id: 11,
                    name: 'BORJA REVILLA, RAMON, JR.',
                    party: 'LAKAS',
                    votes: 0,
                },
                { id: 12, name: 'BOSITA, COLONEL', party: 'IND', votes: 0 },
                { id: 13, name: 'BROSAS, ARLENE', party: 'MKBYN', votes: 0 },
                { id: 14, name: 'CABONEGRO, ROY', party: 'DPP', votes: 0 },
                { id: 15, name: 'CAPUYAN, ALLEN', party: 'PPP', votes: 0 },
                { id: 16, name: 'CASIÑO, TEDDY', party: 'MKBYN', votes: 0 },
                {
                    id: 17,
                    name: 'CASTRO, TEACHER FRANCE',
                    party: 'MKBYN',
                    votes: 0,
                },
                { id: 18, name: 'CAYETANO, PIA', party: 'NP', votes: 0 },
                { id: 19, name: "D'ANGELO, DAVID", party: 'BUMYOG', votes: 0 },
                {
                    id: 20,
                    name: 'DE ALBAN, ATTORNEY ANGELO',
                    party: 'IND',
                    votes: 0,
                },
                { id: 21, name: 'DE GUZMAN, KA LEODY', party: 'PLM', votes: 0 },
                { id: 22, name: 'DELA ROSA, BATO', party: 'PDPLBN', votes: 0 },
                {
                    id: 23,
                    name: 'DOMINGO, NANAY MIMI',
                    party: 'MKBYN',
                    votes: 0,
                },
                { id: 24, name: 'ESCOBAL, ARNEL', party: 'PM', votes: 0 },
                { id: 25, name: 'ESPIRITU, LUKE', party: 'PLM', votes: 0 },
                {
                    id: 26,
                    name: 'FLORANDA, MODY PISTON',
                    party: 'MKBYN',
                    votes: 0,
                },
                { id: 27, name: 'GAMBOA, MARC LOUIE', party: 'IND', votes: 0 },
                { id: 28, name: 'GO, BONG GO', party: 'PDPLBN', votes: 0 },
                { id: 29, name: 'GONZALES, NORBERTO', party: 'PDP', votes: 0 },
                { id: 30, name: 'HINLO, JAYVEE', party: 'PDPLBN', votes: 0 },
                { id: 31, name: 'HONASAN, GRINGO', party: 'RP', votes: 0 },
                { id: 32, name: 'JOSE, RELLY JR.', party: 'KBL', votes: 0 },
                { id: 33, name: 'LACSON, PING', party: 'IND', votes: 0 },
                { id: 34, name: 'LAMBINO, RAUL', party: 'NP', votes: 0 },
                { id: 35, name: 'LAPID, LITO', party: 'NPC', votes: 0 },
                {
                    id: 36,
                    name: 'LEE, MANOY WILBERT',
                    party: 'AKSYON',
                    votes: 0,
                },
                { id: 37, name: 'LIDASAN, AMIRAH', party: 'MKBYN', votes: 0 },
                { id: 38, name: 'MARCOLETA, RODANTE', party: 'IND', votes: 0 },
                { id: 39, name: 'MARCOS, IMEE R.', party: 'NP', votes: 0 },
                { id: 40, name: 'MARQUEZ, NORMAN', party: 'IND', votes: 0 },
                { id: 41, name: 'MARTINEZ, ERIC', party: 'IND', votes: 0 },
                { id: 42, name: 'MATA, DOC MARITES', party: 'IND', votes: 0 },
                { id: 43, name: 'MATULA, ATTY. SONNY', party: 'WPP', votes: 0 },
                { id: 44, name: 'MAZA, LIZA', party: 'MKBYN', votes: 0 },
                { id: 45, name: 'MENDOZA, HEIDI', party: 'IND', votes: 0 },
                { id: 46, name: 'MONTEMAYOR, JOEY', party: 'IND', votes: 0 },
                { id: 47, name: 'MUSTAPHA, SUBAIR', party: 'WPP', votes: 0 },
                { id: 48, name: 'OLIVAR, JOSE JESSIE', party: 'IND', votes: 0 },
                { id: 49, name: 'ONG, DOC WILLIE', party: 'AKSYON', votes: 0 },
                {
                    id: 50,
                    name: 'PACQUIAO, MANNY PACMAN',
                    party: 'PFP',
                    votes: 0,
                },
                { id: 51, name: 'PANGILINAN, KIKO', party: 'LP', votes: 0 },
                {
                    id: 52,
                    name: 'QUERUBIN, ARIEL PORFIRIO',
                    party: 'NP',
                    votes: 0,
                },
                { id: 53, name: 'QUIBOLOY, APOLLO', party: 'IND', votes: 0 },
                { id: 54, name: 'RAMOS, DANILO', party: 'MKBYN', votes: 0 },
                {
                    id: 55,
                    name: 'REVILLAME, WILLIE WIL',
                    party: 'IND',
                    votes: 0,
                },
                {
                    id: 56,
                    name: 'RODRIGUEZ, ATTY. VIC',
                    party: 'IND',
                    votes: 0,
                },
                { id: 57, name: 'SAHIDULLA, NUR-ANA', party: 'IND', votes: 0 },
                {
                    id: 58,
                    name: 'SALVADOR, PHILLIP IPE',
                    party: 'PDPLBN',
                    votes: 0,
                },
                { id: 59, name: 'SOTTO, TITO', party: 'NPC', votes: 0 },
                {
                    id: 60,
                    name: 'TAPADO, MICHAEL BONGBONG',
                    party: 'PM',
                    votes: 0,
                },
                {
                    id: 61,
                    name: 'TOLENTINO, FRANCIS TOL',
                    party: 'PFP',
                    votes: 0,
                },
                { id: 62, name: 'TULFO, BEN BITAG', party: 'IND', votes: 0 },
                { id: 63, name: 'TULFO, ERWIN', party: 'LAKAS', votes: 0 },
                {
                    id: 64,
                    name: 'VALBUENA, MAR MANIBELA',
                    party: 'IND',
                    votes: 0,
                },
                { id: 65, name: 'VERCELES, LEANDRO', party: 'IND', votes: 0 },
                { id: 66, name: 'VILLAR, CAMILLE', party: 'NP', votes: 0 },
            ]

            // Update votes from stored data
            candidateList.forEach((candidate) => {
                if (votesData[candidate.id]) {
                    candidate.votes = votesData[candidate.id]
                } else {
                    // Add some random votes for demonstration
                    candidate.votes = Math.floor(Math.random() * 1000)
                }
            })

            setCandidates(candidateList)
            setLoading(false)
        }

        loadResults()
    }, [])

    const filteredCandidates = candidates.filter(
        (candidate) =>
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sortedByVotes = [...filteredCandidates].sort(
        (a, b) => b.votes - a.votes
    )
    const sortedByName = [...filteredCandidates].sort((a, b) =>
        a.name.localeCompare(b.name)
    )
    const sortedById = [...filteredCandidates].sort((a, b) => a.id - b.id)

    // Get top 12 candidates
    const top12 = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 12)

    // Calculate max votes for bar width
    const maxVotes = Math.max(...candidates.map((c) => c.votes))

    const content = (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Election Results
                </h1>
                <p className="text-gray-500 flex items-center">
                    <Clock4 className="h-5 w-5 mr-1" />
                    Updated 5 minutes ago...
                </p>
            </div>

            {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                        Last updated:{' '}
                        {format(
                            parseISO(lastUpdated),
                            "MMMM d, yyyy 'at' h:mm a"
                        )}
                    </span>
                </div>
            )}

            <Card className="shadow-md">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Leading 12 Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {top12.map((candidate, index) => (
                                <div
                                    key={candidate.id}
                                    className="flex items-center gap-3 p-3 border rounded-md bg-white"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage
                                                    src="/placeholder.png"
                                                    alt={candidate.name}
                                                />
                                                <AvatarFallback>
                                                    {candidate.name}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {candidate.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ({candidate.party})
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <div className="h-2 bg-green-100 rounded-full w-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{
                                                            width: `${(candidate.votes / maxVotes) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium">
                                                    {candidate.votes.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader className="border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>All Candidates</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search candidate"
                                className="pl-8 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pb-5">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <Tabs defaultValue="votes" className="w-full">
                            <div className="px-4">
                                <TabsList className="h-12">
                                    <TabsTrigger value="votes">
                                        Sort by Votes
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="votes" className="p-0">
                                <div className="p-4 space-y-2">
                                    {sortedByVotes.map((candidate, index) => (
                                        <div
                                            key={candidate.id}
                                            className="flex items-center gap-3 p-3 border rounded-md bg-white"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <Avatar className="h-full w-full">
                                                        <AvatarImage
                                                            src="/placeholder.png"
                                                            alt={candidate.name}
                                                        />
                                                        <AvatarFallback>
                                                            {candidate.name}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                        <div>
                                                            <p className="font-medium">
                                                                {candidate.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                (
                                                                {
                                                                    candidate.party
                                                                }
                                                                )
                                                            </p>
                                                        </div>
                                                        <div className="text-lg font-bold text-green-700">
                                                            {candidate.votes.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{
                                                                    width: `${(candidate.votes / maxVotes) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="name" className="p-0">
                                <ScrollArea className="h-[60vh]">
                                    <div className="p-4 space-y-2">
                                        {sortedByName.map((candidate) => (
                                            <div
                                                key={candidate.id}
                                                className="flex items-center gap-3 p-3 border rounded-md bg-white"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <Avatar className="h-full w-full">
                                                            <AvatarImage
                                                                src="/placeholder.png"
                                                                alt={
                                                                    candidate.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {candidate.name}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        candidate.name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    (
                                                                    {
                                                                        candidate.party
                                                                    }
                                                                    )
                                                                </p>
                                                            </div>
                                                            <div className="text-lg font-bold text-green-700">
                                                                {candidate.votes.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="number" className="p-0">
                                <ScrollArea className="h-[60vh]">
                                    <div className="p-4 space-y-2">
                                        {sortedById.map((candidate) => (
                                            <div
                                                key={candidate.id}
                                                className="flex items-center gap-3 p-3 border rounded-md bg-white"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold text-sm flex-shrink-0">
                                                    {candidate.id}
                                                </div>
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <Avatar className="h-full w-full">
                                                            <AvatarImage
                                                                src="/placeholder.png"
                                                                alt={
                                                                    candidate.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {candidate.name}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        candidate.name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    (
                                                                    {
                                                                        candidate.party
                                                                    }
                                                                    )
                                                                </p>
                                                            </div>
                                                            <div className="text-lg font-bold text-green-700">
                                                                {candidate.votes.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    return content
}
