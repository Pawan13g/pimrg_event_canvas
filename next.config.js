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
                destination: '/events/recents',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
