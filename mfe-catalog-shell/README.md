# Module Federation com React + Vite no Azure Static Web Apps

Este monorepo contém dois aplicativos React que demonstram o uso de Module Federation para compartilhar componentes em tempo de execução:

1. **catalog** (MFE remoto) - Expõe um componente de Produtos
2. **shell** (aplicativo host) - Consome o componente de Produtos do catalog

## Visão Geral da Arquitetura

Este projeto utiliza **Module Federation** do Webpack (via plugin para Vite) para possibilitar o compartilhamento de componentes entre aplicações independentes em tempo de execução.

- O app `catalog` expõe o componente `Products` que busca produtos de uma API externa
- O app `shell` carrega dinamicamente este componente através de uma URL remota
- No ambiente de produção, a URL do componente remoto é injetada via variável de ambiente (`VITE_CATALOG_URL`)

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

### Pré-requisitos
1. Uma conta Azure com permissões para criar Static Web Apps
2. Um repositório GitHub com este código

### Passos para Deploy

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

Após o deploy, seu Shell App carregará dinamicamente o componente Products do Catalog App.

## Notas Importantes

### CORS
Se o MFE remoto (catalog) fizer chamadas para APIs externas, certifique-se de que essas APIs permitam CORS do domínio do seu Static Web App.

### Cache e Versionamento
Para gerenciar atualizações do remoteEntry.js sem quebrar o Shell:

1. Considere adicionar um hash de versão no nome do arquivo remoteEntry.js
2. Configure cabeçalhos de cache adequados no staticwebapp.config.json
3. Em atualizações críticas, atualize o secret VITE_CATALOG_URL no GitHub e redeploy o Shell

### Substituição da API de Produtos
Para trocar a API de produtos atual por um backend próprio:

1. Modifique `Products.tsx` no Catalog para apontar para sua nova API
2. Se sua API tiver Swagger, considere gerar um cliente TypeScript em vez de usar Axios diretamente
3. Lembre-se de configurar CORS na sua API para permitir requisições dos domínios dos Static Web Apps

## Recursos Adicionais

- [Documentação do Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Documentação do Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Plugin Module Federation para Vite](https://github.com/originjs/vite-plugin-federation)
