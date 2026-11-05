/*
  Fonte dos valores: tabela_precos_landing_cafeteria.xlsx, coluna MÉDIA
  dos painéis Pacotes, Adicionais e Manutenção.
  Mínimos e máximos não são armazenados no repositório.
*/

export const PACKAGE_LEVELS = Object.freeze({
  ESSENTIAL: 'Essencial',
  PROFESSIONAL: 'Profissional',
  COMPLETO: 'Completo'
});

export const BASE_PACKAGES = Object.freeze({
  [PACKAGE_LEVELS.ESSENTIAL]: {
    id: PACKAGE_LEVELS.ESSENTIAL,
    name: 'Essencial',
    price: 1200,
    description: 'Landing one-page responsiva, até 5 seções, cardápio ou tabela simples, mapa e botão de WhatsApp.'
  },
  [PACKAGE_LEVELS.PROFESSIONAL]: {
    id: PACKAGE_LEVELS.PROFESSIONAL,
    name: 'Profissional',
    price: 2300,
    description: 'Tudo do Essencial, com cardápio com fotos, galeria, SEO local, analytics e animações.'
  },
  [PACKAGE_LEVELS.COMPLETO]: {
    id: PACKAGE_LEVELS.COMPLETO,
    name: 'Completo',
    price: 3750,
    description: 'Tudo do Profissional, com carrinho, reservas, cupons, fidelidade e integração com Instagram.'
  }
});

export const ITEMS = Object.freeze({
  cardapio_fotos: {
    id: 'cardapio_fotos',
    name: 'Cardápio digital com atualização inicial',
    price: 450,
    includedIn: [PACKAGE_LEVELS.PROFESSIONAL, PACKAGE_LEVELS.COMPLETO]
  },
  carrinho: {
    id: 'carrinho',
    name: 'Carrinho de pedidos via WhatsApp',
    price: 1150,
    includedIn: [PACKAGE_LEVELS.COMPLETO]
  },
  pagamento_online: {
    id: 'pagamento_online',
    name: 'Pagamento online (Pix ou link)',
    price: 700,
    includedIn: []
  },
  ifood: {
    id: 'ifood',
    name: 'Integração com iFood ou similar',
    price: 600,
    includedIn: []
  },
  reservas: {
    id: 'reservas',
    name: 'Sistema de reservas de mesa',
    price: 550,
    includedIn: [PACKAGE_LEVELS.COMPLETO]
  },
  fidelidade: {
    id: 'fidelidade',
    name: 'Cartão fidelidade digital',
    price: 900,
    includedIn: [PACKAGE_LEVELS.COMPLETO]
  },
  seo_local: {
    id: 'seo_local',
    name: 'Configuração de Google Business Profile e SEO local',
    price: 400,
    includedIn: [PACKAGE_LEVELS.PROFESSIONAL, PACKAGE_LEVELS.COMPLETO]
  },
  copywriting: {
    id: 'copywriting',
    name: 'Copywriting (textos do site)',
    price: 400,
    includedIn: []
  },
  galeria: {
    id: 'galeria',
    name: 'Galeria com fotos profissionais (setup)',
    price: 300,
    includedIn: [PACKAGE_LEVELS.PROFESSIONAL, PACKAGE_LEVELS.COMPLETO]
  },
  analytics: {
    id: 'analytics',
    name: 'Configuração de Analytics e Pixel',
    price: 275,
    includedIn: [PACKAGE_LEVELS.PROFESSIONAL, PACKAGE_LEVELS.COMPLETO]
  },
  tabela_servicos: {
    id: 'tabela_servicos',
    name: 'Tabela de serviços e preços',
    price: 0,
    includedIn: [PACKAGE_LEVELS.ESSENTIAL, PACKAGE_LEVELS.PROFESSIONAL, PACKAGE_LEVELS.COMPLETO]
  },
  agendamento_horarios: {
    id: 'agendamento_horarios',
    name: 'Agendamento online de horários',
    price: null,
    includedIn: []
  },
  catalogo_produtos: {
    id: 'catalogo_produtos',
    name: 'Catálogo de produtos',
    price: null,
    includedIn: []
  },
  formulario_leads: {
    id: 'formulario_leads',
    name: 'Formulário de contato e captura de leads',
    price: null,
    includedIn: []
  },
  multi_unidades: {
    id: 'multi_unidades',
    name: 'Gestão de múltiplas unidades',
    price: null,
    includedIn: []
  },
  promocoes: {
    id: 'promocoes',
    name: 'Promoções e cupons',
    price: null,
    includedIn: [PACKAGE_LEVELS.COMPLETO]
  }
});

export const MAINTENANCE_OPTIONS = Object.freeze([
  {
    id: 'hospedagem',
    name: 'Hospedagem e suporte básico',
    price: 115
  },
  {
    id: 'relatorio_acessos',
    name: 'Relatório mensal de acessos',
    price: 150
  }
]);

