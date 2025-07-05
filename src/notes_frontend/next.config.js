/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_DFX_NETWORK: process.env.DFX_NETWORK,
    NEXT_PUBLIC_IC_HOST: process.env.NEXT_PUBLIC_IC_HOST || "http://localhost:4943",
    NEXT_PUBLIC_NOTES_BACKEND_CANISTER_ID: process.env.CANISTER_ID_NOTES_BACKEND,
  },
};

module.exports = nextConfig;``