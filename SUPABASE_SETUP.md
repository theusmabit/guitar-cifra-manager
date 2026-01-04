# Configuração do Supabase

Este guia explica como configurar o Supabase como backend para o Guitar Tabs Manager.

## Pré-requisitos

1. Uma conta no Supabase (crie uma em https://supabase.com)
2. Um projeto criado no Supabase

## Passo 1: Criar um projeto no Supabase

1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha os dados do projeto (nome, senha do banco de dados, região)
4. Aguarde o projeto ser criado

## Passo 2: Configurar o banco de dados

1. No Dashboard do seu projeto, vá para "SQL Editor"
2. Copie e cole o conteúdo do arquivo `supabase/schema.sql`
3. Execute o script (clique em "Run" ou pressione Ctrl+Enter)
4. Isso criará as tabelas `songs` e `folders` com as políticas de segurança (RLS)

## Passo 3: Obter as credenciais da API

1. No Dashboard do seu projeto, vá para "Settings" > "API"
2. Você encontrará:
   - **Project URL**: A URL do seu projeto (ex: `https://xxxxx.supabase.co`)
   - **anon/public key**: A chave pública anônima

## Passo 4: Configurar variáveis de ambiente

1. Na raiz do projeto, crie um arquivo `.env.local` (se ainda não existir)
2. Adicione as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-project-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

**Exemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemplo
```

## Passo 5: Configurar autenticação (Opcional)

O sistema funciona sem autenticação (usando localStorage como fallback), mas para usar o Supabase completamente, você pode:

### Opção A: Usar sem autenticação (modo atual)
- O sistema funcionará, mas todos os dados serão salvos localmente no localStorage se não houver usuário autenticado
- Isso permite que o app funcione imediatamente sem configuração de autenticação

### Opção B: Adicionar autenticação
Se quiser adicionar autenticação de usuários:

1. No Supabase Dashboard, vá para "Authentication" > "Providers"
2. Habilite os provedores desejados (Email, Google, GitHub, etc.)
3. Atualize o código para incluir componentes de login/logout

## Passo 6: Reiniciar o servidor de desenvolvimento

Depois de configurar as variáveis de ambiente:

```bash
npm run dev
```

## Como funciona

- **Com Supabase configurado e usuário autenticado**: Os dados são salvos no banco de dados Supabase
- **Sem Supabase ou sem usuário autenticado**: O sistema usa localStorage como fallback automático
- **Erro ao conectar ao Supabase**: O sistema automaticamente usa localStorage

## Solução de problemas

### Erro: "Supabase URL ou Anon Key não configurados"
- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Verifique se as variáveis estão corretas (sem espaços extras, aspas, etc.)
- Reinicie o servidor de desenvolvimento após adicionar/modificar `.env.local`

### Dados não aparecem
- Verifique se você executou o script SQL no Supabase
- Verifique se há um usuário autenticado (se estiver usando autenticação)
- Verifique o console do navegador para erros
- Os dados podem estar no localStorage (verifique no DevTools > Application > Local Storage)

### Erro ao salvar/carregar dados
- Verifique se as políticas RLS estão configuradas corretamente
- Verifique se o usuário está autenticado (se necessário)
- Verifique a aba Network no DevTools para ver as requisições ao Supabase

## Migração de dados existentes

Se você já tem dados no localStorage e quer migrá-los para o Supabase:

1. No app, vá para Settings
2. Clique em "Exportar Biblioteca (JSON)"
3. Faça login no Supabase (se estiver usando autenticação)
4. Clique em "Importar Biblioteca" e selecione o arquivo JSON exportado

## Estrutura do banco de dados

### Tabela: songs
- `id` (UUID): Identificador único
- `title` (TEXT): Título da música
- `artist` (TEXT): Artista
- `content` (TEXT): Conteúdo da tablatura/cifra
- `key` (TEXT): Tom da música
- `is_favorite` (BOOLEAN): Se é favorita
- `tags` (TEXT[]): Array de tags
- `created_at_iso` (TEXT): Data de criação em formato ISO
- `user_id` (UUID): ID do usuário (para RLS)
- `created_at`, `updated_at` (TIMESTAMP): Timestamps automáticos

### Tabela: folders
- `id` (UUID): Identificador único
- `name` (TEXT): Nome da pasta
- `song_ids` (UUID[]): Array de IDs das músicas na pasta
- `user_id` (UUID): ID do usuário (para RLS)
- `created_at`, `updated_at` (TIMESTAMP): Timestamps automáticos

## Segurança

O projeto usa Row Level Security (RLS) para garantir que cada usuário veja apenas seus próprios dados. As políticas estão definidas no arquivo `supabase/schema.sql`.

