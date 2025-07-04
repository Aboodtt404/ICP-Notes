const path = require('path');
const fs = require('fs');

const network = process.env.DFX_NETWORK || 'local';

let canisterIds;
try {
  const canisterIdsPath = path.resolve(__dirname, '..', '..', '.dfx', network, 'canister_ids.json');
  canisterIds = JSON.parse(fs.readFileSync(canisterIdsPath, 'utf8'));
} catch (e) {
  console.error('Could not read canister IDs:', e);
  canisterIds = {};
}

const getHost = () => {
  if (network === 'ic') {
    return 'https://icp-api.io';
  }
  // Local or other networks
  return 'http://127.0.0.1:4943';
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: 'dist',
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Handle WebAssembly modules for IC SDK
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
  env: {
    NEXT_PUBLIC_NOTES_BACKEND_CANISTER_ID: canisterIds.notes_backend?.[network],
    NEXT_PUBLIC_DFX_NETWORK: network,
    NEXT_PUBLIC_IC_HOST: getHost(),
  },
}

module.exports = nextConfig 