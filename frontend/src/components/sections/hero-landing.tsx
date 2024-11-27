import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
    const { stargazers_count: stars } = await fetch(
        "https://api.github.com/repos/mickasmt/next-saas-stripe-starter",
        {
            ...(env.NEXTAUTH_GITHUB_ID && {
                headers: {
                    Authorization: `Bearer ${process.env.NEXTAUTH_GITHUB_ID}`,
                    "Content-Type": "application/json",
                },
            }),
            // data will revalidate every hour
            next: { revalidate: 3600 },
        },
    )
        .then((res) => res.json())
        .catch((e) => console.log(e));

    return (
        <section className="space-y-6 py-12 sm:py-20 lg:py-20">
            <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
                <Link
                    href="https://twitter.com/miickasmt/status/1810465801649938857"
                    className={cn(
                        buttonVariants({
                            variant: "outline",
                            size: "sm",
                            rounded: "full",
                        }),
                        "px-4",
                    )}
                    target="_blank"
                >
                    <span className="mr-3">🎉</span>
                    <span className="hidden md:flex">
                        Introducing&nbsp;
                    </span>{" "}
                    transformative impact on warehouse management{" "}
                </Link>

                <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
                    Revolutionize warehouse safety with{" "}
                    <span className="text-gradient_indigo-purple font-extrabold">
                        SenseIQ
                    </span>
                </h1>

                <p
                    className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
                    style={{
                        animationDelay: "0.35s",
                        animationFillMode: "forwards",
                    }}
                >
                    Our cutting-edge platform provides 3D mapping, predictive risk assessment, and multilingual safety insights, ensuring a secure environment for your team and optimizing your operations.
                </p>

                <div
                    className="flex justify-center space-x-2 md:space-x-4"
                    style={{
                        animationDelay: "0.4s",
                        animationFillMode: "forwards",
                    }}
                >
                    <Link
                        href="/pricing"
                        prefetch={true}
                        className={cn(
                            buttonVariants({ size: "lg", rounded: "full" }),
                            "gap-2",
                        )}
                    >
                        <span>Go Pricing</span>
                        <Icons.arrowRight className="size-4" />
                    </Link>
                    <Link
                        href='/login'
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "lg",
                                rounded: "full",
                            }),
                            "px-5",
                        )}
                    >
                        <p>
                            Get Started{" "}
                        </p>
                    </Link>
                </div>
            </div>
        </section>
    );
}
