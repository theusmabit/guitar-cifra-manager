# 🖥️ Como Executar Comandos no Terminal

## Método 1: Usar o Terminal do Cursor/VS Code

### Se você está no Cursor/VS Code:

1. **Abra o terminal integrado:**
   - Pressione `` Ctrl + ` `` (backtick/acento grave)
   - OU vá em: **Terminal** > **New Terminal** no menu superior
   - OU vá em: **View** > **Terminal**

2. **Navegue até a pasta do projeto (se necessário):**
   ```powershell
   cd guitar-tabs-manager-mainzip
   ```

3. **Execute o comando:**
   ```bash
   npm run dev
   ```

---

## Método 2: Usar PowerShell do Windows

### Abrir PowerShell:

1. **Pressione `Win + X`** e escolha **"Windows PowerShell"** ou **"Terminal"**
   - OU pressione `Win + R`, digite `powershell` e Enter
   - OU procure por "PowerShell" no menu Iniciar

2. **Navegue até a pasta do projeto:**
   ```powershell
   cd "E:\Downloads\guitar-tabs-manager-mainzip\guitar-tabs-manager-mainzip"
   ```
   *(Ajuste o caminho se sua pasta estiver em outro lugar)*

3. **Execute o comando:**
   ```bash
   npm run dev
   ```

---

## Método 3: Usar Prompt de Comando (CMD)

1. **Pressione `Win + R`**, digite `cmd` e Enter
   - OU procure por "Prompt de Comando" no menu Iniciar

2. **Navegue até a pasta:**
   ```cmd
   cd /d "E:\Downloads\guitar-tabs-manager-mainzip\guitar-tabs-manager-mainzip"
   ```

3. **Execute o comando:**
   ```bash
   npm run dev
   ```

---

## 📝 Comandos Básicos Úteis:

```bash
# Ver em qual pasta você está
pwd                    # (PowerShell)
cd                     # (CMD)

# Listar arquivos da pasta
dir                    # (CMD)
ls                     # (PowerShell)

# Navegar para uma pasta
cd nome-da-pasta

# Voltar uma pasta
cd ..

# Limpar a tela
cls                    # (CMD)
Clear-Host            # (PowerShell)
```

---

## ✅ O que você deve ver quando executar `npm run dev`:

```
> my-v0-project@0.1.0 dev
> next dev

   ▲ Next.js 16.0.10 (Turbopack)
   - Local:        http://localhost:3001
   - Network:      http://192.168.0.11:3001

 ✓ Ready in X ms
```

**Quando aparecer "Ready", o servidor está funcionando!**

---

## 🛑 Para parar o servidor:

Pressione `Ctrl + C` no terminal

---

## ❓ Problemas comuns:

**"npm não é reconhecido":**
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após instalar

**"Pasta não encontrada":**
- Verifique o caminho da pasta
- Use `cd` para navegar até a pasta certa

