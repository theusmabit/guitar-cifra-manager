"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Bell, Music, Menu, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./theme-toggle"
import { SidebarCollapseButton } from "./sidebar-collapse-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Song } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TopBarProps {
  onSearch?: (query: string) => void
  onNavigateHome?: () => void
  onNavigate?: (view: any) => void
  currentView?: string
  songs?: Song[]
  onViewSong?: (song: Song) => void
  selectedFolder?: string | null
  onAddSongToFolder?: (songId: string, folderId: string) => void
}

export function TopBar({ onSearch, onNavigateHome, onNavigate, currentView, songs = [], onViewSong, selectedFolder, onAddSongToFolder }: TopBarProps) {
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
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-card border-border">
              <DropdownMenuItem onClick={() => onNavigate?.("home")}>Home</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("library")}>Library</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("favorites")}>Favorites</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("folders")}>Folders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.("add")} className="text-primary font-medium">Add Song</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 bg-muted/50 border-none w-full h-9 text-sm"
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
                    if (selectedFolder && onAddSongToFolder) {
                      onAddSongToFolder(song.id, selectedFolder)
                      setSearchQuery("")
                    } else if (onViewSong) {
                      onViewSong(song)
                      setSearchQuery(song.title)
                    }
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
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hidden sm:flex"
          onClick={() => onNavigate?.("add")}
        >
          <Plus className="w-5 h-5" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}