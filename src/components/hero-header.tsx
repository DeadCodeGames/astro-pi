"use client"

import { useEffect, useRef } from "react"
import { initStarAnimation } from "@/utils/star-animation"

export default function HeroHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initStarAnimation(canvasRef.current)
      return cleanup
    }
  }, [])

  return (
    <header className="relative h-[50vh] flex items-center justify-center overflow-hidden font-noto after:content after:absolute after:bottom-0 after:h-[128px] after:w-full after:bg-[linear-gradient(0deg,rgb(10,10,30),transparent)] select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">AstroPi Challenge</h1>
        <p className="text-lg md:text-xl mb-4">
          Riešenie tímu <span className="font-montserrat font-bold">××</span> <span className="font-uniSansCAPS font-bold">DEADCODE</span>
        </p>
      </div>
    </header>
  )
}

