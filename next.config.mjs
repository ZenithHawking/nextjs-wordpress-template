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
        ],
    },
}

export default nextConfig