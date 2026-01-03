"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Song } from "@/lib/types"

interface MusicPlayerProps {
  song: Song
  audioUrl?: string
}

export function MusicPlayer({ song, audioUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="rounded-sm border-border shadow-none bg-card">
      <audio ref={audioRef} src={audioUrl || `/placeholder-audio.mp3`} />
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Controls Group */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleSkip(-5)}
              disabled={!audioUrl && true}
            >
              <SkipBack className="w-3.5 h-3.5" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0 bg-primary hover:bg-primary/90"
              onClick={togglePlay}
              disabled={!audioUrl && true}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleSkip(5)}
              disabled={!audioUrl && true}
            >
              <SkipForward className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Timeline / Progress Group */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-[10px] text-muted-foreground font-mono w-8 shrink-0">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1 h-1.5"
            />
            <span className="text-[10px] text-muted-foreground font-mono w-8 shrink-0">{formatTime(duration)}</span>
          </div>

          {/* Vertical Volume Popover */}
          <div className="shrink-0 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <Popover>
              <PopoverTrigger asChild>
                <div className="h-8 w-2 bg-secondary/50 rounded-full cursor-pointer relative overflow-hidden group hover:bg-secondary transition-colors border border-border/50">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary/60 transition-all group-hover:bg-primary"
                    style={{ height: `${volume}%` }}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-12 p-3 bg-card border-border shadow-lg">
                <div className="h-32 flex flex-col items-center gap-2">
                  <Slider
                    orientation="vertical"
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(v) => setVolume(v[0])}
                    className="h-full"
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{volume}%</span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
