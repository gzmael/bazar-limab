import { withPayload } from '@payloadcms/next/withPayload'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

let imagePatterns = [
  { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/api/**' },
  { protocol: 'http', hostname: '127.0.0.1', port: '3000', pathname: '/api/**' },
  // Payload + @payloadcms/storage-vercel-blob serves files from Vercel Blob URLs in production.
  {
    protocol: 'https',
    hostname: '*.public.blob.vercel-storage.com',
    pathname: '/**',
  },
]

try {
  const u = new URL(serverUrl)
  if (u.hostname && u.hostname !== 'localhost') {
    imagePatterns = [
      {
        protocol: u.protocol.replace(':', ''),
        hostname: u.hostname,
        pathname: '/api/**',
        ...(u.port ? { port: u.port } : {}),
      },
      ...imagePatterns,
    ]
  }
} catch {
  /* keep localhost default */
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Same-origin Payload uploads (`/api/media/...`) need localPatterns in Next.js 15+.
    localPatterns: [{ pathname: '/api/media/**' }],
    remotePatterns: imagePatterns,
  },
}

export default withPayload(nextConfig)
