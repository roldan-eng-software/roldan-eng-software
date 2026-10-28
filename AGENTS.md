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
