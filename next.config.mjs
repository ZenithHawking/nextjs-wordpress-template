const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vansao.com',
            },
            {
                protocol: 'https',
                hostname: 'api.vansao.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
        ],
    },
}

export default nextConfig