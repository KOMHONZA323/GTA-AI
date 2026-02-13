'use client'

import dynamic from 'next/dynamic'

// Dynamically import Three.js component to avoid SSR issues
const CityScene = dynamic(() => import('@/components/CityScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading 3D City...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <CityScene />
}
