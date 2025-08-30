Deploy no Azure Static Web Apps
Pré-requisitos
Uma conta Azure com permissões para criar Static Web Apps
Um repositório GitHub com este código

Passos para Deploy
Criar dois Static Web Apps no Azure Portal:

Um para o Catalog (ex: catalog-app-xyz)
Um para o Shell (ex: shell-app-xyz)
Para cada um, configure:

Origem: GitHub
Repositório: seu-usuario/mfe-catalog-shell
Branch: main
Build preset: Custom
App location: /catalog ou /shell (dependendo do app)
Api location: deixe vazio
Output location: dist
Após o primeiro deploy do Catalog:

Copie a URL pública do remoteEntry.js do Catalog (geralmente será algo como https://catalog-app-xyz.azurestaticapps.net/assets/remoteEntry.js)
Configure o secret no repositório GitHub:

Vá para Settings > Secrets > Actions no seu repositório
Adicione um novo secret chamado VITE_CATALOG_URL com o valor da URL do remoteEntry.js
Re-execute o workflow do Shell:

Vá para a aba Actions no GitHub
Encontre o workflow do Shell e execute-o manualmente ou faça um commit no código do Shell
Após o deploy, seu Shell App carregará dinamicamente o componente Products do Catalog App.