# Module Federation com React + Vite no Azure Static Web Apps

Este monorepo contém dois aplicativos React que demonstram o uso de Module Federation para compartilhar componentes em tempo de execução:

1. **catalog** (MFE remoto) - Expõe um componente de Produtos
2. **shell** (aplicativo host) - Consome o componente de Produtos do catalog

## Visão Geral da Arquitetura

Este projeto utiliza **Module Federation** do Webpack (via plugin para Vite) para possibilitar o compartilhamento de componentes entre aplicações independentes em tempo de execução.

![Arquitetura do Sistema](https://user-images.githubusercontent.com/placeholder/architecture-diagram.png)

### Como Funciona

- O app `catalog` expõe o componente `Products` através do arquivo `remoteEntry.js`
- O app `shell` carrega dinamicamente este componente através da URL do remoteEntry.js
- A comunicação entre os apps acontece no navegador, em tempo de execução
- No ambiente de produção, cada app é hospedado em um Azure Static Web App separado
- A URL do remoteEntry.js é injetada no shell via variável de ambiente (`VITE_CATALOG_URL`)

### Tecnologias Principais

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS utilitário
- **Module Federation** - Compartilhamento de código em tempo de execução
- **Azure Static Web Apps** - Hospedagem na nuvem

## Desenvolvimento Local

Para executar os aplicativos localmente:

```bash
# Terminal 1 - Inicie o Catalog (MFE)
cd catalog
npm install
npm run dev

# Terminal 2 - Inicie o Shell (Host)
cd shell
npm install
npm run dev
```

O app `catalog` estará disponível em http://localhost:5174
O app `shell` estará disponível em http://localhost:5173

Durante o desenvolvimento local, o shell automaticamente se conecta ao catalog na porta 5174.

## Build para Produção

Para criar builds de produção:

```bash
# Build do Catalog
cd catalog
npm run build

# Build do Shell
cd shell
npm run build
```

Os arquivos de distribuição serão gerados nas pastas `catalog/dist` e `shell/dist`.

## Deploy no Azure Static Web Apps

Existem duas opções para deploy: GitHub Actions ou Azure DevOps.

### Pré-requisitos
1. Uma conta Azure com permissões para criar Static Web Apps
2. Um repositório com este código (GitHub ou Azure Repos)

### Opção 1: Deploy com GitHub Actions

1. **Criar dois Static Web Apps no Azure Portal**:
   - Um para o Catalog (ex: `catalog-app-xyz`)
   - Um para o Shell (ex: `shell-app-xyz`)
   
   Para cada um, configure:
   - Origem: GitHub
   - Repositório: seu-usuario/mfe-catalog-shell
   - Branch: main
   - Build preset: Custom
   - App location: `/catalog` ou `/shell` (dependendo do app)
   - Api location: deixe vazio
   - Output location: `dist`

2. **Após o primeiro deploy do Catalog**:
   - Copie a URL pública do remoteEntry.js do Catalog (geralmente será algo como `https://catalog-app-xyz.azurestaticapps.net/assets/remoteEntry.js`)
   
3. **Configure o secret no repositório GitHub**:
   - Vá para Settings > Secrets > Actions no seu repositório
   - Adicione um novo secret chamado `VITE_CATALOG_URL` com o valor da URL do remoteEntry.js

4. **Re-execute o workflow do Shell**:
   - Vá para a aba Actions no GitHub
   - Encontre o workflow do Shell e execute-o manualmente ou faça um commit no código do Shell

### Opção 2: Deploy com Azure DevOps

1. **Criar dois Static Web Apps no Azure Portal** como no método anterior

2. **Configurar Pipeline no Azure DevOps**:
   - Crie um novo pipeline apontando para o repositório
   - Use o arquivo `azure-pipelines.yml` na raiz do projeto
   - Crie um grupo de variáveis chamado `static-web-apps-tokens` com:
     - `CATALOG_DEPLOYMENT_TOKEN`: Token de implantação do primeiro Azure Static Web App
     - `SHELL_DEPLOYMENT_TOKEN`: Token de implantação do segundo Azure Static Web App
     - `CATALOG_URL`: URL do remoteEntry.js após o primeiro deploy

3. **Obter tokens de implantação**:
   - No Azure Portal, vá para cada Static Web App
   - Navegue até "Overview" > "Manage deployment token"
   - Copie o token e adicione à variável correspondente no Azure DevOps

4. **Executar o pipeline**:
   - Após o primeiro deploy bem-sucedido do Catalog, obtenha a URL do remoteEntry.js
   - Atualize a variável `CATALOG_URL` no grupo de variáveis
   - Execute novamente o pipeline para implantar o Shell com a URL correta

### Verificando o Deployment

Após o deploy:

1. Acesse a URL do app Shell
2. Verifique se o componente Products está sendo carregado corretamente do Catalog
3. Se houver problemas, verifique:
   - Console do navegador para erros
   - Logs de build no GitHub Actions ou Azure DevOps
   - Configuração CORS no Catalog Static Web App (se necessário)

## Customização e Extensão

### Alterando a API de Produtos

Para usar uma API diferente:

1. Modifique `Products.tsx` no Catalog para apontar para sua nova API:

```tsx
const response = await axios.get('https://sua-nova-api.com/products');
```

2. Se sua API tiver especificação OpenAPI/Swagger, considere gerar um cliente TypeScript

### Adicionando Novos Micro-Frontends

Para adicionar um novo MFE:

1. Crie uma nova pasta na raiz do projeto
2. Configure o vite.config.ts com Module Federation
3. Exponha os componentes necessários
4. Adicione a nova aplicação ao workflow de CI/CD

## Solução de Problemas

### CORS em Produção

Se encontrar erros de CORS:

1. Verifique se o Static Web App do Catalog permite solicitações do domínio do Shell
2. Adicione ao `staticwebapp.config.json` do Catalog:

```json
{
  "headers": {
    "/assets/remoteEntry.js": {
      "Access-Control-Allow-Origin": "*"
    }
  }
}
```

### Problemas com Module Federation

Se o Shell não conseguir carregar componentes do Catalog:

1. Verifique se a URL do remoteEntry.js está correta no Secret/Variável
2. Confirme que o build do Catalog foi bem-sucedido
3. Teste acessar diretamente a URL do remoteEntry.js no navegador

## Recursos Adicionais

- [Documentação do Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Documentação do Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Plugin Module Federation para Vite](https://github.com/originjs/vite-plugin-federation)
- [Práticas recomendadas para Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/front-end-frameworks)