export const SEGMENTS = Object.freeze([
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    description: 'Sites para cafés, cafeterias e espaços com menu visual e conversão pelo WhatsApp.',
    card: 'Para cafés e cafeterias com cardápio digital e conversão local.',
    questions: [
      { id: 'cardapio_fotos', text: 'Quer cardápio com fotos e categorias?', itemId: 'cardapio_fotos' },
      { id: 'carrinho', text: 'Quer receber pedidos com carrinho pelo site?', itemId: 'carrinho' },
      { id: 'pagamento_online', text: 'Quer aceitar pagamento online?', itemId: 'pagamento_online' },
      { id: 'ifood', text: 'Quer integração com iFood?', itemId: 'ifood' },
      { id: 'reservas', text: 'Quer reservas de mesa?', itemId: 'reservas' },
      { id: 'fidelidade', text: 'Quer programa de fidelidade?', itemId: 'fidelidade' },
      { id: 'galeria', text: 'Quer galeria de fotos do ambiente?', itemId: 'galeria' },
      { id: 'seo_local', text: 'Quer aparecer bem no Google na sua região?', itemId: 'seo_local' },
      { id: 'analytics', text: 'Quer medir acessos e conversões?', itemId: 'analytics' },
      { id: 'copywriting', text: 'Quer textos profissionais para o site?', itemId: 'copywriting' }
    ]
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Estruturas para restaurantes, pizzarias e hambúrguerias com pedidos e experiência digital.',
    card: 'Para restaurantes, pizzarias e hambúrguerias com delivery e promoções.',
    questions: [
      { id: 'cardapio_fotos', text: 'Quer cardápio com fotos e categorias?', itemId: 'cardapio_fotos' },
      { id: 'carrinho', text: 'Quer pedidos e delivery com carrinho?', itemId: 'carrinho' },
      { id: 'promocoes', text: 'Quer promoções e combos?', itemId: 'promocoes' },
      { id: 'pagamento_online', text: 'Quer pagamento online?', itemId: 'pagamento_online' },
      { id: 'ifood', text: 'Quer integração com iFood ou similar?', itemId: 'ifood' },
      { id: 'reservas', text: 'Quer reservas de mesa?', itemId: 'reservas' },
      { id: 'fidelidade', text: 'Quer programa de fidelidade?', itemId: 'fidelidade' },
      { id: 'galeria', text: 'Quer galeria de pratos e do ambiente?', itemId: 'galeria' },
      { id: 'seo_local', text: 'Quer aparecer no Google na sua região?', itemId: 'seo_local' },
      { id: 'analytics', text: 'Quer medir acessos e conversões?', itemId: 'analytics' },
      { id: 'copywriting', text: 'Quer textos profissionais para o site?', itemId: 'copywriting' }
    ]
  },
  {
    id: 'barbearia',
    name: 'Barbearia',
    description: 'Sites para barbearias com agenda, serviços e presença digital para captar clientes.',
    card: 'Para barbearias com agenda online e presença local forte.',
    questions: [
      { id: 'agendamento_horarios', text: 'Quer agendamento online de horários?', itemId: 'agendamento_horarios' },
      { id: 'tabela_servicos', text: 'Quer tabela de serviços e preços?', itemId: 'tabela_servicos' },
      { id: 'galeria', text: 'Quer galeria de cortes e trabalhos?', itemId: 'galeria' },
      { id: 'fidelidade', text: 'Quer programa de fidelidade?', itemId: 'fidelidade' },
      { id: 'seo_local', text: 'Quer aparecer no Google na sua região?', itemId: 'seo_local' },
      { id: 'pagamento_online', text: 'Quer pagamento antecipado online?', itemId: 'pagamento_online' },
      { id: 'analytics', text: 'Quer medir acessos e conversões?', itemId: 'analytics' },
      { id: 'copywriting', text: 'Quer textos profissionais para o site?', itemId: 'copywriting' }
    ]
  },
  {
    id: 'supermercado',
    name: 'Supermercado',
    description: 'Supermercados e lojas com catálogo, ofertas, pedidos e operação multiunidade.',
    card: 'Para supermercados e varejo com catálogo online e melhorias de conversão.',
    questions: [
      { id: 'catalogo_produtos', text: 'Quer catálogo de produtos online?', itemId: 'catalogo_produtos' },
      { id: 'promocoes', text: 'Quer ofertas da semana e promoções?', itemId: 'promocoes' },
      { id: 'carrinho', text: 'Quer pedidos com carrinho pelo site?', itemId: 'carrinho' },
      { id: 'ifood', text: 'Quer integração com apps de delivery?', itemId: 'ifood' },
      { id: 'pagamento_online', text: 'Quer pagamento online?', itemId: 'pagamento_online' },
      { id: 'seo_local', text: 'Quer aparecer no Google na sua região?', itemId: 'seo_local' },
      { id: 'multi_unidades', text: 'Tem mais de uma loja?', itemId: 'multi_unidades' },
      { id: 'analytics', text: 'Quer medir acessos e conversões?', itemId: 'analytics' },
      { id: 'copywriting', text: 'Quer textos profissionais para o site?', itemId: 'copywriting' }
    ]
  },
  {
    id: 'clinica',
    name: 'Clínica',
    description: 'Sites para clínicas, consultórios e centros de saúde com agendamento e conversão digital.',
    card: 'Para clínicas, saúde e estética com agenda e captação de pacientes.',
    questions: [
      { id: 'agendamento_horarios', text: 'Quer agendamento online de consultas?', itemId: 'agendamento_horarios' },
      { id: 'formulario_leads', text: 'Quer formulário de contato e pré-agendamento?', itemId: 'formulario_leads' },
      { id: 'galeria', text: 'Quer galeria da estrutura e da equipe?', itemId: 'galeria' },
      { id: 'seo_local', text: 'Quer aparecer no Google na sua região?', itemId: 'seo_local' },
      { id: 'multi_unidades', text: 'Tem mais de uma unidade?', itemId: 'multi_unidades' },
      { id: 'analytics', text: 'Quer medir acessos e conversões?', itemId: 'analytics' },
      { id: 'copywriting', text: 'Quer textos profissionais para o site?', itemId: 'copywriting' }
    ]
  }
]);

export const DEFAULT_SEGMENT_ID = 'cafeteria';
