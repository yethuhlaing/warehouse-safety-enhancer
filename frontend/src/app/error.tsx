"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <div className="container max-w-md px-4">
            <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            </div>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">Error</h1>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Something went wrong!</h2>
            <p className="mb-8 text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified and is
            working to fix the issue.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button onClick={() => reset()} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try again
                </Button>
                <Button variant="outline">
                    <Link href="/dashboard" className="flex gap-2">
                        <Home className="h-4 w-4" />
                        Go home
                    </Link>
                </Button>
            </div>
        </div>
        </div>
    )
}

