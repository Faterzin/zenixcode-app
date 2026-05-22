# Zenix Code

App desktop nativo pra macOS (Apple Silicon), distribuído como `.dmg` fora da App Store, com auto-update embutido.

<p align="center">
  <img src="brand/logo-rounded-1024.png" alt="Zenix Code" width="180" />
</p>

<p align="center">
  <a href="https://github.com/Faterzin/zenixcode-app/releases/latest">
    <img src="https://img.shields.io/github/v/release/Faterzin/zenixcode-app?label=download&color=2563eb" alt="Última versão" />
  </a>
  <img src="https://img.shields.io/badge/platform-macOS%20Apple%20Silicon-blue" alt="Plataforma" />
  <img src="https://img.shields.io/badge/tauri-2-orange" alt="Tauri 2" />
</p>

---

## Instalar

1. Baixe o `.dmg` mais recente em **[Releases](https://github.com/Faterzin/zenixcode-app/releases/latest)**.
2. Abra o `.dmg` e arraste **Zenix Code** pra pasta *Applications*.
3. Na primeira execução o macOS bloqueia (app não é assinado com Apple Developer ID ainda). Pra liberar: *Ajustes do Sistema → Privacidade e Segurança → Abrir mesmo assim*.
4. Pronto. A partir daí, novas versões chegam pelo próprio app via modal de atualização.

## Auto-update

No launch o app consulta o endpoint de releases deste repo. Quando há versão nova:

- Modal aparece com `vAtual → vNova` e botões **Atualizar agora** / **Depois**.
- Clicando em atualizar, o app baixa o novo bundle, valida a assinatura digital e reinicia sozinho.
- Você baixa o `.dmg` **uma vez só**; daí pra frente é tudo via app.

---

## Stack

| Camada      | Tecnologia                                  |
| ----------- | ------------------------------------------- |
| Runtime     | [Tauri 2](https://v2.tauri.app/) (Rust)     |
| UI          | React 19 + TypeScript                       |
| Bundler     | Vite 7                                      |
| Estilo      | Tailwind CSS 4                              |
| Auto-update | `@tauri-apps/plugin-updater` (assinado)     |
| Target      | `aarch64-apple-darwin` (Apple Silicon)      |

O frontend é renderizado dentro do WebView nativo do macOS — não é uma aplicação web, é a UI do app desktop.

## Desenvolvimento

Requer Node 20+, pnpm e Rust stable (rustup).

```bash
pnpm install
pnpm tauri dev      # abre o app em modo desenvolvimento com HMR
```

## Build local

Gera o `.app` + `.dmg` em `src-tauri/target/aarch64-apple-darwin/release/bundle/`:

```bash
TAURI_SIGNING_PRIVATE_KEY="$(cat ~/.zenixcode-keys/updater.key)" \
TAURI_SIGNING_PRIVATE_KEY_PASSWORD="" \
pnpm tauri build --target aarch64-apple-darwin
```

A chave privada do updater **nunca** entra no repo. Ela vive em `~/.zenixcode-keys/updater.key` na máquina do mantenedor. Sem ela, builds funcionam mas não geram artefatos de update válidos.

## Publicar nova versão

1. Bump `version` em [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json) e [`package.json`](package.json).
2. Build local (comando acima).
3. Crie tag e release com 4 assets:
   - `ZenixCode.dmg` — instalador inicial.
   - `ZenixCode.app.tar.gz` — payload do updater.
   - `ZenixCode.app.tar.gz.sig` — assinatura.
   - `latest.json` — manifesto consumido pelo updater (template em `scripts/latest.template.json` quando criado).

```bash
git tag vX.Y.Z && git push origin vX.Y.Z
gh release create vX.Y.Z \
  ZenixCode.dmg ZenixCode.app.tar.gz ZenixCode.app.tar.gz.sig latest.json
```

## Estrutura

```
zenixcode-app/
├── src/                    # UI React
├── src-tauri/              # Backend Rust (Tauri 2)
│   ├── src/                # main.rs, lib.rs
│   ├── capabilities/       # Permissões dos plugins
│   ├── icons/              # Ícones gerados via `pnpm tauri icon`
│   └── tauri.conf.json     # Config principal
├── brand/                  # Source dos ícones
└── package.json
```

## Licença

Sem licença open source declarada — todos os direitos reservados. Código público é apenas pra leitura.
