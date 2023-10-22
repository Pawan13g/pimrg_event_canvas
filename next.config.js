/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '_next',
    images: {
        domains: ["images.unsplash.com", "source.unsplash.com", "localhost"],
    },
    experimental: {
        serverActions: true
    }
}

module.exports = nextConfig
