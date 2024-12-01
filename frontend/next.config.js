const { withContentlayer } = require("next-contentlayer2");

import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', 
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "randomuser.me",
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ["@prisma/client"],
    },
};

module.exports = withContentlayer(nextConfig);
