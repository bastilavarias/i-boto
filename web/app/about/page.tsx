import { Button } from '@/components/ui/button'
import { Globe, Youtube, Linkedin, Github } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/layouts/main-layout'

export default function AboutPage() {
    return (
        <MainLayout>
            <div className="space-y-5">
                <div className="space-y-3 flex justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dev Log
                    </h1>
                    <div>
                        <Button asChild className="gap-2">
                            <Link
                                target="_blank"
                                href="https://github.com/bastilavarias/iBoto"
                            >
                                <Github className="h-4 w-4" />
                                Source Code
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="aspect-video h-[50vh] md:h-full w-full overflow-hidden rounded-lg space-y-5">
                    <iframe
                        src="https://www.youtube.com/embed/19g66ezsKAg"
                        className="w-full h-full"
                        title="My Dev Journey"
                        allowFullScreen
                    />
                </div>

                <div className="flex justify-between">
                    <div></div>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Link
                                target="_blank"
                                href="https://sebastech.vercel.app/"
                            >
                                <Globe className="h-4 w-4" />
                                Personal Website
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Link
                                target="_blank"
                                href="https://www.youtube.com/@bastilavarias"
                            >
                                <Youtube className="h-4 w-4" />
                                YouTube Channel
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Link
                                target="_blank"
                                href="https://www.linkedin.com/in/sebastian-curtis-lavarias-b20a57175/"
                            >
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
