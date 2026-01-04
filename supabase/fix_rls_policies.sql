-- Script para corrigir políticas RLS - Permite inserção sem autenticação
-- Execute este script se os dados ainda não estão sendo salvos

-- Primeiro, desabilite temporariamente RLS para testar
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
ALTER TABLE folders DISABLE ROW LEVEL SECURITY;

-- Reabilite RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Users can view their own songs" ON songs;
DROP POLICY IF EXISTS "Users can insert their own songs" ON songs;
DROP POLICY IF EXISTS "Users can update their own songs" ON songs;
DROP POLICY IF EXISTS "Users can delete their own songs" ON songs;
DROP POLICY IF EXISTS "Users can view their own folders" ON folders;
DROP POLICY IF EXISTS "Users can insert their own folders" ON folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON folders;

-- Criar políticas mais permissivas (permitem inserção/leitura quando guest_id está presente)

-- SELECT: Permitir leitura se tiver user_id OU guest_id
CREATE POLICY "Allow select with user or guest id"
  ON songs FOR SELECT
  USING (user_id IS NOT NULL OR guest_id IS NOT NULL);

-- INSERT: Permitir inserção se tiver user_id OU guest_id
CREATE POLICY "Allow insert with user or guest id"
  ON songs FOR INSERT
  WITH CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL);

-- UPDATE: Permitir atualização se tiver user_id OU guest_id
CREATE POLICY "Allow update with user or guest id"
  ON songs FOR UPDATE
  USING (user_id IS NOT NULL OR guest_id IS NOT NULL);

-- DELETE: Permitir deleção se tiver user_id OU guest_id
CREATE POLICY "Allow delete with user or guest id"
  ON songs FOR DELETE
  USING (user_id IS NOT NULL OR guest_id IS NOT NULL);

-- Mesmas políticas para folders
CREATE POLICY "Allow select folders with user or guest id"
  ON folders FOR SELECT
  USING (user_id IS NOT NULL OR guest_id IS NOT NULL);

CREATE POLICY "Allow insert folders with user or guest id"
  ON folders FOR INSERT
  WITH CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL);

CREATE POLICY "Allow update folders with user or guest id"
  ON folders FOR UPDATE
  USING (user_id IS NOT NULL OR guest_id IS NOT NULL);

CREATE POLICY "Allow delete folders with user or guest id"
  ON folders FOR DELETE
  USING (user_id IS NOT NULL OR guest_id IS NOT NULL);

