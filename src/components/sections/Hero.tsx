"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useIdle } from "@/contexts/IdleContext";

interface HeroProps {
  videoUrl?: string | null;
  mobileVideoUrl?: string | null;
}

export const Hero = ({ videoUrl, mobileVideoUrl }: HeroProps) => {
  const { isIdle, isHeroVisible } = useIdle();
  const defaultVideo = "https://res.cloudinary.com/demo/video/upload/q_auto:good,f_auto/v1614264627/docs/cld-video-default.mp4";
  const defaultPoster = "https://res.cloudinary.com/demo/video/upload/so_0/v1614264627/video/cld-video-default-poster.jpg";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const effectiveUrl = isMobile && mobileVideoUrl ? mobileVideoUrl : (videoUrl || defaultVideo);
  const currentVideoUrl = effectiveUrl;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Sometimes browsers require muted property to be set directly on the element for autoplay
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
    <section className="relative min-h-screen flex items-end pb-8 sm:pb-16 overflow-hidden">
      {/* Background Video & Ambient Lighting */}
      <div className="absolute inset-0 z-0 bg-primary-bg overflow-hidden">
        {/* Reduced glow divs — smaller radii, lower opacity */}
        <div className="absolute inset-0 opacity-30 mix-blend-screen">
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

      {/* Video Control Buttons — bottom-right */}
      <div className={`absolute bottom-24 sm:bottom-28 right-4 sm:right-8 z-50 flex flex-col items-center gap-3 transition-opacity duration-700 ${isIdle ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
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
