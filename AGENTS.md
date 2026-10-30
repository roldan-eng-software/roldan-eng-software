# AGENTS.md

Diretrizes obrigatórias para qualquer agente LLM que atue no desenvolvimento deste sistema.

## 1. Uso das skills

- Antes de desenvolver qualquer pedido, consulte a pasta `.agents/` para identificar as skills disponíveis.
- Leia as skills relevantes para a tarefa e use-as para adquirir as habilidades necessárias. Carregue somente o que for preciso para o pedido em questão.
- Quando o pedido envolver mais de uma área (por exemplo, banco de dados e interface), combine as skills correspondentes.
- Se nenhuma skill cobrir o necessário, siga as boas práticas descritas neste arquivo e registre a lacuna na resposta ao usuário.

## 2. Execução por meio de MCP

- Sempre que houver um MCP disponível capaz de executar uma função necessária para o pedido, execute-a por meio do MCP.
- Não é necessário aguardar ordem explícita do usuário para usar o MCP. A execução via MCP é o comportamento padrão.
- Prefira o MCP a alternativas manuais quando ele oferecer a mesma funcionalidade.
- Ao concluir, informe brevemente o que foi executado e qual foi o resultado.

## 3. Boas práticas de codificação

Todo código produzido neste sistema deve ser escrito com boas práticas, incluindo:

- Nomes claros e descritivos para variáveis, funções, classes e arquivos.
- Funções pequenas, com uma única responsabilidade.
- Ausência de duplicação de código; reutilize e centralize lógica comum.
- Tratamento explícito de erros e validação das entradas.
- Nenhum segredo, senha ou chave de API escrito diretamente no código; use variáveis de ambiente.
- Separação de responsabilidades entre camadas (interface, regras de negócio, acesso a dados).
- Seguir as convenções já existentes no projeto (formatação, estrutura de pastas, padrões de nomenclatura).
- Escrever testes para a lógica crítica sempre que aplicável.
- Evitar complexidade desnecessária; prefira a solução mais simples que atenda ao requisito.

## 4. Comentários nos pontos decisivos de ação

- Todas as funções que representam pontos principais de decisão ou ação devem ter um comentário resumido descrevendo o que a função faz.
- Consideram-se pontos decisivos: funções públicas, regras de negócio, cálculos financeiros ou de orçamento, integrações com serviços externos, operações de escrita em banco de dados, fluxos de autenticação e autorização, e controladores de fluxo principais.
- O comentário deve ser curto, objetivo e escrito em português.
- Ao alterar uma função comentada, atualize também o comentário para que continue refletindo o comportamento real.

## 5. Contexto atual do projeto

- Site institucional multipágina da Roldan Eng Software, em HTML semântico, CSS e JavaScript vanilla. Não há framework, gerenciador de pacotes, build ou backend próprio.
- O projeto tem 15 rotas de conteúdo e `404.html`. O mapa completo e os comandos para servir localmente estão no [README.md](README.md).
- `css/styles.css` concentra os tokens visuais, breakpoints e componentes compartilhados; `js/main.js` concentra as interações. O header e o footer da landing page são o padrão para todas as páginas. Ao editar esses blocos, preserve os caminhos relativos de cada rota e o estado `aria-current` da navegação.
- A landing page está em `index.html`; páginas de serviços, blog, portfólio, contato e sobre ficam em diretórios próprios. A identidade e o contexto de produto estão em [DESIGN.md](DESIGN.md) e [PRODUCT.md](PRODUCT.md).
- O favicon do site é `assets/favicon.ico`; as páginas HTML devem apontar para ele usando o caminho relativo correto. O arquivo `assets/logotipo.jpg` é a referência visual da marca.
- O site não publica mais formulário de contato: a conversão é feita pelos links do WhatsApp, inclusive na página de contato, que agora mostra o mesmo bloco de canais da seção de contato da home. A lógica de validação de formulário e a integração com EmailJS permanecem em `js/main.js` para reutilização futura; a integração roda no navegador, então nunca adicione chaves privadas ao código. O WhatsApp continua sendo a conversão principal.
- O domínio de produção ainda precisa ser confirmado: `www.seudominio.com.br` permanece em URLs canônicas/metadados e nos arquivos de SEO. Confira também as pendências de publicação no README antes de considerar o site pronto para produção.
- O README e os documentos de produto podem ficar desatualizados em relação ao código; confirme comportamento e conteúdo nas páginas e scripts antes de usá-los como descrição do estado executável.

### Estado deste checkout (30/10/2026)

- O header/footer padronizado está registrado no commit atual.
- Há alterações locais ainda não commitadas relacionadas à atualização do `favicon.ico` e à referência do ícone nas 16 páginas HTML. Preserve essas alterações; não descarte nem reverta mudanças preexistentes.
- Para validar mudanças, use `python -m http.server 8000` e teste as rotas no navegador. Não há comando de build ou suíte de testes configurada; `git diff --check` é uma verificação básica útil.
