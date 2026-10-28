# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Donos e gestores de pequenos e médios negócios da região onde a Roldan Eng
Software atenda presencialmente — situação principal: avaliam fornecedores de
criação de sites e SEO e precisam de um canal rápido de contato. Secundariamente,
empresas de outras localidades atendidas remotamente, que avaliam o fornecedor
pelo site.

## Product Purpose

Site institucional da Roldan Eng Software, empresa de criação de sites e SEO.
Apresenta serviços, processo, portfólio e canais de contato, e existe para gerar
leads qualificados. Sucesso significa: o visitante entra em contato pedindo
orçamento, com o WhatsApp como conversão principal.

## Positioning

Desenvolvimento web com rigor de engenharia: sites construídos com código próprio
(sem temas genéricos), performance e SEO técnico aplicados desde a base, atendimento
direto de quem desenvolve o projeto e acompanhamento mensurável depois da
publicação — combinação que uma fábrica de templates não copia com a mesma credibilidade.

## Operating Context

- Site estático (HTML/CSS/JS sem build), publicado em GitHub Pages ou Vercel.
- Sem backend: o formulário de contato é demonstração (validação apenas no
  cliente) e precisa de serviço de envio antes de qualquer publicação real.
- Ficha de referência de contato: Google Maps
  (https://maps.app.goo.gl/S33cSEXc9oUQ6LxMA) — não foi acessível na criação.
- SEO técnico é entregável fixo: meta tags, Open Graph, JSON-LD, sitemap,
  robots.txt e hierarquia de headings.

## Capabilities and Constraints

- Página única com 12 seções: header fixo, hero, diferenciais, serviços (5),
  processo (4 etapas), portfólio (6), sobre, depoimentos (3), FAQ (5), CTA final,
  contato (formulário + mapa) e footer.
- Interações em JavaScript vanilla: menu hambúrguer, acordeão de FAQ, validação
  do formulário com máscara de telefone, navegação ativa e animações de entrada.
- Conversão principal: clique no link do WhatsApp (`wa.me`).
- Responsividade obrigatória nos breakpoints 360, 768, 1024 e 1280px.
- Idioma: português do Brasil. Tom: profissional, direto e confiante; proibido
  prometer demais (termos como "garantido" ou "número 1" não podem aparecer).
- Domínio final ainda indefinido (placeholder `www.seudominio.com.br` em
  canonical, OG, robots.txt e sitemap.xml).

## Brand Commitments

- Nome: **Roldan Eng Software**; logotipo textual com marca de chaves de código.
- Identidade visual fixada pelo briefing (vinculante): fundo `#FFFFFF` e
  alternado `#F4F6F8`, texto `#1E293B`/secundário, primária `#2563EB`, apoio
  escuro `#0F172A`, destaque `#DBEAFE`, sucesso `#10B981`; tipografia Inter;
  cantos de 8–12px; sombras sutis.
- Copyright fixo: "© 2026 Roldan Eng Software. Todos os direitos reservados."
- Conteúdo 100% próprio; nada copiado de sites de referência.

## Evidence on Hand

- Placeholders marcados no código aguardando dados reais: endereço, telefone,
  WhatsApp, horário, e-mail (campos `[ENDEREÇO]`, `[TELEFONE]`, `[WHATSAPP]`,
  `[HORÁRIO]`, `[E-MAIL]` no `index.html` e no JSON-LD).
- Depoimentos e portfólio contêm apenas exemplos ilustrativos claramente
  marcados; imagens são SVGs de placeholder (`assets/placeholder-*.svg`,
  `assets/portfolio-0*.svg`) e `og-image.png` gerada.
- Ausências que o trabalho futuro **não pode inventar**: depoimentos reais,
  clientes, projetos, avaliações, números de resultados, endereço, telefone,
  horário e domínio.
- Dados de depoimentos, portfólio, ficha do Google Maps e domínio **serão
  fornecidos depois pelo responsável**.

## Product Principles

1. Conversão acima de decoração: cada seção serve o caminho até o WhatsApp.
2. Promessas verificáveis: nenhuma afirmação que o projeto não possa provar.
3. Clareza primeiro: português direto, sem jargão desnecessário.
4. Performance e SEO são requisito do produto, não extra opcional.
5. Honestidade sobre pendências: placeholders visíveis até os dados reais chegarem.

## Accessibility & Inclusion

- Contraste AA (≥ 4.5:1) obrigatório para texto sobre qualquer fundo — exigência
  do briefing que já motivou ajuste de dois tons da paleta.
- Navegação por teclado com foco visível; `aria-expanded`/`aria-controls` no menu
  e no acordeão; `role="alert"` nos erros do formulário; `alt` em todas as imagens;
  `lang="pt-BR"`; respeito a `prefers-reduced-motion`.
