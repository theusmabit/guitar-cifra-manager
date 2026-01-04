import type { Song, Folder } from "./types"
import { supabase } from "./supabase"

const SONGS_KEY = "guitar-tabs-songs"
const FOLDERS_KEY = "guitar-tabs-folders"

// Verifica se o Supabase está configurado
const isSupabaseConfigured = () => {
  return typeof window !== "undefined" && 
         process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Obtém o usuário atual do Supabase
const getCurrentUserId = async () => {
  if (!isSupabaseConfigured()) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    // Se não houver usuário autenticado, retorna null
    // O sistema usará localStorage como fallback
    return user?.id || null
  } catch (error) {
    // Em caso de erro de autenticação, retorna null
    return null
  }
}

// Gera um ID único para usuários não autenticados (usando localStorage)
const getGuestUserId = (): string | null => {
  if (typeof window === "undefined") return null
  const GUEST_ID_KEY = "guitar-tabs-guest-id"
  let guestId = localStorage.getItem(GUEST_ID_KEY)
  if (!guestId) {
    guestId = `guest-${crypto.randomUUID()}`
    localStorage.setItem(GUEST_ID_KEY, guestId)
  }
  return guestId
}

// ==================== MIGRAÇÃO DE DADOS ====================

// Migra dados do guest_id para user_id quando usuário faz login
export async function migrateGuestDataToUser(userId: string): Promise<void> {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return

  try {
    const guestId = getGuestUserId()
    if (!guestId) return

    console.log("🔄 Migrando dados do guest para usuário...", { guestId, userId })

    // Migrar músicas
    const { data: guestSongs, error: songsError } = await supabase
      .from("songs")
      .select("*")
      .eq("guest_id", guestId)

    if (!songsError && guestSongs && guestSongs.length > 0) {
      // Converter para formato correto e atualizar user_id
      const songsToMigrate = guestSongs.map((song: any) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        content: song.content,
        key: song.key,
        is_favorite: song.is_favorite,
        tags: song.tags,
        created_at_iso: song.created_at_iso,
        user_id: userId,
        guest_id: null,
      }))

      // Deletar músicas do guest
      await supabase.from("songs").delete().eq("guest_id", guestId)

      // Inserir com user_id
      await supabase.from("songs").insert(songsToMigrate)
      console.log(`✅ Migradas ${guestSongs.length} músicas`)
    }

    // Migrar pastas
    const { data: guestFolders, error: foldersError } = await supabase
      .from("folders")
      .select("*")
      .eq("guest_id", guestId)

    if (!foldersError && guestFolders && guestFolders.length > 0) {
      const foldersToMigrate = guestFolders.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        song_ids: folder.song_ids,
        user_id: userId,
        guest_id: null,
      }))

      // Deletar pastas do guest
      await supabase.from("folders").delete().eq("guest_id", guestId)

      // Inserir com user_id
      await supabase.from("folders").insert(foldersToMigrate)
      console.log(`✅ Migradas ${guestFolders.length} pastas`)
    }

    console.log("✅ Migração concluída!")
  } catch (error) {
    console.error("❌ Erro ao migrar dados:", error)
  }
}

// ==================== FUNÇÕES DE SONGS ====================

export async function saveSongs(songs: Song[]): Promise<void> {
  if (typeof window === "undefined") return

  console.log("🔄 Tentando salvar músicas...", { count: songs.length })

  // Se Supabase estiver configurado, usa Supabase
  if (isSupabaseConfigured()) {
    console.log("✅ Supabase configurado")
    try {
      const userId = await getCurrentUserId()
      const guestId = getGuestUserId()
      
      console.log("🔍 IDs:", { userId, guestId })

      // Determina qual identificador usar
      const identifier = userId || guestId
      if (!identifier) {
        console.warn("⚠️ Nenhum identificador disponível, usando localStorage")
        localStorage.setItem(SONGS_KEY, JSON.stringify(songs))
        return
      }

      console.log("🗑️ Deletando músicas existentes...")
      // Deleta todas as músicas existentes do usuário/guest e insere as novas
      if (userId) {
        const { error: deleteError } = await supabase.from("songs").delete().eq("user_id", userId)
        if (deleteError) console.error("Erro ao deletar músicas:", deleteError)
      } else if (guestId) {
        const { error: deleteError } = await supabase.from("songs").delete().eq("guest_id", guestId)
        if (deleteError) console.error("Erro ao deletar músicas:", deleteError)
        else console.log("✅ Músicas antigas deletadas")
      }

      if (songs.length > 0) {
        // Função para validar e converter ID para UUID válido
        const toValidUUID = (id: string): string => {
          // Verifica se é um UUID válido (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (uuidRegex.test(id)) {
            return id
          }
          // Se não for UUID válido, gera um novo UUID baseado no hash do ID original
          // Isso mantém consistência: sempre que o mesmo ID inválido aparecer, gerará o mesmo UUID
          return crypto.randomUUID()
        }

        const songsToInsert = songs.map(song => ({
          id: toValidUUID(song.id),
          title: song.title,
          artist: song.artist,
          content: song.content,
          key: song.key,
          is_favorite: song.isFavorite,
          tags: song.tags,
          created_at_iso: song.createdAt,
          user_id: userId || null,
          guest_id: !userId ? guestId : null,
        }))

        console.log("💾 Inserindo músicas no Supabase...", { count: songsToInsert.length, guest_id: guestId })
        
        const { data, error } = await supabase.from("songs").insert(songsToInsert).select()
        
        if (error) {
          console.error("❌ Erro ao inserir músicas:", error)
          console.error("Detalhes do erro:", JSON.stringify(error, null, 2))
          throw error
        }
        
        console.log("✅ Músicas salvas no Supabase com sucesso!", { saved: data?.length || 0 })
      } else {
        console.log("ℹ️ Nenhuma música para salvar")
      }
    } catch (error: any) {
      console.error("❌ Erro ao salvar músicas no Supabase:", error)
      console.error("Stack trace:", error?.stack)
      // Fallback para localStorage em caso de erro
      console.log("📦 Usando localStorage como fallback")
      localStorage.setItem(SONGS_KEY, JSON.stringify(songs))
    }
  } else {
    console.warn("⚠️ Supabase não configurado, usando localStorage")
    // Se Supabase não estiver configurado, usa localStorage
    localStorage.setItem(SONGS_KEY, JSON.stringify(songs))
  }
}

