"use client"

import { useState } from "react"
import { Folder, Plus, Trash2, FolderOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import type { Folder as FolderType, Song } from "@/lib/types"

interface FolderViewProps {
  folders: FolderType[]
  songs: Song[]
  onSelectFolder: (folderId: string) => void
  onAddFolder: (name: string) => void
  onDeleteFolder: (folderId: string) => void
}

export function FolderView({
  folders,
  songs,
  onSelectFolder,
  onAddFolder,
  onDeleteFolder,
}: FolderViewProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName)
      setNewFolderName("")
      setIsCreatingFolder(false)
    }
  }

  return (
    <div className="p-6 pt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">Minhas Pastas</h2>
        <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Nova Pasta
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Criar Nova Pasta</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nome da pasta (ex: Rock Nacional)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              autoFocus
            />
            <DialogFooter>
              <Button
                onClick={handleCreateFolder}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Criar Pasta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
          <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-medium text-muted-foreground">Nenhuma pasta criada</h3>
          <p className="text-sm text-muted-foreground mt-1">Crie pastas para organizar suas músicas por estilo, evento ou banda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => onSelectFolder(folder.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-6 h-6 fill-current" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm("Tem certeza que deseja excluir esta pasta?")) {
                        onDeleteFolder(folder.id)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl mt-4 truncate">{folder.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {folder.songIds.length} {folder.songIds.length === 1 ? 'música' : 'músicas'}
                </p>
              </CardHeader>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors" />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
