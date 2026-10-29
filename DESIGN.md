---
name: "Roldan Eng Software"
description: "Site institucional de criação de sites e SEO com código próprio"
colors:
  primary: "#2563EB"
  primary-dark: "#1D4ED8"
  success: "#10B981"
  bg: "#FFFFFF"
  bg-alt: "#F4F6F8"
  text: "#1E293B"
  text-secondary: "#5A6A80"
  dark: "#0F172A"
  soft: "#DBEAFE"
  border: "#E2E8F0"
  border-light: "#F1F5F9"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.1rem, 6vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
spacing:
  xs: "0.5rem"
  sm: "0.85rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4.5rem"
  4xl: "5.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.6rem"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.6rem"
    border: "1px solid {colors.border}"
  card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "1.75rem"
    border: "1px solid {colors.border}"
---

# Design System: Roldan Eng Software

## Overview

**Creative North Star: "Engenharia aplicada à presença digital"**

O site da Roldan Eng Software transmite confiança e profissionalismo através de uma abordagem minimalista e técnica. A identidade visual prioriza clareza, legibilidade e conversão, com foco em levar o visitante ao contato via WhatsApp. O design é funcional antes de decorativo, com hierarquia bem definida e espaçamento consistente.

**Key Characteristics:**
- **Minimalista e técnico:** Design limpo sem elementos desnecessários
- **Focado em conversão:** Cada elemento guia o usuário para o contato
- **Responsivo e acessível:** Funciona bem em todos os dispositivos
- **Performance-first:** Código próprio, sem dependências pesadas
- **Profissional e direto:** Tom claro e objetivo

## Colors

Paleta focada em cores funcionais com bom contraste para acessibilidade.

### Primary
- **Azul Primário** (#2563EB): Cor principal para botões, links e elementos de ação. Usado para CTAs e elementos interativos.
- **Azul Primário Escuro** (#1D4ED8): Estado hover dos botões primários.

### Success
- **Verde Sucesso** (#10B981): Indicadores de sucesso, validações positivas e elementos confirmativos.

### Neutral
- **Fundo Principal** (#FFFFFF): Background padrão do site.
- **Fundo Alternado** (#F4F6F8): Seções alternadas para criar separação visual.
- **Texto Principal** (#1E293B): Corpo de texto e títulos.
- **Texto Secundário** (#5A6A80): Subtítulos, descrições e informações complementares (ajustado para contraste AA).
- **Fundo Escuro** (#0F172A): Header, footer e seções com fundo escuro.
- **Suave** (#DBEAFE): Backgrounds sutis e destaques.
- **Bordas** (#E2E8F0): Linhas divisórias e bordas de componentes.
- **Bordas Claras** (#F1F5F9): Bordas mais sutis.

**The Contrast Rule.** Todo texto deve ter contraste mínimo AA (4.5:1) com seu background. O texto secundário foi escurecido de #64748B para #5A6A80 para garantir conformidade.

## Typography

### Font Family
**Inter** - Sistema tipográfico moderno, otimizado para leitura em tela com excelente legibilidade.

### Hierarchy
- **Display** (800, clamp(2.1rem, 6vw, 3.4rem), line-height 1.08, letter-spacing -0.02em): Títulos principais da hero section
- **Heading** (700, clamp(1.6rem, 4vw, 2.4rem), line-height 1.15, letter-spacing -0.02em): Títulos de seção
- **Subheading** (700, 1.125rem, line-height 1.15): Títulos de cards e componentes
- **Body** (400, 1rem, line-height 1.65): Texto corrido e descrições
- **Label** (600, 0.875rem - 0.95rem, line-height 1.5): Botões, labels de formulário e navegação

**The Readability Rule.** Máximo de 65-75 caracteres por linha para melhor legibilidade em blocos de texto longos.

## Layout

### Grid System
- **Container:** max-width 1160px, padding-inline 1.25rem (mobile) / 2rem (tablet) / 2.5rem (desktop)
- **Header:** Altura fixa de 72px
- **Seções:** Padding vertical 4.5rem (mobile) / 5.5rem (tablet+)

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** >= 768px
- **Desktop:** >= 1024px
- **Large Desktop:** >= 1280px

### Spacing Scale
Sistema baseado em múltiplos de 0.25rem para consistência rítmica.

## Elevation & Depth

O design utiliza sombras sutis para criar hierarquia sem exagero.

### Shadow Vocabulary
- **Suave** (0 1px 2px rgba(15, 23, 42, 0.05)): Elementos sutis
- **Média** (0 8px 24px rgba(15, 23, 42, 0.07)): Cards e componentes
- **Alta** (0 16px 40px rgba(15, 23, 42, 0.12)): Elementos em destaque (dropdowns, destaques)

**The Subtle Depth Rule.** Sombras são usadas apenas para criar hierarquia e elevação, nunca para decoração excessiva.

## Shapes

### Border Radius
- **Pequeno:** 8px - Elementos compactos
- **Médio:** 10px - Botões e inputs
- **Grande:** 12px - Cards, seções e containers

**The Consistent Rounding Rule.** Todos os elementos seguem a escala de border-radius definida para manter consistência visual.

## Components

### Buttons
- **Primary:** Background #2563EB, texto branco, padding 0.85rem 1.6rem, border-radius 10px. Hover: #1D4ED8
- **Secondary:** Background branco, texto #1E293B, border 1px solid #E2E8F0. Hover: border-color #5A6A80
- **Contorno (sobre fundo escuro):** Background transparente, texto branco, border rgba(255,255,255,0.35). Hover: background rgba(255,255,255,0.1)
- **Claro (CTA):** Background branco, texto #0F172A. Hover: #DBEAFE

### Cards
- **Card de Serviço:** Padding 1.75rem, background branco, border 1px solid #E2E8F0, border-radius 12px, box-shadow suave. Hover: translateY(-4px), box-shadow média
- **Card de Projeto:** Mesmo estilo com overflow hidden para imagem
- **Card de Depoimento:** Padding 1.75rem, flexbox com gap 1rem

### Navigation
- **Header:** Fixed, background rgba(15, 23, 42, 0.92) com backdrop-filter blur, altura 72px
- **Menu Desktop:** Horizontal com dropdowns
- **Menu Mobile:** Painel deslizante inferior

### Forms
- **Input/Textarea:** Padding 0.8rem 0.95rem, border 1px solid #E2E8F0, border-radius 10px
- **Focus:** border-color #2563EB, box-shadow 0 0 0 3px rgba(37, 99, 235, 0.15)
- **Erro:** border-color #DC2626, box-shadow 0 0 0 3px rgba(220, 38, 38, 0.15)

## Do's and Don'ts

### Do:
- **Do** usar o sistema de tokens CSS para cores, espaçamentos e tipografia
- **Do** manter contraste AA em todos os textos
- **Do** usar código próprio sem dependências pesadas
- **Do** priorizar conversão para WhatsApp em todos os CTAs
- **Do** manter hierarquia visual clara com espaçamento consistente
- **Do** testar responsividade em 360px, 768px, 1024px e 1280px

### Don't:
- **Don't** usar termos como "garantido", "número 1" ou promessas exageradas
- **Don't** inventar depoimentos, clientes ou projetos fictícios
- **Don't** adicionar frameworks ou bibliotecas desnecessárias
- **Don't** usar cores fora da paleta definida sem justificativa
- **Don't** quebrar a hierarquia com elementos decorativos excessivos
- **Don't** comprometer performance com animações pesadas (respeitar prefers-reduced-motion)
