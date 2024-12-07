import { Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import ms from "ms";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { aggregateData, FormattedAggregateData } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = "/favicon.ico",
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
} = {}): Metadata {
    return {
        title,
        description,
        keywords: [
            "Next.js",
            "React",
            "Prisma",
            "Neon",
            "Auth.js",
            "shadcn ui",
            "Resend",
            "React Email",
            "Stripe",
        ],
        authors: [
            {
                name: "mickasmt",
            },
        ],
        creator: "mickasmt",
        openGraph: {
            type: "website",
            locale: "en_US",
            url: siteConfig.url,
            title,
            description,
            siteName: title,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@miickasmt",
        },
        icons,
        metadataBase: new URL(siteConfig.url),
        manifest: `${siteConfig.url}/site.webmanifest`,
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
export function getCurrentDateTime(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
        month: "long", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: false 
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
}

export function formatDate(input: string | number): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
export function Capitalize(input: string | null) {
    return String(input).charAt(0).toUpperCase() + String(input).slice(1);
}

export function formatSensorDate(startingDate: Date, endingDate: Date): string {

    const startingTime = startingDate ? format(startingDate, 'MMMM dd, hh:mm a') : 'No data available';
    const endingTime = endingDate ? format(endingDate, 'MMMM dd, hh:mm a') : 'No data available';
    const formattedDate = startingTime + " - "  + endingTime
    return formattedDate
}
export function formatAggregateDate(inputDate: Date | undefined): string {

    const inputTime = inputDate ? format(inputDate, 'MMMdd HH:mm') : 'No data available';
    return inputTime
}
export function formatAggregateValue(inputValue: number | undefined): string {
    const aggregateValue = inputValue ? inputValue.toFixed(1).toString() : "( No data available )"
    return aggregateValue
}
export function formatAggregateOutput(type: string ,field: string, aggregateValue: string): string {
    const result = `The ${type} ${field} - ${aggregateValue}`
    return result
} 
export function formatChartData(chartData: aggregateData) {

    const result: FormattedAggregateData = {
        field: '',
        average: '',
        minimum: '',
        maximum: '',
    };

    const meanData = chartData?.meanData
    const minData = chartData?.minData
    const maxData = chartData?.maxData
    const field = meanData?.[0]?._field || minData?.[0]?._field || maxData?.[0]?._field || '';
    result.field = field


    // if (meanData && meanData.length > 0) {
    //     const aggregateTime = formatAggregateDate(meanData?.[meanData.length - 1]?._time)
    //     const aggregateValue = formatAggregateValue(meanData?.[meanData.length - 1]?._value) 
    //     result.average = formatAggregateOutput("Average",field, aggregateValue)
    // }
    // if (minData && minData.length > 0) {
    //     const aggregateTime = formatAggregateDate(minData?.[minData.length-1]?._time)
    //     const aggregateValue = formatAggregateValue(minData?.[minData.length-1]?._value) 
    //     result.minimum = formatAggregateOutput("Minimum", field, aggregateValue)
    // }
    // if (maxData && maxData.length > 0) {
    //     const aggregateTime = formatAggregateDate(maxData?.[maxData.length-1]?._time)
    //     const aggregateValue = formatAggregateValue(maxData?.[maxData.length-1]?._value) 
    //     result.maximum = formatAggregateOutput("Maximum", field, aggregateValue)
    // }

    return result

}
export function absoluteUrl(path: string) {
    return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

// Utils from precedent.dev
export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
    if (!timestamp) return "never";
    return `${ms(Date.now() - new Date(timestamp).getTime())}${
        timeOnly ? "" : " ago"
    }`;
};

export async function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<JSON> {
    const res = await fetch(input, init);

    if (!res.ok) {
        const json = await res.json();
        if (json.error) {
            const error = new Error(json.error) as Error & {
                status: number;
            };
            error.status = res.status;
            throw error;
        } else {
            throw new Error("An unexpected error occurred");
        }
    }

    return res.json();
}

export function nFormatter(num: number, digits?: number) {
    if (!num) return "0";
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") +
              item.symbol
        : "0";
}

export function capitalize(str: string) {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
    if (!str || str.length <= length) return str;
    return `${str.slice(0, length)}...`;
};

export const getBlurDataURL = async (url: string | null) => {
    if (!url) {
        return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    }

    if (url.startsWith("/_static/")) {
        url = `${siteConfig.url}${url}`;
    }

    try {
        const response = await fetch(
            `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`,
        );
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.log(error)
        return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    }
};

export const placeholderBlurhash =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==";
