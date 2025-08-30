Prompt para IA (PORTUGUÊS)

Você é um arquiteto frontend sênior. Gere um monorepo completo, pronto para produção, com dois frontends em React + Vite + Tailwind + Axios, integrados via Module Federation usando vite-plugin-federation, e preparados para deploy no Azure Static Web Apps (SWA) — um SWA por app.

Objetivos

Criar dois aplicativos:

catalog (remoto/MFE) — expõe ./Products e busca dados via Axios de {{API_URL}}.

shell (host) — consome catalog/Products via Module Federation em tempo de execução, com a URL do remoto injetada via variável de ambiente (VITE_CATALOG_URL).

Stack: React 18 + TypeScript, Vite, TailwindCSS, Axios, vite-plugin-federation.

CI/CD: Dois workflows do Azure Static Web Apps (um para cada app) com fallback SPA e injeção de env var no build do shell.

DX: scripts NPM claros, config mínima de TypeScript, e README explicando dev local e deploy.

Entradas (preencha os placeholders)

{{ORG}} = sua org/usuário GitHub (ex.: manoelvsneto)

{{REPO_NAME}} = nome do repositório (ex.: mfe-catalog-shell)

{{API_URL}} = endpoint para listar produtos (ex.: https://fakestoreapi.com/products?limit=5)

{{CATALOG_SWA_NAME}} = nome do SWA do catalog

{{SHELL_SWA_NAME}} = nome do SWA do shell

Estrutura esperada do monorepo
{{REPO_NAME}}/
  catalog/
    src/
    index.html
    vite.config.ts
    tailwind.config.js
    postcss.config.js
    tsconfig.json
    staticwebapp.config.json
    package.json
  shell/
    src/
    index.html
    vite.config.ts
    tailwind.config.js
    postcss.config.js
    tsconfig.json
    staticwebapp.config.json
    package.json
  .github/workflows/
    azure-static-web-apps-{{CATALOG_SWA_NAME}}.yml
    azure-static-web-apps-{{SHELL_SWA_NAME}}.yml
  README.md

Requisitos detalhados
1) catalog (remoto/MFE)

vite.config.ts com:

vite-plugin-federation configurado com:

name: 'catalog'

filename: 'remoteEntry.js'

exposes: { './Products': './src/Products.tsx' }

shared: ['react', 'react-dom']

server.port = 5174

build.target = 'esnext', modulePreload = false, cssCodeSplit = true

src/Products.tsx:

Usa Axios para buscar de {{API_URL}}.

Renderiza uma lista simples com estilização Tailwind.

Tailwind:

tailwind.config.js com content: ["./index.html","./src/**/*.{ts,tsx}"]

src/index.css com @tailwind base; @tailwind components; @tailwind utilities;

staticwebapp.config.json:

navigationFallback para SPA

mimeTypes com ".js": "text/javascript"

2) shell (host)

vite.config.ts com:

vite-plugin-federation configurado com:

name: 'shell'

remotes: { catalog: process.env.VITE_CATALOG_URL } (não hardcode)

shared: ['react', 'react-dom']

server.port = 5173

build.target = 'esnext', modulePreload = false, cssCodeSplit = true

src/@types/federation.d.ts:

declare module 'catalog/Products' {
  const Component: React.ComponentType;
  export default Component;
}


src/App.tsx:

React.lazy(() => import('catalog/Products')) + Suspense

Layout simples com Tailwind

staticwebapp.config.json igual ao do catalog

Tailwind configurado nos mesmos moldes.

3) Scripts NPM (ambos)

"dev", "build", "preview"

(Opcional) "lint", "typecheck"

4) Workflows do Azure Static Web Apps (2 arquivos)

Um workflow para catalog e outro para shell, cada um:

actions/checkout

Node 20.x

npm ci + npm run build no respectivo diretório

Publica dist/ via ação oficial do SWA

No workflow do shell, defina:

env:
  VITE_CATALOG_URL: ${{ secrets.VITE_CATALOG_URL }}


Depois do deploy do catalog, copie a URL pública do remoteEntry.js (ex.: https://<catalog-xyz>.azurestaticapps.net/assets/remoteEntry.js) para o secret VITE_CATALOG_URL no repositório do shell (ou no mesmo repo, se monorepo com secrets em nível de repo).

5) README.md

Inclua:

Visão geral: como Module Federation conecta shell e catalog

Dev local:

# terminal 1
cd catalog && npm i && npm run dev
# terminal 2
cd shell && npm i && npm run dev


Build:

cd catalog && npm run build
cd ../shell && npm run build


Deploy no Azure SWA (passo a passo):

Criar dois SWAs (via Portal), apontando para /catalog e /shell, com output dist.

Deploy do catalog → copiar URL do remoteEntry.js.

No repositório do shell, criar Secret VITE_CATALOG_URL com a URL do remoteEntry.js.

Reexecutar o workflow do shell.

Notas:

CORS se o MFE remoto chamar APIs externas.

Cache/versionamento (opcional): estratégias para invalidar remoteEntry.js.

Como trocar {{API_URL}} por um backend com Swagger depois (gerar cliente ou usar Axios).

Qualidade e Padrões

TypeScript com strict habilitado.

UI minimalista e limpa (cards, espaçamento, tipografia).

Nenhuma URL de produção hardcoded no código; tudo via env/secret.

Formato de Saída

Entregue todos os arquivos em blocos de código separados, com o caminho do arquivo como comentário na primeira linha (ex.: // catalog/vite.config.ts).

Não omita arquivos essenciais (configs, workflows, README, types).

Verificação

Explique como rodar localmente (iniciando catalog e depois shell) e como o shell resolve o remoto em produção via VITE_CATALOG_URL.

Garanta que shell renderiza o componente Products carregado do catalog.