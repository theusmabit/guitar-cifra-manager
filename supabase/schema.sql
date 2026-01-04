-- Schema do banco de dados para Guitar Tabs Manager
-- Execute este script no SQL Editor do Supabase Dashboard

-- Tabela de músicas (songs)
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  content TEXT NOT NULL,
  key TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id TEXT, -- ID para usuários não autenticados
  created_at_iso TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pastas (folders)
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  song_ids UUID[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id TEXT, -- ID para usuários não autenticados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas guest_id se não existirem (para permitir uso sem autenticação)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='songs' AND column_name='guest_id') THEN
    ALTER TABLE songs ADD COLUMN guest_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='folders' AND column_name='guest_id') THEN
    ALTER TABLE folders ADD COLUMN guest_id TEXT;
  END IF;
END $$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_guest_id ON songs(guest_id);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
CREATE INDEX IF NOT EXISTS idx_songs_is_favorite ON songs(is_favorite);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_guest_id ON folders(guest_id);

-- RLS (Row Level Security) Policies
-- Habilitar RLS nas tabelas
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver) para permitir re-execução
DROP POLICY IF EXISTS "Users can view their own songs" ON songs;
DROP POLICY IF EXISTS "Users can insert their own songs" ON songs;
DROP POLICY IF EXISTS "Users can update their own songs" ON songs;
DROP POLICY IF EXISTS "Users can delete their own songs" ON songs;
DROP POLICY IF EXISTS "Users can view their own folders" ON folders;
DROP POLICY IF EXISTS "Users can insert their own folders" ON folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON folders;

-- Política: Usuários autenticados podem ver apenas suas próprias músicas
-- Usuários não autenticados podem ver músicas com seu guest_id
CREATE POLICY "Users can view their own songs"
  ON songs FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem inserir suas próprias músicas
-- Usuários não autenticados podem inserir músicas com guest_id
CREATE POLICY "Users can insert their own songs"
  ON songs FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem atualizar suas próprias músicas
-- Usuários não autenticados podem atualizar músicas com seu guest_id
CREATE POLICY "Users can update their own songs"
  ON songs FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem deletar suas próprias músicas
-- Usuários não autenticados podem deletar músicas com seu guest_id
CREATE POLICY "Users can delete their own songs"
  ON songs FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem ver apenas suas próprias pastas
-- Usuários não autenticados podem ver pastas com seu guest_id
CREATE POLICY "Users can view their own folders"
  ON folders FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem inserir suas próprias pastas
-- Usuários não autenticados podem inserir pastas com guest_id
CREATE POLICY "Users can insert their own folders"
  ON folders FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem atualizar suas próprias pastas
-- Usuários não autenticados podem atualizar pastas com seu guest_id
CREATE POLICY "Users can update their own folders"
  ON folders FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Política: Usuários autenticados podem deletar suas próprias pastas
-- Usuários não autenticados podem deletar pastas com seu guest_id
CREATE POLICY "Users can delete their own folders"
  ON folders FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover triggers existentes (se houver) para permitir re-execução
DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

