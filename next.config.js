/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '_next',
    images: {
        domains: ["images.unsplash.com", "source.unsplash.com", "localhost"],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/event',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
