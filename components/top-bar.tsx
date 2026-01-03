"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Bell, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./theme-toggle"
import { SidebarCollapseButton } from "./sidebar-collapse-button"
import type { Song } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TopBarProps {
  onSearch?: (query: string) => void
  onNavigateHome?: () => void
  songs?: Song[]
  onViewSong?: (song: Song) => void
}

export function TopBar({ onSearch, onNavigateHome, songs = [], onViewSong }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const suggestions = searchQuery.trim() 
    ? songs.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.artist.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
      setShowSuggestions(false)
    }
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <div className="flex items-center gap-2 flex-1" />
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2 flex-1">
        {/* Botão de Colapso da Sidebar (Desktop Only) */}
        <div className="hidden md:block">
          <SidebarCollapseButton />
        </div>
        
        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar artista ou música..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 bg-muted/50 border-none w-full"
              />
            </div>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
              {suggestions.map((song) => (
                <button
                  key={song.id}
                  className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                  onClick={() => {
                    if (onViewSong) onViewSong(song)
                    setSearchQuery(song.title)
                    setShowSuggestions(false)
                  }}
                >
                  <Music className="w-4 h-4 text-primary" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">{song.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{song.artist}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}