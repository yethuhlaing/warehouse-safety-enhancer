import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <div className="container max-w-md px-4">
            <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            </div>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">404</h1>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Page not found</h2>
            <p className="mb-8 text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been removed, had its name changed,
            or is temporarily unavailable.
            </p>
            <Button className="min-w-[160px]">
                <Link href="/">Go back home</Link>
            </Button>
        </div>
        </div>
    )
}

