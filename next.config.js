/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '_next',
    basePath: '/node',
    images: {
        domains: ["images.unsplash.com", "source.unsplash.com"],
    },
}

module.exports = nextConfig
