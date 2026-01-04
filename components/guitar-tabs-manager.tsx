"use client"

import { useState, useEffect, useMemo } from "react"
import { Library } from "./library"
import { SongViewer } from "./song-viewer"
import { AddSong } from "./add-song"
import { AppSidebar } from "./app-sidebar"
import { SettingsView } from "./settings-view"
import { Homepage } from "./homepage"
import { TopBar } from "./top-bar"
import { FolderView } from "./folder-view"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type { Song, Folder } from "@/lib/types"
import { getMockSongs, saveSongs, loadSongs, saveFolders, loadFolders, migrateGuestDataToUser } from "@/lib/storage"
import { useAuth } from "@/hooks/use-auth"

export function GuitarTabsManager() {
  const [songs, setSongs] = useState<Song[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<
    "home" | "library" | "favorites" | "folders" | "add" | "settings" | "song" | "folder-detail"
  >("home")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    genre: "",
    artist: "",
    key: "",
  })
  const { user, loading: authLoading } = useAuth()

  // Migrar dados do guest para user quando usuário faz login
  useEffect(() => {
    async function handleUserLogin() {
      if (user?.id && !authLoading) {
        await migrateGuestDataToUser(user.id)
        // Recarregar dados após migração
        const loadedSongs = await loadSongs()
        const loadedFolders = await loadFolders()
        setSongs(loadedSongs)
        setFolders(loadedFolders)
      }
    }
    handleUserLogin()
  }, [user?.id, authLoading])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const loadedSongs = await loadSongs()
        const loadedFolders = await loadFolders()

        if (loadedSongs.length === 0) {
          const mockSongs = getMockSongs()
          setSongs(mockSongs)
          await saveSongs(mockSongs)
        } else {
          // Garantir que não existam IDs duplicados nos dados carregados
          const uniqueSongs = Array.from(new Map(loadedSongs.map(s => [s.id, s])).values())
          setSongs(uniqueSongs)
        }

        setFolders(loadedFolders)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Evita salvar durante o carregamento inicial
    if (isLoading) return

    async function persistSongs() {
      try {
        await saveSongs(songs)
      } catch (error) {
        console.error("Erro ao salvar músicas:", error)
      }
    }

    if (songs.length > 0) {
      persistSongs()
    }
  }, [songs, isLoading])

  useEffect(() => {
    // Evita salvar durante o carregamento inicial
    if (isLoading) return

    async function persistFolders() {
      try {
        await saveFolders(folders)
      } catch (error) {
        console.error("Erro ao salvar pastas:", error)
      }
    }

    if (folders.length > 0) {
      persistFolders()
    }
  }, [folders, isLoading])

  const handleAddSong = (song: Song) => {
    setSongs([...songs, song])
    setCurrentView("library")
  }

  const handleToggleFavorite = (songId: string) => {
    setSongs(songs.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s)))
    if (selectedSong?.id === songId) {
      setSelectedSong({ ...selectedSong, isFavorite: !selectedSong.isFavorite })
    }
  }

  const handleDeleteSong = (songId: string) => {
    setSongs(songs.filter((s) => s.id !== songId))
    if (selectedSong?.id === songId) {
      setSelectedSong(null)
      setCurrentView("library")
    }
  }

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs(songs.map((s) => (s.id === updatedSong.id ? updatedSong : s)))
    setSelectedSong(updatedSong)
  }

  const handleViewSong = (song: Song) => {
    setSelectedSong(song)
    setCurrentView("song")
  }

  const handleArtistClick = (artist: string) => {
    setSearchQuery("")
    setFilters({ genre: "", artist: artist, key: "" })
    setCurrentView("library")
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery("")
    setFilters({ genre: tag, artist: "", key: "" })
    setCurrentView("library")
  }

  const handleKeyClick = (key: string) => {
    setSearchQuery("")
    setFilters({ genre: "", artist: "", key: key })
    setCurrentView("library")
  }

  const handleAddFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      songIds: [],
    }
    setFolders([...folders, newFolder])
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter((f) => f.id !== folderId))
    if (selectedFolder === folderId) setSelectedFolder(null)
  }

  const handleAddSongToFolder = (songId: string, folderId: string) => {
    setFolders(folders.map((f) => (f.id === folderId ? { ...f, songIds: [...f.songIds, songId] } : f)))
  }

  const handleRemoveSongFromFolder = (songId: string, folderId: string) => {
    setFolders(folders.map((f) => (f.id === folderId ? { ...f, songIds: f.songIds.filter((id) => id !== songId) } : f)))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters({ genre: "", artist: "", key: "" })
    if (query.trim()) setCurrentView("library")
  }

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs
    const query = searchQuery.toLowerCase()
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [songs, searchQuery])

  const favoriteSongs = useMemo(() => songs.filter((s) => s.isFavorite), [songs])

  const folderSongs = useMemo(() => {
    if (!selectedFolder) return []
    const folder = folders.find((f) => f.id === selectedFolder)
    if (!folder) return []
    return songs.filter((s) => folder.songIds.includes(s.id))
  }, [selectedFolder, folders, songs])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      )
    }

    switch (currentView) {
      case "home":
        return (
          <Homepage
            songs={songs}
            favoriteSongs={favoriteSongs}
            folders={folders}
            onViewSong={handleViewSong}
            onNavigate={setCurrentView}
            onArtistClick={handleArtistClick}
            onTagClick={handleTagClick}
            onKeyClick={handleKeyClick}
          />
        )
      case "library":
        return (
          <Library
            songs={searchQuery ? filteredSongs : songs}
            onViewSong={handleViewSong}
            onToggleFavorite={handleToggleFavorite}
            onDeleteSong={handleDeleteSong}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            title={searchQuery ? `Resultados para "${searchQuery}"` : "Todas as Músicas"}
            initialFilters={filters}
            onArtistClick={handleArtistClick}
            onTagClick={handleTagClick}
            onKeyClick={handleKeyClick}
          />
        )
      case "favorites":
        return (
          <Library
            songs={favoriteSongs}
            onViewSong={handleViewSong}
            onToggleFavorite={handleToggleFavorite}
            onDeleteSong={handleDeleteSong}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            title="Favoritos"
            initialFilters={filters}
            onArtistClick={handleArtistClick}
            onTagClick={handleTagClick}
            onKeyClick={handleKeyClick}
          />
        )
      case "folders":
        return (
          <FolderView
            folders={folders}
            songs={songs}
            onSelectFolder={(id) => {
              setSelectedFolder(id)
              setCurrentView("folder-detail")
            }}
            onAddFolder={handleAddFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        )
      case "folder-detail":
        const currentFolder = folders.find(f => f.id === selectedFolder)
        return (
          <Library
            songs={folderSongs}
            onViewSong={handleViewSong}
            onToggleFavorite={handleToggleFavorite}
            onDeleteSong={handleDeleteSong}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            onRemoveSongFromFolder={handleRemoveSongFromFolder}
            selectedFolder={selectedFolder}
            title={currentFolder?.name || "Pasta"}
            hideSearch
            initialFilters={filters}
            onArtistClick={handleArtistClick}
            onTagClick={handleTagClick}
            onKeyClick={handleKeyClick}
          />
        )
      case "add":
        return <AddSong onAddSong={handleAddSong} onImportSongs={(s) => setSongs([...songs, ...s])} />
      case "song":
        return selectedSong ? (
          <SongViewer
            song={selectedSong}
            onUpdateSong={handleUpdateSong}
            onBack={() => setCurrentView("library")}
            folders={folders}
            onAddSongToFolder={handleAddSongToFolder}
            onNavigateToFolder={(folderId) => {
              setSelectedFolder(folderId)
              setCurrentView("folder-detail")
            }}
            onArtistClick={handleArtistClick}
            onTagClick={handleTagClick}
            onKeyClick={handleKeyClick}
          />
        ) : null
      case "settings":
        return (
          <SettingsView
            songs={songs}
            folders={folders}
            onDataImported={(importedSongs, importedFolders) => {
              setSongs(importedSongs)
              setFolders(importedFolders)
            }}
            onDataCleared={() => {
              setSongs([])
              setFolders([])
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onNavigate={setCurrentView} />
      <SidebarInset>
        <TopBar 
          onSearch={handleSearch} 
          onNavigateHome={() => setCurrentView("home")} 
          songs={songs} 
          onViewSong={handleViewSong}
          selectedFolder={currentView === "folder-detail" ? selectedFolder : null}
          onAddSongToFolder={handleAddSongToFolder}
        />
        <main className="flex flex-1 flex-col">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}