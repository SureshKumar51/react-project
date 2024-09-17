/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  settings: {
    cors: {
      origin: ['http://localhost:3000'], // or your frontend domain
    },
  },
  webpack: (config, { isServer }) => {
    // Ensure ES modules support
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Example: custom rule or loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1338',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
}

module.exports = nextConfig
