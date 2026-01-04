-- Script de atualização: Adiciona suporte para usuários não autenticados
-- Execute este script APÓS executar o schema.sql original

-- Adicionar coluna guest_id nas tabelas (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='songs' AND column_name='guest_id') THEN
    ALTER TABLE songs ADD COLUMN guest_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='folders' AND column_name='guest_id') THEN
    ALTER TABLE folders ADD COLUMN guest_id TEXT;
  END IF;
END $$;

-- Criar índices para guest_id
CREATE INDEX IF NOT EXISTS idx_songs_guest_id ON songs(guest_id);
CREATE INDEX IF NOT EXISTS idx_folders_guest_id ON folders(guest_id);

-- Remover políticas existentes para recriá-las
DROP POLICY IF EXISTS "Users can view their own songs" ON songs;
DROP POLICY IF EXISTS "Users can insert their own songs" ON songs;
DROP POLICY IF EXISTS "Users can update their own songs" ON songs;
DROP POLICY IF EXISTS "Users can delete their own songs" ON songs;
DROP POLICY IF EXISTS "Users can view their own folders" ON folders;
DROP POLICY IF EXISTS "Users can insert their own folders" ON folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON folders;

-- Recriar políticas permitindo usuários autenticados E não autenticados

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