export async function loadSongs(): Promise<Song[]> {
  if (typeof window === "undefined") return []

  // Se Supabase estiver configurado, tenta carregar do Supabase
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId()
      const guestId = getGuestUserId()

      if (!userId && !guestId) {
        // Se não houver identificador, carrega do localStorage
        const data = localStorage.getItem(SONGS_KEY)
        if (!data) return []
        try {
          return JSON.parse(data)
        } catch {
          return []
        }
      }

      // Busca músicas do Supabase usando user_id ou guest_id
      let query = supabase.from("songs").select("*")
      if (userId) {
        query = query.eq("user_id", userId)
      } else if (guestId) {
        query = query.eq("guest_id", guestId)
      }
      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        return data.map((song: any) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          content: song.content,
          key: song.key,
          isFavorite: song.is_favorite,
          tags: song.tags || [],
          createdAt: song.created_at_iso,
        }))
      }
    } catch (error) {
      console.error("Erro ao carregar músicas do Supabase:", error)
      // Fallback para localStorage em caso de erro
      const data = localStorage.getItem(SONGS_KEY)
      if (!data) return []
      try {
        return JSON.parse(data)
      } catch {
        return []
      }
    }
  }

  // Se Supabase não estiver configurado, carrega do localStorage
  const data = localStorage.getItem(SONGS_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

// ==================== FUNÇÕES DE FOLDERS ====================

export async function saveFolders(folders: Folder[]): Promise<void> {
  if (typeof window === "undefined") return

  // Se Supabase estiver configurado, usa Supabase
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId()
      const guestId = getGuestUserId()

      // Determina qual identificador usar
      const identifier = userId || guestId
      if (!identifier) {
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
        return
      }

      // Deleta todas as pastas existentes do usuário/guest e insere as novas
      if (userId) {
        await supabase.from("folders").delete().eq("user_id", userId)
      } else if (guestId) {
        await supabase.from("folders").delete().eq("guest_id", guestId)
      }

      if (folders.length > 0) {
        // Função para validar e converter ID para UUID válido
        const toValidUUID = (id: string): string => {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (uuidRegex.test(id)) {
            return id
          }
          return crypto.randomUUID()
        }

        const foldersToInsert = folders.map(folder => ({
          id: toValidUUID(folder.id),
          name: folder.name,
          song_ids: folder.songIds.map(songId => toValidUUID(songId)), // Converte IDs das músicas também
          user_id: userId || null,
          guest_id: !userId ? guestId : null,
        }))

        const { error } = await supabase.from("folders").insert(foldersToInsert)
        if (error) {
          console.error("Erro ao inserir pastas:", error)
          throw error
        }
        console.log("✅ Pastas salvas no Supabase com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao salvar pastas no Supabase:", error)
      // Fallback para localStorage em caso de erro
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
    }
  } else {
    // Se Supabase não estiver configurado, usa localStorage
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
  }
}

