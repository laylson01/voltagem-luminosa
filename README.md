# Voltagem Luminosa — Demo

Demo inicial de um site para eletricista que faz pequenos reparos e recebe pedidos de orçamento online com fotos e vídeos.

## Tecnologias

- HTML
- CSS
- JavaScript puro

Não existe Python no projeto.

## Como abrir no VS Code

1. Extraia o ZIP.
2. Abra a pasta `eletricista-demo` no VS Code.
3. Abra `index.html`.
4. Recomendo instalar a extensão **Live Server**.
5. Clique com o botão direito em `index.html` > **Open with Live Server**.

Também pode abrir `index.html` diretamente no navegador.

## Arquivos

- `index.html` — estrutura do site
- `styles.css` — visual e responsividade
- `app.js` — estimativa de preço, formulário e preview de imagens/vídeos
- `README.md` — instruções

## O que já funciona

- Site responsivo
- Lista de serviços
- Área de atendimento
- Formulário de orçamento
- Estimativa automática simples
- Upload local de imagens e vídeos
- Preview dos arquivos
- Serviços complexos marcados para avaliação
- Dados de demonstração guardados no localStorage

## O que ainda é apenas demo

O formulário não envia dados para servidor.

Para transformar em produto real, você pode pedir ao Codex para:

1. Criar backend com Django ou FastAPI.
2. Criar banco PostgreSQL.
3. Guardar os pedidos de orçamento.
4. Fazer upload real das imagens e vídeos.
5. Criar painel administrativo.
6. Gerar orçamento PDF.
7. Adicionar botão de aceitar/rejeitar orçamento.
8. Adicionar autenticação.
9. Integrar WhatsApp ou email.
10. Adicionar agenda de visitas.

## Prompt sugerido para o Codex

Analise este projeto completo. Quero transformá-lo numa aplicação real para um eletricista local. Mantenha o frontend atual como base. Crie uma arquitetura profissional com backend, banco de dados, gestão de pedidos de orçamento, upload de imagens e vídeos, painel administrativo e geração de orçamento. Antes de alterar os arquivos, proponha uma arquitetura e um plano incremental de implementação.
