import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Github, Globe, Youtube, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/layouts/main-layout'

export default function AboutPage() {
    return (
        <MainLayout>
            <div className="space-y-10">
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                        src="https://www.youtube.com/embed/19g66ezsKAg"
                        className="w-full h-full"
                        title="My Dev Journey"
                        allowFullScreen
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-medium flex items-center gap-2">
                        <Github className="h-5 w-5" />
                        Web Arch
                    </h2>
                    <Image
                        src="/images/web-architecture.png"
                        alt="Web Architecture Diagram"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-md mt-3"
                    />
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <div className="space-y-6">
                        <h2 className="text-xl font-medium flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            Check Out the Code
                        </h2>

                        <Link
                            href="https://github.com/bastilavarias/iBoto"
                            target="_blank"
                            className="block"
                        >
                            <Card className="h-full hover:border-primary transition-colors">
                                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4">
                                    <Github className="h-8 w-8 text-primary flex-shrink-0" />
                                    <div className="w-full">
                                        <h3 className="text-xl font-bold">
                                            iBoto
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

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
            </div>
        </MainLayout>
    )
}
