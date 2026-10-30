# Roldan Eng Software — Site Institucional

Site institucional da **Roldan Eng Software** (criação de sites e SEO), construído
com HTML5 semântico, CSS3 e JavaScript vanilla. Sem frameworks, sem etapas de build.

## Mapa de rotas

| Rota | Arquivo |
| --- | --- |
| `/` | `index.html` |
| `/criacao-de-sites/institucional/` | `criacao-de-sites/institucional/index.html` |
| `/criacao-de-sites/cidade/` | `criacao-de-sites/cidade/index.html` |
| `/seo/otimizacao-de-site/` | `seo/otimizacao-de-site/index.html` |
| `/seo/consultoria/` | `seo/consultoria/index.html` |
| `/seo/ia/` | `seo/ia/index.html` |
| `/seo/google-meu-negocio/` | `seo/google-meu-negocio/index.html` |
| `/portfolio/` | `portfolio/index.html` |
| `/blog/` | `blog/index.html` |
| `/blog/posicionamento/` | `blog/posicionamento/index.html` |
| `/blog/seo-local-para-pequenos-negocios/` | `blog/seo-local-para-pequenos-negocios/index.html` |
| `/blog/velocidade-de-site-impacto-buscas/` | `blog/velocidade-de-site-impacto-buscas/index.html` |
| `/blog/escolha-de-dominio-e-hospedagem/` | `blog/escolha-de-dominio-e-hospedagem/index.html` |
| `/contato/` | `contato/index.html` |
| `/sobre/` | `sobre/index.html` |
| `/404.html` | `404.html` |

## Estrutura do projeto

```
institucional/
├── index.html
├── 404.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── placeholder-hero.svg
│   ├── placeholder-sobre.svg
│   └── portfolio-01.svg ... portfolio-06.svg
├── criacao-de-sites/
├── seo/
├── portfolio/
├── blog/
├── contato/
├── sobre/
├── robots.txt
├── sitemap.xml
└── README.md
```

## Rodar localmente

Não há dependências nem etapa de build. Basta abrir `index.html` no navegador.

**Opção 1 — abrir direto:** duplo clique em `index.html`.

**Opção 2 — servidor local (recomendado, evita bloqueio de iframe do Maps):**

```bash
# Python
python -m http.server 8000

# ou Node (npx)
npx serve .
```

Acesse `http://localhost:8000`.

## Publicar

### GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Site institucional da Roldan Eng Software"
   git remote add origin https://github.com/USUARIO/REPO.git
   git push -u origin main
   ```
2. No repositório: **Settings → Pages → Source: Deploy from a branch → branch `main` / root → Save**.
3. O site fica em `https://USUARIO.github.io/REPO/`.

### Vercel

1. Envie o repositório ao GitHub (passos acima) ou use a CLI:
   ```bash
   npx vercel
   ```
2. Para projetos estáticos não há configuração adicional: a Vercel detecta
   automaticamente a raiz com `index.html`.

## Personalização

### Textos

- Todo o conteúdo está em `index.html`, em português do Brasil.
- Títulos das seções ficam nas tags `<h2>`; os `<h1>` é apenas o do hero (SEO).
- Depoimentos, portfólio e FAQ são blocos isolados — localize-os pelos
  comentários `<!-- PLACEHOLDER -->`.

### Cores

Em `css/styles.css`, no bloco `:root`:

| Variável | Cor | Uso |
| --- | --- | --- |
| `--cor-fundo` | `#FFFFFF` | Fundo principal |
| `--cor-fundo-alternado` | `#F4F6F8` | Seções alternadas |
| `--cor-texto` | `#1E293B` | Texto principal |
| `--cor-texto-secundario` | `#5A6A80` | Texto secundário (escurecido do original `#64748B` para manter contraste AA sobre `#F4F6F8`) |
| `--cor-primaria` | `#2563EB` | Botões e destaques |
| `--cor-escura` | `#0F172A` | Header, faixa e footer |
| `--cor-suave` | `#DBEAFE` | Badges e ícones |
| `--cor-sucesso` | `#10B981` | Confirmações |

Ao trocar `--cor-primaria`, verifique o contraste do texto branco sobre ela
(botões) para manter acessibilidade AA.

### Imagens

- **Hero:** substitua `assets/placeholder-hero.svg` por um mockup real
  (PNG/JPG/WebP) e atualize o `src` no bloco do hero.
- **Sobre:** substitua `assets/placeholder-sobre.svg` por uma foto real.
- **Portfólio:** substitua `assets/portfolio-0X.svg` pelas imagens dos projetos
  reais e atualize nome, categoria, link e `alt` de cada card.
- **Compartilhamento:** regenere `assets/og-image.png` (1200x630) com a
  identidade final.
- Todas as imagens já usam `loading="lazy"` (exceto a do hero) e atributos `alt`.

### Formulário de contato

O site não possui formulário publicado: a conversão é feita pelos links do
WhatsApp (na página de contato, um card com botão direto + lista de canais e
mapa, igual à seção de contato da home). A validação de formulário e a
integração com EmailJS seguem em `js/main.js` caso um formulário volte a ser
publicado no futuro.

## Antes de publicar — ajustes obrigatórios

1. **Domínio:** substitua `https://www.seudominio.com.br` em:
   - `index.html` (tag `canonical`, Open Graph `og:url`/`og:image`, Twitter `twitter:image` e JSON-LD)
   - `robots.txt` (linha `Sitemap:`)
   - `sitemap.xml` (tag `<loc>`)
2. **Dados de contato:** substitua os placeholders listados na seção seguinte.
3. **JSON-LD:** atualize telefone, e-mail, endereço e horário no bloco
   `<script type="application/ld+json">` do `index.html`.
4. **Google Maps:** troque o `src` do `<iframe>` da seção de contato pelo embed
   da ficha real (abrir a ficha no Google Maps → Compartilhar → Incorporar mapa).

## Placeholders que precisam ser substituídos

| Placeholder | Onde aparece |
| --- | --- |
| `[ENDEREÇO]` | Seção Contato, JSON-LD |
| `[CIDADE]`, `[UF]`, `[CEP]` | JSON-LD (`address`) |
| `[TELEFONE]` | Seção Contato, footer, JSON-LD (`tel:` e `telephone`) |
| `[WHATSAPP]` | Seção Contato e footer (formato `55DDDNÚMERO` na URL `wa.me`) |
| `[HORÁRIO]` | Seção Contato e footer |
| `[E-MAIL]` | Seção Contato, footer, JSON-LD |
| `[ABERTURA]`, `[FECHAMENTO]` | JSON-LD (`openingHoursSpecification`) |
| `[substituir por depoimento real]` (x2 visíveis; o 3º card está oculto em comentário no `index.html` até o relato real chegar) | Seção Depoimentos |
| `[Nome do cliente]`, `[Cargo]`, `[Empresa]` | Seção Depoimentos |
| `[N]` (avatar) | Seção Depoimentos |
| Projetos ilustrativos (Clínica Bem Estar, Studio Nove, Contábil Norte, Café Serra Alta, Academia Movimento, Advocacia Prado) | Seção Portfólio |
| `https://www.seudominio.com.br` | `index.html`, `robots.txt`, `sitemap.xml` |
| `href="#"` das redes sociais | Footer |
| Imagens `placeholder-*` e `portfolio-0X` | `assets/` |
| `iframe` do Google Maps | Seção Contato |
