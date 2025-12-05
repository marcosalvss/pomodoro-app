🍅 Pomodoro 2025.2 - Angular Edition

Este projeto é uma aplicação web moderna da técnica Pomodoro, desenvolvida para auxiliar na gestão de tempo e produtividade. O sistema permite gerenciar ciclos de foco e pausa, além de manter uma lista de tarefas integrada.


🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as práticas mais recentes do desenvolvimento web moderno:

Angular (v17+): Framework principal.

Standalone Components: Arquitetura moderna sem a necessidade de NgModules.

Angular Signals: O novo sistema de reatividade granular do Angular para gerenciamento de estado (alta performance).

Tailwind CSS: Framework de utilitários CSS para estilização rápida e responsiva.

TypeScript: Superset do JavaScript para tipagem estática e segurança no código.


📋 Funcionalidades

Timer Personalizável:

Modo Pomodoro (25 min)

Pausa Curta (5 min)

Pausa Longa (15 min)

Gestão de Tarefas:

Adicionar novas tarefas.

Marcar como concluída (com persistência visual).

Ocultar tarefas já finalizadas.

Excluir tarefas.

Interface Responsiva:

Layout adaptável para Desktop (lado a lado).

Layout otimizado para Mobile (timer fixo no topo).

Feedback Visual:

Contador de ciclos.

Título da aba do navegador dinâmico (mostra o tempo restante).


🛠️ Como Rodar o Projeto (Passo a Passo)

Siga estas instruções para rodar o projeto em qualquer computador que tenha o Node.js instalado.

1. Pré-requisitos

Certifique-se de ter o Node.js (versão LTS) instalado.
Para verificar, abra o terminal e digite:

node -v



2. Instalação do Angular CLI

Caso o computador ainda não tenha o Angular instalado globalmente:

npm install -g @angular/cli

> Dica: Se der erro de permissão no Windows (PowerShell), rode o PowerShell como Administrador e use o comando: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser



3. Instalar Dependências

Abra a pasta do projeto no terminal e instale as bibliotecas necessárias:

npm install



4. Executar o Servidor

Inicie o servidor de desenvolvimento:

ng serve



5. Acessar

Abra o seu navegador e acesse:
http://localhost:4200

📂 Estrutura do Projeto

Para fins didáticos, a lógica principal está concentrada em:

src/app/app.ts: Contém toda a lógica (TypeScript), o template (HTML) e os estilos (CSS) em um único arquivo, demonstrando o poder dos Single File Components.

tailwind.config.js: Configuração dos estilos utilitários.


👨‍💻 Autor

Desenvolvido como projeto prático da disciplina de Desenvolvimento Front-end.