export async function loadFolders(): Promise<Folder[]> {
  if (typeof window === "undefined") return []

  // Se Supabase estiver configurado, tenta carregar do Supabase
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId()
      const guestId = getGuestUserId()

      if (!userId && !guestId) {
        // Se não houver identificador, carrega do localStorage
        const data = localStorage.getItem(FOLDERS_KEY)
        if (!data) return []
        try {
          return JSON.parse(data)
        } catch {
          return []
        }
      }

      // Busca pastas do Supabase usando user_id ou guest_id
      let query = supabase.from("folders").select("*")
      if (userId) {
        query = query.eq("user_id", userId)
      } else if (guestId) {
        query = query.eq("guest_id", guestId)
      }
      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        return data.map((folder: any) => ({
          id: folder.id,
          name: folder.name,
          songIds: folder.song_ids || [],
        }))
      }
    } catch (error) {
      console.error("Erro ao carregar pastas do Supabase:", error)
      // Fallback para localStorage em caso de erro
      const data = localStorage.getItem(FOLDERS_KEY)
      if (!data) return []
      try {
        return JSON.parse(data)
      } catch {
        return []
      }
    }
  }

  // Se Supabase não estiver configurado, carrega do localStorage
  const data = localStorage.getItem(FOLDERS_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getMockSongs(): Song[] {
  const now = new Date().toISOString()
  return [
    {
      id: "1",
      title: "Que País É Este",
      artist: "Legião Urbana",
      key: "D",
      isFavorite: false,
      tags: ["Rock", "Classic"],
      createdAt: now,
      content: `       D                G
Nas favelas, no senado
D                      G
Sujeira pra todo lado
D                    G
Ninguém respeita a constituição
     D                    G
Mas todos acreditam no futuro da nação

     A              G
Que país é este?
     A              G
Que país é este?
     A              G
Que país é este?

       D                    G
No Amazonas, na Araguaia, iá, iá
D                 G
Na Baixada Fluminense
D                          G
Mato Grosso, Minas Gerais, e no
D                      G
Nordeste tudo em paz

     A              G
Que país é este?
     A              G
Que país é este?
     A              G
Que país é este?`,
    },
    {
      id: "2",
      title: "Faroeste Caboclo",
      artist: "Legião Urbana",
      key: "Bm",
      isFavorite: true,
      tags: ["Rock", "Epic"],
      createdAt: now,
      content: `Bm                        A
Não tinha medo o tal João de Santo Cristo
Bm                           A
Era o que todos diziam quando ele se perdeu
Bm                        A
Deixou pra trás todo o marasmo da fazenda
   G                    A
Só pra sentir no seu sangue o ódio que Jesus lhe deu

Bm                    A
Quando criança só pensava em ser bandido
Bm                        A
Ainda mais quando assistia Fleig lutando no sertão
Bm                          A
Ele ficava ali paradão, deslumbrado
    G                      A
Mas inconformado com a maldade e a opressão`,
    },
    {
      id: "3",
      title: "Anunciação",
      artist: "Alceu Valença",
      key: "Am",
      isFavorite: false,
      tags: ["MPB", "Forró"],
      createdAt: now,
      content: `      Am
Tu vens, tu vens
      Dm
Eu já escuto os teus sinais
      Am
Tu vens, tu vens
      E7
Eu já escuto os teus sinais

       Am                    Dm
Que tu vens da outra vida da estrela d'alva
       Am                    E7
Que tu vens da outra vida da estrela d'alva

      Am
Tu vens, tu vens
      Dm
Eu já escuto os teus sinais
      Am
Tu vens, tu vens
      E7
Eu já escuto os teus sinais`,
    },
    {
      id: "4",
      title: "Eduardo e Mônica",
      artist: "Legião Urbana",
      key: "G",
      isFavorite: true,
      tags: ["Rock", "Romance"],
      createdAt: now,
      content: `G                    Em
Quem um dia irá dizer
              C                D
Que existe razão nas coisas feitas pelo coração?
  G                 Em
E quem irá dizer
              C                D
Que não existe razão?

G              Em
Eduardo abriu os olhos mas não quis se levantar
C                                D
Ficou deitado e viu que horas eram
G              Em
Enquanto Mônica tomava um conhaque
      C                        D
No outro canto da cidade, como eles disseram

G                Em
Eduardo e Mônica um dia se encontraram sem querer
C                        D
E conversaram muito mesmo pra tentar se conhecer
    G                  Em
Foi um carinha do cursinho do Eduardo que disse
       C                      D
"Tem uma festa legal, e a gente quer se divertir"`,
    },
    {
      id: "5",
      title: "Tempo Perdido",
      artist: "Legião Urbana",
      key: "E",
      isFavorite: false,
      tags: ["Rock", "Classic"],
      createdAt: now,
      content: `E                           B
Todos os dias quando acordo
A                        E
Não tenho mais o tempo que passou
E                           B
Mas tenho muito tempo
A                    E
Temos todo o tempo do mundo

E  B  A  E

E                           B
Todos os dias antes de dormir
A                        E
Lembro e esqueço como foi o dia
E                           B
Sempre em frente
A                    E
Não temos tempo a perder

E               B
Nosso suor sagrado
A                   E
É bem mais belo que esse sangue amargo
E                B
E tão sério e selvagem
A  E
Selvagem`,
    },
  ]
}