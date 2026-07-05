"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useIdle } from "@/contexts/IdleContext";
import { HeroNavbar } from "@/components/layout/HeroNavbar";

interface HeroProps {
  videoUrl?: string | null;
}

export const Hero = ({ videoUrl }: HeroProps) => {
  const { isIdle, isHeroVisible } = useIdle();
  const defaultVideo = "";
  const defaultPoster = "";

  const currentVideoUrl = videoUrl || defaultVideo;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;

      if (isHeroVisible) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Autoplay was prevented:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentVideoUrl, isMuted, isHeroVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && !isHeroVisible) {
      video.pause();
    }
  }, [isHeroVisible]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="relative w-full">
      {/* HeroNavbar sits in the whitespace above the video */}
      <HeroNavbar />
      <div>
        {/* Aspect ratio: taller on mobile, wider on desktop */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <div className="absolute inset-0 z-0 bg-primary-bg overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-blue/15 blur-[80px]" />
              <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent-gold/8 blur-[100px]" />
            </div>
            <video
              ref={videoRef}
              key={currentVideoUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="object-cover w-full h-full"
              poster={!videoUrl ? defaultPoster : undefined}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={currentVideoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Video Control Buttons — bottom-right of the video, behind menu */}
      <div className={`absolute bottom-4 sm:bottom-6 right-4 sm:right-8 z-20 flex flex-col items-center gap-3 transition-opacity duration-700 ${isIdle ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-[background-color,color] duration-200 active:scale-90"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <button
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-[background-color,color] duration-200 active:scale-90 ${isMuted ? "animate-flicker" : ""}`}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </section>
  );
};
